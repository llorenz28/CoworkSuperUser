# Walkthrough build

The CoworkSuperUser walkthrough mirrors the friendly, professional rhythm of the Cowork Adoption Intelligence walkthrough while using only deterministic fabricated screenshots.

## Story arc

1. Introduce the public data-free template.
2. Start with the business decision.
3. Read reach and sustained use together.
4. Separate weekly reach, return, cohorts, sessions, and credits.
5. Compare organization groups responsibly.
6. Understand movement across usage stages.
7. Identify potential champions responsibly.
8. Keep consumption separate from productivity and value.
9. Use work-pattern differences as non-causal context.
10. Trace definitions before decisions.
11. Build the two Viva Insights analyses and select a connection path.
12. Close with an evidence-aware enablement action.

## Build

Requirements:

- Windows PowerShell or PowerShell 7
- Python 3.10+
- Pillow
- `edge-tts`
- FFmpeg and FFprobe

Run from the repository root:

```powershell
.\media\build_walkthrough.ps1
```

Outputs:

- `CoworkSuperUser-Walkthrough.mp4`
- `CoworkSuperUser-Walkthrough.srt`
- `CoworkSuperUser-Walkthrough-transcript.md`
- `CoworkSuperUser-Walkthrough-timeline.json`

## Release targets

- 1920x1080, 30 fps
- H.264 video
- AAC, 48 kHz stereo audio
- `en-US-AvaNeural` narration at `+5%` rate and `-2Hz` pitch
- Approximately 3 to 4 minutes
- Approximately -18 LUFS integrated loudness
- 0.8-second pauses between story beats
- Public-safe fabricated screenshots only

