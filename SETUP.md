# Connect the Power BI template

Use this checklist after the Viva Insights inputs show **Success**. If the
inputs have not been created, start with the detailed [CoworkSuperUser setup
runbook](docs/QUERY_SETUP.md).

## Choose the matching file

| Available consumption input | Open |
| --- | --- |
| Consumption Dashboard **Export by day** folder | [`CoworkSuperUser - Optimized Export.pbit`](CoworkSuperUser%20-%20Optimized%20Export.pbit) |
| Successful custom Consumption query | [`CoworkSuperUser - Direct Query.pbit`](CoworkSuperUser%20-%20Direct%20Query.pbit) |

Do not configure both paths. Both files produce the same report pages and use
Power BI Import storage.

## Optimized Export

Before opening the template, confirm that:

- The Person Query shows **Success** and you have its copied result link.
- The dashboard ZIP is extracted to a protected folder.
- Exactly one supported consumption file exists beneath that folder: the
  current `PersonServiceCreditsMetrics.csv` or legacy
  `PersonM365CreditsMetrics.csv`. `PeopleMetaData.csv` may remain beside it.

Then:

1. Open `CoworkSuperUser - Optimized Export.pbit`.
2. Enter:

  | Parameter | Value |
  | --- | --- |
  | Partition Identifier | Partition ID from the Person Query link |
  | Person Query Identifier | Query ID from the Person Query link |
  | Viva Export Folder Path | Folder path, not the CSV file path |

3. Select **Load**.
4. Select **Organizational account** and sign in with an account that can read
  the Person Query partition.
5. If prompted for a privacy level, use the level approved by your
  organization; **Organizational** is commonly appropriate.

## Direct Query

Before opening the template, confirm that both queries show **Success**, both
links contain the same Partition ID, and the account loading Power BI can read
both results.

Then:

1. Open `CoworkSuperUser - Direct Query.pbit`.
2. Enter the raw GUIDs only:

  | Parameter | Value |
  | --- | --- |
  | Partition Identifier | Shared Partition ID |
  | Person Query Identifier | Person Query ID |
  | Consumption Query Identifier | Consumption Query ID |

3. Select **Load**.
4. Select **Organizational account** and sign in with the Insights Analyst
  account that can read both results.

## Validate the result

Before sharing the report, confirm:

- **Start Here** opens first and no visual displays an error.
- Population and completed weeks match the Person Query.
- Sessions and credits reconcile to Cowork consumption over the same period.
- Organization fields populate when they were selected.
- **Work Pattern Context** exposes each supplied metric and hides metrics that
  were not supplied.
- The history message reflects the available complete weeks.
- Aggregate person-derived results are suppressed below 10 people.

## Optional: publish and refresh

1. Save the loaded report as PBIX.
2. Apply the customer's required sensitivity label.
3. Publish to an approved Power BI or Fabric workspace.
4. Configure the Viva Insights data source with OAuth2 credentials.
5. For Optimized Export, configure an on-premises data gateway with access to
  the export folder and replace the CSV before each refresh.
6. For Direct Query, enable Auto-Refresh on both saved Viva Insights queries if
  recurring updates are needed.
7. Schedule Power BI refresh after the inputs update, run one on-demand
  refresh, and verify the newest complete week.

See [Troubleshooting](docs/TROUBLESHOOTING.md) if a check fails. Review the
[Interpretation Guide](INTERPRETATION_GUIDE.md) before presenting results.
