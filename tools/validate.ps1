param(
    [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot ".."))
)

$ErrorActionPreference = "Stop"
$python = (Get-Command python -ErrorAction Stop).Source
$projects = @(
    "src\optimized-export\CoworkVivaV3.pbip",
    "src\direct-query\CoworkVivaV3.pbip"
)

$headerContracts = @{
    "00_start_here" = @{ Visual = "sh_title"; X = 59; Right = 1307 }
    "06_adoption_over_time" = @{ Visual = "dce6b71b3a9ac25423ca"; X = 59; Right = 1307 }
    "c2e315038d903964e507" = @{ Visual = "eec514d7908e94e59f05"; X = 59; Right = 1307 }
    "102_adoption_attributes" = @{ Visual = "title_header_102attributes"; X = 16; Right = 1264 }
    "92d_action_maturity" = @{ Visual = "am_title"; X = 16; Right = 1264 }
    "92e_cowork_champions" = @{ Visual = "9ddc19013bfcf0627dd5"; X = 16; Right = 1264 }
    "92_activity_value" = @{ Visual = "av_title"; X = 16; Right = 1264 }
    "92_actions_hub" = @{ Visual = "mv_ax_ax_title"; X = 16; Right = 1264 }
    "100_glossary" = @{ Visual = "glossary_title"; X = 59; Right = 1307 }
}

foreach ($relativePath in $projects) {
    $project = Join-Path $RepositoryRoot $relativePath
    & powerbi-report-author validate $project | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw "PBIR validation failed for $relativePath"
    }

    & $python (Join-Path $PSScriptRoot "sync_metric_glossary.py") --check | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw "Metric glossary synchronization failed."
    }

    $projectRoot = Split-Path $project
    $pagesPath = Join-Path $projectRoot "CoworkVivaV3.Report\definition\pages\pages.json"
    $pages = Get-Content $pagesPath -Raw | ConvertFrom-Json
    if ($pages.activePageName -ne "00_start_here") {
        throw "Start Here is not the active page in $relativePath"
    }

    $subtitlePath = Join-Path $projectRoot "CoworkVivaV3.Report\definition\pages\00_start_here\visuals\sh_subtitle\visual.json"
    $subtitle = Get-Content $subtitlePath -Raw
    if ($subtitle -notmatch "Optimized Export" -or $subtitle -notmatch "Direct Query") {
        throw "Start Here does not describe both connection paths in $relativePath"
    }

    foreach ($pageId in $headerContracts.Keys) {
        $contract = $headerContracts[$pageId]
        $headerPath = Join-Path $projectRoot "CoworkVivaV3.Report\definition\pages\$pageId\visuals\$($contract.Visual)\visual.json"
        $header = Get-Content $headerPath -Raw | ConvertFrom-Json
        $right = $header.position.x + $header.position.width
        if ($header.position.x -ne $contract.X -or $right -ne $contract.Right) {
            throw "Header alignment failed for $pageId in $relativePath"
        }
    }
}

$sensitivePatterns = @(
    "C:\\PBIQA",
    "qa-real-"
)

$sourceFiles = Get-ChildItem (Join-Path $RepositoryRoot "src") -Recurse -File
foreach ($pattern in $sensitivePatterns) {
    $match = $sourceFiles | Select-String -SimpleMatch $pattern
    if ($match) {
        throw "Sensitive source value found: $pattern"
    }
}

$optimizedExpressions = Get-Content (Join-Path $RepositoryRoot "src\optimized-export\CoworkVivaV3.SemanticModel\definition\expressions.tmdl") -Raw
$directExpressions = Get-Content (Join-Path $RepositoryRoot "src\direct-query\CoworkVivaV3.SemanticModel\definition\expressions.tmdl") -Raw
if ($optimizedExpressions -notmatch "Viva Export Folder Path" -or $optimizedExpressions -match "Consumption Query Identifier") {
    throw "Optimized Export source contract is incorrect."
}
if ($directExpressions -notmatch "Consumption Query Identifier" -or $directExpressions -match "Viva Export Folder Path") {
    throw "Direct Query source contract is incorrect."
}
foreach ($expressions in @($optimizedExpressions, $directExpressions)) {
    $populatedParameter = [regex]::Match(
        $expressions,
        "expression '(Partition Identifier|Person Query Identifier|Consumption Query Identifier|Viva Export Folder Path)' = ""[^""]+"""
    )
    if ($populatedParameter.Success) {
        throw "A customer parameter contains a persisted value."
    }
}

$requiredPersonFields = @(
    "Person ID",
    "Organization",
    "Function",
    "Level",
    "Manager Source",
    "Collaboration Hours",
    "Active Connected Hours",
    "Email Hours",
    "Chat Hours",
    "Meeting Hours",
    "Unscheduled Call Hours",
    "After Hours Collaboration",
    "Weekend Collaboration Hours",
    "Collaboration Span",
    "Internal Network Size",
    "External Network Size",
    "Strong Ties",
    "Diverse Ties",
    "Network Outside Organization"
)
foreach ($variant in @(
    @{ Name = "optimized-export"; Expressions = $optimizedExpressions },
    @{ Name = "direct-query"; Expressions = $directExpressions }
)) {
    foreach ($field in $requiredPersonFields) {
        if (-not $variant.Expressions.Contains($field, [StringComparison]::Ordinal)) {
            throw "$($variant.Name) is missing required Person Query field: $field"
        }
    }
    if (
        $variant.Expressions -notmatch
        '\[(?:Service Name|ServiceName)\]\s*=\s*"Cowork"'
    ) {
        throw "$($variant.Name) is missing the exact Service Name = Cowork filter."
    }
}

$legacyTerms = @(
    "Novice Users",
    "Novice User Share",
    "Cowork Novice User",
    "Novice users"
)
foreach ($term in $legacyTerms) {
    $match = $sourceFiles | Select-String -SimpleMatch $term
    if ($match) {
        throw "Legacy model terminology remains: $term"
    }
}

$setupDocuments = @(
    (Join-Path $RepositoryRoot "README.md"),
    (Join-Path $RepositoryRoot "SETUP.md"),
    (Join-Path $RepositoryRoot "docs\QUERY_SETUP.md")
)
$setupText = ($setupDocuments | ForEach-Object {
    Get-Content $_ -Raw
}) -join "`n"
$requiredSetupInstructions = @(
    "Person Query",
    "Group by",
    "Week",
    "Person ID",
    "Organization",
    "Function",
    "Level",
    "manager",
    "Collaboration hours",
    "Active connected hours",
    "Email hours",
    "Chat hours",
    "Meeting hours",
    "Unscheduled call hours",
    "After-hours collaboration",
    "Weekend collaboration hours",
    "Collaboration span",
    "Collaboration activity",
    "Collaboration network",
    "Collaboration by day of the week",
    "Internal network size",
    "External network size",
    "Strong ties",
    "Diverse ties",
    "Network outside organization",
    "ServiceName = Cowork",
    "Session count",
    "Total Copilot Credits used",
    "Spending policy limit",
    "User limit",
    "Partition Identifier",
    "Person Query Identifier",
    "Consumption Query Identifier",
    "Consumption Dashboard",
    "Export by day",
    "PersonServiceCreditsMetrics.csv",
    "global partition",
    "Organizational account",
    "OAuth2",
    "Data source settings",
    "privacy",
    "gateway"
)
foreach ($instruction in $requiredSetupInstructions) {
    if (-not $setupText.Contains($instruction, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Public setup documentation is incomplete: $instruction"
    }
    if (
        $optimizedExpressions -notmatch "PersonServiceCreditsMetrics\.csv" -or
        $optimizedExpressions -notmatch "TotalCreditsUsed"
    ) {
        throw "Optimized Export does not support the official Consumption Dashboard export schema."
    }
}
if ($setupText -match "(?i)(last\s+6\s+months|rolling\s+last\s+6|six\s+months)") {
    throw "Public setup documentation still requests a fixed six-month period."
}
$publicReadme = Get-Content (Join-Path $RepositoryRoot "README.md") -Raw
foreach ($privateValidationCount in @("43,440", "3,620", "81,798")) {
    if ($publicReadme.Contains($privateValidationCount, [StringComparison]::Ordinal)) {
        throw "Tenant-derived validation count remains in README: $privateValidationCount"
    }
}

$manifestPath = Join-Path $RepositoryRoot "validation\release-manifest.json"
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
Add-Type -AssemblyName System.IO.Compression.FileSystem
foreach ($artifact in $manifest.artifacts) {
    $path = Join-Path $RepositoryRoot ([string]$artifact.path)
    if (-not (Test-Path $path)) {
        throw "Release artifact is missing: $($artifact.path)"
    }
    $hash = (Get-FileHash $path -Algorithm SHA256).Hash
    if ($hash -ne $artifact.sha256) {
        throw "Release hash mismatch: $($artifact.path)"
    }

    $extension = [IO.Path]::GetExtension($path)
    if ($extension -eq ".pptx") {
        $signature = [IO.File]::ReadAllBytes($path)[0..3]
        if (
            $signature[0] -ne 0x50 -or
            $signature[1] -ne 0x4B -or
            $signature[2] -ne 0x03 -or
            $signature[3] -ne 0x04
        ) {
            throw "PPTX is not an unprotected Open XML package: $($artifact.path)"
        }
        $presentation = [System.IO.Compression.ZipFile]::OpenRead($path)
        try {
            if (
                -not $presentation.GetEntry("[Content_Types].xml") -or
                -not $presentation.GetEntry("ppt/presentation.xml")
            ) {
                throw "PPTX package structure is incomplete: $($artifact.path)"
            }
        }
        finally {
            $presentation.Dispose()
        }
        continue
    }

    if ($extension -ne ".pbit") {
        continue
    }
    $archive = [System.IO.Compression.ZipFile]::OpenRead($path)
    try {
        $schemaEntry = $archive.GetEntry("DataModelSchema")
        if (-not $schemaEntry) {
            throw "DataModelSchema is missing from $($artifact.path)"
        }
        $schemaStream = $schemaEntry.Open()
        try {
            $reader = [IO.StreamReader]::new($schemaStream, [Text.Encoding]::Unicode)
            $schema = $reader.ReadToEnd() | ConvertFrom-Json -Depth 100
        }
        finally {
            $reader.Dispose()
        }
        foreach ($expression in $schema.model.expressions) {
            if (
                $expression.name -in @(
                    "Partition Identifier",
                    "Person Query Identifier",
                    "Consumption Query Identifier",
                    "Viva Export Folder Path"
                ) -and
                $expression.expression -notmatch "^null meta "
            ) {
                throw "A PBIT customer parameter is populated: $($expression.name)"
            }
        }

        foreach ($entry in $archive.Entries) {
            if ($entry.Length -gt 5MB) {
                continue
            }
            $stream = $entry.Open()
            try {
                $memory = [System.IO.MemoryStream]::new()
                $stream.CopyTo($memory)
                $bytes = $memory.ToArray()
            }
            finally {
                $stream.Dispose()
            }
            $text = [Text.Encoding]::UTF8.GetString($bytes) + [Text.Encoding]::Unicode.GetString($bytes)
            foreach ($pattern in $sensitivePatterns) {
                if ($text.Contains($pattern, [StringComparison]::OrdinalIgnoreCase)) {
                    throw "Sensitive value found in $($artifact.path): $pattern"
                }
            }
        }
    }
    finally {
        $archive.Dispose()
    }
}

Write-Host "CoworkSuperUser validation passed."
