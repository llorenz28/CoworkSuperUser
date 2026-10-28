# Setup

This guide covers the CSV-import contract used by `CoworkSuperUser.pbix` and `CoworkSuperUser.pbit`.

## Requirements

- A current Power BI Desktop release
- Both CSV files in the same accessible folder
- Exact filenames and headers shown below

The included sample files are ready to use and fully synthetic.

## Data contract

### `CoworkWeeklyMetrics.csv`

Grain: one person, week, task category, and task type per row.

| Column | Expected type | Requirement |
|---|---|---|
| `PersonId` | Text | Stable person identifier; nonblank |
| `MetricDate` | Date (`YYYY-MM-DD`) | Weekly observation date |
| `TaskCategory` | Text | Category used in report breakdowns |
| `TaskType` | Text | `UserInitiated`, `Scheduled`, or `Unknown` |
| `Total credits used` | Decimal number | Nonnegative credits for the row |
| `Total Cowork tasks` | Whole number | Nonnegative task count |
| `PeopleHistoricalId` | Text | Required key into `PeopleMetaData.csv` |

Supported sample categories are:

- `Analysis & research`
- `Communication workflows`
- `Document & content creation`
- `Email workflows`
- `General assistance / Other`
- `Meeting workflows`
- `Specialized workflows`
- `Write or debug code`

### `PeopleMetaData.csv`

Grain: one row per `PeopleHistoricalId`.

| Column | Expected type | Requirement |
|---|---|---|
| `PeopleHistoricalId` | Text | Unique, nonblank join key |
| `Organization` | Text | Grouping dimension |
| `FunctionType` | Text | Functional grouping dimension |
| `IsCopilotLicensed` | Boolean | `true` or `false` |

Every weekly row must match exactly one metadata row through `PeopleHistoricalId`. Keep identifiers as text and preserve leading zeros where applicable.

## Load the included data

1. Download the repository or the two files in `sample-data`.
2. Keep the CSV files together; do not open them in an application that locks the files during refresh.
3. Open `CoworkSuperUser.pbix` for the populated demonstration, or open `CoworkSuperUser.pbit` to create a new report.
4. If Power BI prompts for a source, enter the folder containing the two CSV files. Otherwise, use **Transform data > Data source settings > Change Source** to replace the existing local path.
5. Apply changes and select **Refresh**.
6. In Model view, confirm the relationship uses `PeopleHistoricalId` and that the metadata side is unique.
7. Check the latest `MetricDate`, row totals, category values, and slicers before saving or publishing.

## Use organizational data

Create both CSVs from approved data using the exact contract above. Remove direct identifiers unless they are necessary and authorized, use stable pseudonymous keys, and apply your organization's privacy, retention, access-control, and minimum-group-size requirements.

This model expects already-prepared Cowork usage facts. It is not the Viva Insights Person Query model used by [`microsoft/DecodingSuperUsage`](https://github.com/microsoft/DecodingSuperUsage), and its schemas are not interchangeable.

## Model behavior

- Credits and tasks aggregate from the weekly fact table.
- Organization and function filters come from metadata through `PeopleHistoricalId`.
- Tier-oriented pages classify and compare users from their usage in the current report context; changing date or group filters can therefore change membership and shares.
- Share-shift views compare how tier shares move over time.
- Value results are directional scenarios driven by report assumptions. They are not forecasts or guaranteed savings.
- Blank or misleading results usually indicate unmatched keys, renamed headers, invalid types, unsupported category values, or active filters.

## Validation checklist

- Both files retain the exact filenames and header capitalization.
- `PeopleHistoricalId` is unique in metadata and has no orphan values in weekly metrics.
- Dates import as dates; credits as decimal numbers; tasks as whole numbers; license flags as Boolean.
- Credits and tasks are nonnegative.
- All expected weeks, categories, organizations, and functions appear.
- Page filters and slicers are cleared when reconciling source totals.
- The report refreshes without errors before it is published.

## Refresh and publish

For a manual refresh, replace the two source CSVs with validated files of the same names and schema, then refresh in Power BI Desktop. After publishing, configure credentials and refresh behavior appropriate to the storage location; a local-only folder may require an on-premises data gateway. Test refresh in the Power BI service and restrict workspace/report access appropriately.

## Troubleshooting

| Symptom | Likely cause | Resolution |
|---|---|---|
| Source file not found | Saved source path differs | Change the source to the folder containing both CSVs |
| Privacy/firewall prompt | Sources have incompatible privacy settings | Set organization-approved privacy levels consistently |
| Relationship or duplicate-key error | Metadata key is blank or repeated | Make `PeopleHistoricalId` unique and nonblank in metadata |
| Blank group or tier visuals | Orphan keys, wrong types, or filters | Validate joins and types, then clear slicers |
| Totals differ from source | Grain duplication or active filters | Aggregate at the documented grain and reconcile with filters cleared |
| Refresh cannot access a CSV | File is locked or service lacks access | Close the editor; use an accessible source and gateway if required |
