<#
.SYNOPSIS
    Builds the CoworkSuperUser narrated walkthrough.
#>
[CmdletBinding()]
param(
    [string]$Voice = 'en-US-AvaNeural',
    [ValidatePattern('^[+-]\d+%$')]
    [string]$Rate = '+5%',
    [ValidatePattern('^[+-]\d+Hz$')]
    [string]$Pitch = '-2Hz',
    [ValidateRange(0.5, 3.0)]
    [double]$SegmentGapSeconds = 0.8
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $PSScriptRoot
$segmentsPath = Join-Path $PSScriptRoot 'walkthrough_segments.json'
$output = Join-Path $PSScriptRoot 'CoworkSuperUser-Walkthrough.mp4'
$transcript = Join-Path $PSScriptRoot 'CoworkSuperUser-Walkthrough-transcript.md'
$subtitles = Join-Path $PSScriptRoot 'CoworkSuperUser-Walkthrough.srt'
$timelinePath = Join-Path $PSScriptRoot 'CoworkSuperUser-Walkthrough-timeline.json'
$temp = Join-Path $PSScriptRoot '.walkthrough-build'
$segments = Get-Content -LiteralPath $segmentsPath -Raw | ConvertFrom-Json
$python = (Get-Command python -ErrorAction Stop).Source

$ffmpegCommand = Get-Command ffmpeg -ErrorAction SilentlyContinue
$ffprobeCommand = Get-Command ffprobe -ErrorAction SilentlyContinue
if ($ffmpegCommand -and $ffprobeCommand) {
    $ffmpeg = $ffmpegCommand.Source
    $ffprobe = $ffprobeCommand.Source
}
else {
    $bin = Get-ChildItem (
        Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages'
    ) -Recurse -File -Filter ffmpeg.exe -ErrorAction Stop |
        Select-Object -First 1 -ExpandProperty DirectoryName
    $ffmpeg = Join-Path $bin 'ffmpeg.exe'
    $ffprobe = Join-Path $bin 'ffprobe.exe'
}

function ConvertFrom-SrtTimestamp {
    param([Parameter(Mandatory)][string]$Value)
    return [TimeSpan]::ParseExact(
        $Value,
        'hh\:mm\:ss\,fff',
        [Globalization.CultureInfo]::InvariantCulture
    ).TotalMilliseconds
}

function ConvertTo-SrtTimestamp {
    param([Parameter(Mandatory)][double]$Milliseconds)
    $span = [TimeSpan]::FromMilliseconds([Math]::Max(0, $Milliseconds))
    return '{0:00}:{1:00}:{2:00},{3:000}' -f `
        [Math]::Floor($span.TotalHours), $span.Minutes, $span.Seconds, $span.Milliseconds
}

if (Test-Path $temp) {
    Remove-Item -LiteralPath $temp -Recurse -Force
}
New-Item -ItemType Directory -Path $temp | Out-Null

& $python -c 'import edge_tts'
if ($LASTEXITCODE -ne 0) {
    throw 'The edge-tts Python package is required.'
}
& $python (Join-Path $PSScriptRoot 'build_walkthrough_assets.py')
if ($LASTEXITCODE -ne 0) {
    throw 'Failed to build walkthrough frames.'
}

$transcriptLines = @(
    '# CoworkSuperUser walkthrough transcript',
    '',
    'The template contains no embedded customer data. Public images use deterministic fabricated data.',
    ''
)
foreach ($segment in $segments) {
    $transcriptLines += "## $($segment.title)"
    $transcriptLines += ''
    $transcriptLines += [string]$segment.text
    $transcriptLines += ''
}
[IO.File]::WriteAllText(
    $transcript,
    (($transcriptLines -join [Environment]::NewLine).TrimEnd() + [Environment]::NewLine),
    [Text.UTF8Encoding]::new($false)
)

$clipFiles = [Collections.Generic.List[string]]::new()
$subtitleLines = [Collections.Generic.List[string]]::new()
$subtitleNumber = 1
$timelineOffsetMs = 0.0
$lastSubtitleEndMs = 0.0
$timeline = [Collections.Generic.List[object]]::new()

for ($i = 0; $i -lt $segments.Count; $i++) {
    $number = $i + 1
    $mp3 = Join-Path $temp ('narration-{0:D2}.mp3' -f $number)
    $segmentSubtitles = Join-Path $temp ('narration-{0:D2}.srt' -f $number)
    $clip = Join-Path $temp ('segment-{0:D2}.mp4' -f $number)
    $image = Join-Path $repo ([string]$segments[$i].image).Replace('/', '\')

    & $python -m edge_tts `
        --voice $Voice `
        --rate=$Rate `
        --pitch=$Pitch `
        --text ([string]$segments[$i].text) `
        --write-media $mp3 `
        --write-subtitles $segmentSubtitles
    if ($LASTEXITCODE -ne 0) {
        throw "Neural narration failed for segment $number."
    }

    $speechDuration = & $ffprobe -v error -show_entries format=duration `
        -of default=noprint_wrappers=1:nokey=1 $mp3
    $totalDuration = [double]$speechDuration + $SegmentGapSeconds
    $fadeOutStart = [Math]::Max(0, $totalDuration - 0.65)
    $fadeStart = $fadeOutStart.ToString(
        '0.000',
        [Globalization.CultureInfo]::InvariantCulture
    )
    $videoFilter = (
        'scale=1920:1080:force_original_aspect_ratio=decrease,' +
        'pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x311F5E,' +
        'fade=t=in:st=0:d=0.65,' +
        "fade=t=out:st=${fadeStart}:d=0.65," +
        'format=yuv420p'
    )

    & $ffmpeg -hide_banner -loglevel error -y `
        -loop 1 -framerate 30 -i $image -i $mp3 `
        -vf $videoFilter `
        -af "loudnorm=I=-18:TP=-2:LRA=7,apad=pad_dur=$SegmentGapSeconds" `
        -c:v libx264 -preset medium -crf 20 -tune stillimage `
        -c:a aac -b:a 192k -ar 48000 -ac 2 `
        -t $totalDuration $clip
    if ($LASTEXITCODE -ne 0) {
        throw "FFmpeg failed for segment $number."
    }

    $segmentSrt = Get-Content -LiteralPath $segmentSubtitles -Raw
    $matches = [regex]::Matches(
        $segmentSrt,
        '(?ms)(\d+)\s*\r?\n(\d{2}:\d{2}:\d{2},\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2},\d{3})\s*\r?\n(.*?)(?=\r?\n\r?\n|\z)'
    )
    foreach ($match in $matches) {
        $start = $timelineOffsetMs + (ConvertFrom-SrtTimestamp $match.Groups[2].Value)
        $end = $timelineOffsetMs + (ConvertFrom-SrtTimestamp $match.Groups[3].Value)
        if ($start -le $lastSubtitleEndMs) {
            $start = $lastSubtitleEndMs + 1
        }
        if ($end -le $start) {
            $end = $start + 1
        }
        $subtitleLines.Add([string]$subtitleNumber)
        $subtitleLines.Add(
            "$(ConvertTo-SrtTimestamp $start) --> $(ConvertTo-SrtTimestamp $end)"
        )
        $subtitleLines.Add($match.Groups[4].Value.Trim())
        $subtitleLines.Add('')
        $subtitleNumber++
        $lastSubtitleEndMs = $end
    }

    $clipDuration = & $ffprobe -v error -show_entries format=duration `
        -of default=noprint_wrappers=1:nokey=1 $clip
    $segmentStart = $timelineOffsetMs / 1000
    $timelineOffsetMs += [double]$clipDuration * 1000
    $timeline.Add([ordered]@{
        id = [string]$segments[$i].id
        title = [string]$segments[$i].title
        startSeconds = [Math]::Round($segmentStart, 3)
        endSeconds = [Math]::Round($timelineOffsetMs / 1000, 3)
        narrationSeconds = [Math]::Round([double]$speechDuration, 3)
        gapSeconds = $SegmentGapSeconds
    })
    $clipFiles.Add($clip)
}

[IO.File]::WriteAllText(
    $subtitles,
    (($subtitleLines -join [Environment]::NewLine).TrimEnd() + [Environment]::NewLine),
    [Text.UTF8Encoding]::new($false)
)
[IO.File]::WriteAllText(
    $timelinePath,
    ($timeline | ConvertTo-Json -Depth 4),
    [Text.UTF8Encoding]::new($false)
)

$concat = Join-Path $temp 'concat.txt'
$clipFiles | ForEach-Object {
    "file '$([IO.Path]::GetFileName($_))'"
} | Set-Content -LiteralPath $concat -Encoding utf8

Push-Location $temp
try {
    & $ffmpeg -hide_banner -loglevel error -y `
        -f concat -safe 0 -i 'concat.txt' -c copy `
        -movflags +faststart `
        -metadata title='CoworkSuperUser Walkthrough' `
        -metadata comment='Adoption and enablement walkthrough using fabricated data.' `
        $output
    if ($LASTEXITCODE -ne 0) {
        throw 'FFmpeg failed while concatenating walkthrough segments.'
    }
}
finally {
    Pop-Location
}

$duration = & $ffprobe -v error -show_entries format=duration `
    -of default=noprint_wrappers=1:nokey=1 $output
$file = Get-Item -LiteralPath $output
Remove-Item -LiteralPath $temp -Recurse -Force

[PSCustomObject]@{
    Output = $file.FullName
    Bytes = $file.Length
    DurationSeconds = [Math]::Round([double]$duration, 1)
    Voice = $Voice
    Rate = $Rate
    Pitch = $Pitch
    Segments = $segments.Count
    Subtitles = $subtitles
    Transcript = $transcript
    Timeline = $timelinePath
}

