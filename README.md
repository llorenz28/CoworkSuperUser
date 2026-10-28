# CoworkSuperUser

A customer-ready Power BI report for exploring tier-focused Cowork super-user activity: concentration, trends, cohort and group behavior, share shift, and directional scenario value.

> **Demonstration only:** The included sample CSVs contain synthetic data. Value estimates are scenario outputs, not forecasts or guaranteed realized savings.

> **Release status: Public and in testing.** The replacement template and demonstration PBIX are exact copies of the supplied files. Desktop behavior and full package privacy have not been revalidated for these replacements. See the [release manifest](RELEASE-MANIFEST.md).

## Walkthrough

https://github.com/user-attachments/assets/f9f3fb74-f162-45a1-ab34-1977b0557cbb

**[Open or download the 3:43 natural-voice walkthrough](media/CoworkSuperUser-Walkthrough.mp4)**
![CoworkSuperUser overview from the reference report](assets/overview.png)

## Downloads

- [Power BI report (`CoworkSuperUser.pbix`)](CoworkSuperUser.pbix)
- [Power BI template (`CoworkSuperUser.pbit`)](CoworkSuperUser.pbit)
- [Interpretation guide (`CoworkSuperUser Interpretation Guide.pptx`)](CoworkSuperUser%20Interpretation%20Guide.pptx)
- [Walkthrough (`media/CoworkSuperUser-Walkthrough.mp4`)](media/CoworkSuperUser-Walkthrough.mp4)
- [Synthetic weekly metrics](sample-data/CoworkWeeklyMetrics.csv)
- [Synthetic people metadata](sample-data/PeopleMetaData.csv)
- [Release manifest](RELEASE-MANIFEST.md)

## Get your Cowork data

> Export by week to support multi-week trend analysis.

1. Go to [aka.ms/copilotdashboard](https://aka.ms/copilotdashboard).
2. Open **Consumption Dashboard**.
3. Select **Explore Cowork**.
4. Click **Export data**.
5. Select **Create new**.
6. Choose **Export by week**.
7. Click **Export to CSV**.
8. Save or rename the export as `CoworkWeeklyMetrics.csv`.
9. Prepare `PeopleMetaData.csv` using the [included sample schema](sample-data/PeopleMetaData.csv).
10. Place both files in one folder. Open the PBIT, enter that folder for the required `DataFolder` parameter, and refresh.

See [SETUP.md](SETUP.md) for prerequisites, schemas, validation, and troubleshooting.

## Eight report pages

| Page | What it answers |
|---|---|
| Overview | What is the overall usage profile and where are the main signals? |
| Cost Concentration | How concentrated are credits and tasks among high-usage tiers? |
| Trends | How do usage, participation, and tier patterns change over time? |
| Group Breakdown | How do cohorts or organizational groups compare? |
| Value assumptions | What directional value results follow from adjustable scenario assumptions? |
| Appendix - Share Shift | How does activity share move among tiers over time? |
| Metric Glossary | How are the report's measures and terms defined? |
| Category assumptions | How are task categories interpreted and grouped? |

## Privacy and interpretation

- The included sample CSV records are synthetic demonstration data.
- Sample identifiers use `SYN-P####` and `SYN-H####`; the sample files contain no names or email addresses.
- Do not use this sample to infer facts about real people or organizations.
- Scenario value depends on user-selected assumptions and should support discussion and validation, not be represented as guaranteed savings.
- Before using organizational data, apply your privacy, security, retention, access-control, and responsible-use requirements.

## Troubleshooting

- **Refresh cannot find files:** update the Power Query source to the local `sample-data` folder.
- **Rows do not join:** preserve the exact headers and ensure every weekly row's `PeopleHistoricalId` exists in metadata.
- **Unexpected page results:** clear filters/slicers and confirm both CSVs were refreshed.
- **Video does not render inline:** use the prominent open/download link above; GitHub rendering varies by client.
- **Power BI version warning:** update Power BI Desktop and retry.

Public access requires no GitHub sign-in for browsing or downloading these files.

## Related Microsoft reference

This report is a Cowork-specific implementation with its own schema and model; it does not ingest the Viva Insights Person Query schema. For the broader Microsoft super-user methodology and its separate setup requirements, see [`microsoft/DecodingSuperUsage`](https://github.com/microsoft/DecodingSuperUsage).

## Project policies

Contributions are welcome under [CONTRIBUTING.md](CONTRIBUTING.md). Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md). Content is provided under the [MIT License](LICENSE), with reference-content notices in [ATTRIBUTION.md](ATTRIBUTION.md).
