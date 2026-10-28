# CoworkSuperUser

> **Turn Microsoft 365 Copilot Cowork usage into a clear, privacy-aware view of
> activity, concentration, trends, group patterns, and modeled value.**

[![Status](https://img.shields.io/badge/status-testing-D83B96)](CHANGELOG.md)
[![Power BI](https://img.shields.io/badge/Power%20BI-PBIT%20%2B%20synthetic%20PBIX-F2C811)](CoworkSuperUser.pbit)
[![Classification](https://img.shields.io/badge/classification-Public-008272)](SECURITY.md)
[![Microsoft Analytics Hub](https://img.shields.io/badge/Microsoft-Analytics%20Hub-0078D4)](https://microsoft.github.io/Analytics-Hub/)

> [!IMPORTANT]
> **Release status: Public and in testing.** Validate source coverage, privacy
> requirements, assumptions, and outputs before using findings for production
> decisions.

CoworkSuperUser is a Power BI report for program owners, adoption leads,
enablement teams, and analysts who need to understand:

- Cowork users, tasks, credits, and credits per task
- User-initiated versus scheduled activity
- Credit and task concentration across users
- Latest-versus-prior period trends
- Differences by organization, function, and usage tier
- Modeled time, cost, gross value, and net value under explicit assumptions
- Category and share-shift patterns that may warrant follow-up

The release contains one data-free Power BI template, one synthetic
demonstration PBIX, a 15-slide interpretation guide, and a narrated walkthrough.
The Metric Glossary prioritizes 35 decision-useful metrics rather than exposing
every internal helper measure.

## Walkthrough

The 3:43 narrated walkthrough tours all eight report pages and explains how to
separate observed usage from calculated and modeled outputs.

https://github.com/microsoft/CoworkSuperUser/raw/refs/heads/main/media/CoworkSuperUser-Walkthrough.mp4

[Open or download the MP4](media/CoworkSuperUser-Walkthrough.mp4)

## Access Required

Open the dashboard at **[aka.ms/copilotdashboard](https://aka.ms/copilotdashboard)**.
The link opens the Viva Insights web app.

Microsoft documents these prerequisites for the dashboard export:

- The person exporting uses an organizational account with an active Exchange
   Online account in an eligible Microsoft 365 or Office 365 tenant.
- The tenant has at least **50 assigned Microsoft Copilot or Viva Insights
   licenses**.
- The person exporting has **global access** to the Copilot Dashboard. Eligible
   access includes a Microsoft 365 Global Administrator, a Viva Insights Analyst
   with global access, a senior leader identified through Entra ID, a user
   manually granted global access, or a delegate of a user with global access.
- Managers with only team-level dashboard access cannot use the standard data
   export feature.
- A delegate needs **Combined access** to see the Consumption Dashboard; the
   **Your company** delegation scope alone does not include it.
- The Viva Insights web app and data export feature must be enabled by policy.
   An AI Administrator or Global Administrator can manage access. An AI
   Administrator is not automatically granted dashboard access and must also be
   added as a user when they need to export.

See Microsoft's
[export prerequisites](https://learn.microsoft.com/viva/insights/org-team-insights/export-copilot-metrics#prerequisites)
and
[dashboard access guidance](https://learn.microsoft.com/viva/insights/advanced/admin/manage-settings-copilot-dashboard).

## Start In 4 Steps

1. Download [`CoworkSuperUser.pbit`](CoworkSuperUser.pbit).
2. Go to **Consumption Dashboard** > **Explore Cowork** > **Export data**.
3. Choose **Export by week** when prompted, then extract the download and place
   `CoworkWeeklyMetrics.csv` and `PeopleMetaData.csv` in the same local or
   SharePoint folder. The standard export is not customized by the on-screen
   filters.
4. Open the template, set the `DataFolder` parameter to that folder, and refresh.

To explore the report without customer data, open the
[`CoworkSuperUser.pbix`](CoworkSuperUser.pbix) synthetic demonstration report.

## Report Pages

| Page | Business question |
| --- | --- |
| **Overview** | How much Cowork activity is observed, who is active, and what is the current task and credit mix? |
| **Cost Concentration** | How concentrated are credits and tasks among the highest-usage users? |
| **Trends** | How are credits, tasks, and credits per task changing across complete periods? |
| **Group Breakdown** | How do activity and intensity differ by organization, function, or usage tier? |
| **Value assumptions** | What modeled cost and value result from the selected labor, credit, realization, and time assumptions? |
| **Appendix – Share Shift** | Which cohorts or categories are gaining or losing share between periods? |
| **Metric Glossary** | What do the 35 priority metrics mean, and are they observed, calculated, modeled, or selected inputs? |
| **Category assumptions** | Which time-saved assumptions are applied to each task category? |

The report opens on **Overview**. All standard pages use a 1280 × 720 canvas.

## Required Data

Use the export from **Consumption Dashboard** > **Explore Cowork**. The report
expects the two CSV files below in the same folder and with these exact names.

`CoworkWeeklyMetrics.csv` must contain these seven headers:

```text
PersonId,MetricDate,TaskCategory,TaskType,Total credits used,Total Cowork tasks,PeopleHistoricalId
```

`PeopleMetaData.csv` must contain these four headers:

```text
PeopleHistoricalId,Organization,FunctionType,IsCopilotLicensed
```

Use UTF-8 comma-delimited CSV files. Dates, numeric values, and
`IsCopilotLicensed` must be convertible by Power Query using the `en-US` locale.
The template does not silently fall back to sample data when a required file is
missing or invalid.

The week-level export provides up to six months of completed-week history and
can be up to six days behind. Dashboard totals can differ from the export when
the on-screen dashboard includes a partial week. If the export does not contain
both required files or the schemas below, stop and resolve dashboard/export
access rather than fabricating or manually inferring missing rows.

`DataFolder` may be either:

- A local folder, such as `C:\CoworkData\`
- An exact SharePoint folder URL containing both files

For SharePoint, authenticate with an organizational account and use the privacy
level required by your tenant policy.

## Synthetic Demonstration Data

The distributed PBIX contains only the generated synthetic dataset used for
the public demonstration:

| Input | Rows | Coverage |
| --- | ---: | --- |
| `CoworkWeeklyMetrics.csv` | 14,599 | 219 fictional active IDs; 2026-07-06 through 2026-10-19 |
| `PeopleMetaData.csv` | 240 | Fictional metadata across four generic regions and eight generic functions |

The synthetic inputs and packaged PBIX contain no detected email addresses,
customer query identifiers, or local user-profile paths.

## Interpretation Boundaries

1. Tasks and credits describe observed Cowork activity; they do not measure
   productivity, quality, complexity, or employee performance.
2. Credits are consumption units, not financial cost, unless a reviewed cost
   assumption is applied.
3. Time saved, gross value, net value, and value-per-cost outputs are modeled
   scenarios, not measured savings or accounting ROI.
4. Group differences are descriptive and do not establish causation.
5. Concentration identifies where activity occurs; it is not a personnel score.
6. User-initiated and scheduled activity should be interpreted separately.
7. Latest-versus-prior trends use complete comparison periods and may not follow
   every ordinary week selection.
8. Category assumptions must be reviewed before presenting modeled value.

Use the
[`CoworkSuperUser Interpretation Guide.pptx`](CoworkSuperUser%20Interpretation%20Guide.pptx)
before presenting results.

## Release Kit

| Resource | Open or download |
| --- | --- |
| Data-free Power BI template | [`CoworkSuperUser.pbit`](CoworkSuperUser.pbit) |
| Synthetic demonstration report | [`CoworkSuperUser.pbix`](CoworkSuperUser.pbix) |
| Interpretation guide | [`PPTX`](CoworkSuperUser%20Interpretation%20Guide.pptx) |
| Narrated walkthrough | [`MP4`](media/CoworkSuperUser-Walkthrough.mp4) |
| Setup instructions | [`SETUP.md`](SETUP.md) |
| Security guidance | [`SECURITY.md`](SECURITY.md) |
| Release evidence | [`validation/release-manifest.json`](validation/release-manifest.json) |

## Security And Privacy

The repository and release assets are classified **Public**. The PBIT is
data-free: its `DataFolder` parameter is unset and it contains no imported model
cache. Power BI does not retain Purview sensitivity labels in PBIT exports, so
the Public classification is documented in this README, `SECURITY.md`, and the
release manifest rather than embedded as a PBIT label.

Dashboard exports contain user-level metrics with anonymized identifiers by
default. If an administrator enables identifiable export, the download can also
contain identifiable fields. Treat every export as potentially personal and
confidential data.

Do not place production exports, credentials, tenant identifiers, or customer
PBIX files in this repository. After loading production data, apply the
organization's required sensitivity label and configure access controls before
publishing or sharing the report.

## Repository Structure

```text
CoworkSuperUser.pbit
CoworkSuperUser.pbix
CoworkSuperUser Interpretation Guide.pptx
README.md
SETUP.md
SECURITY.md
media/
validation/
```

## Related Resources

- [Cowork Adoption Intelligence](https://github.com/microsoft/Cowork-Adoption-Intelligence)
- [Cowork Billing](https://microsoft.github.io/Analytics-Hub/cowork-billing/)
- [Microsoft Analytics Hub](https://microsoft.github.io/Analytics-Hub/)
- [Power BI Desktop](https://powerbi.microsoft.com/desktop/)

Use [GitHub Issues](https://github.com/microsoft/CoworkSuperUser/issues) for
reproducible defects and documentation gaps. Do not attach customer data,
credentials, query identifiers, or identifiable screenshots.

## License

This project is licensed under the [MIT License](LICENSE).

## Trademarks

This project may contain Microsoft trademarks or logos. Use of Microsoft
trademarks or logos must follow
[Microsoft's Trademark and Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks).
Modified versions must not cause confusion or imply Microsoft sponsorship.