# Troubleshooting

## Access to the resource is forbidden

Power BI may be reusing stale Viva Insights credentials.

1. In Power BI Desktop, open **File > Options and settings > Data source settings**.
2. Select the Viva Insights source and choose **Clear Permissions**.
3. Exit Power BI Desktop completely.
4. Reopen the PBIT and sign in with the organizational account that can read
	the Person Query partition. For Direct Query, the account must also be able
	to read the global-partition Consumption query.

If your browser authentication flow is blocked, open **File > Options and settings > Options > Global > Security** and disable **Use my default web browser** to use the embedded sign-in experience.

## Blank visuals

- Confirm the inputs used by the selected path show **Success**.
- Confirm the Person Query uses **Week**, contains Person ID and Metric Date,
	and is unique at one row per person per week.
- Confirm the Person Query and consumption input cover overlapping dates.
- Confirm the consumption input contains `ServiceName = Cowork`, session count,
	and credits.
- If only an organization breakdown or work-pattern control is blank, confirm
	that its optional field was selected in [the setup runbook](QUERY_SETUP.md).

## Work Pattern buttons are missing

The template intentionally hides patterns whose Person query column is absent or entirely blank. Add the missing metric and rerun the Person query.

This does not indicate a failed load. Only add metrics for the views the
customer intends to use.

## Export file not found or duplicated

- Enter the folder path, not the CSV file path.
- Keep exactly one `PersonServiceCreditsMetrics.csv` beneath the configured
	folder. The legacy `PersonM365CreditsMetrics.csv` is also supported, but both
	filenames cannot be present together.
- `PeopleMetaData.csv` may remain in the folder and is ignored.

## Sessions or credits are zero

- Confirm the consumption data includes Cowork rows and overlaps the Person
	Query period.
- For Direct Query, confirm **Group by = Day** and the four default metrics are
	still selected.
- For Optimized Export, download a current **Export by day** file and leave its
	headers unchanged.

## History is provisional or unavailable

This is expected for a new deployment. The selected **Up to 4 weeks** or **Up to 12 weeks** window uses available covered weeks up to that cap. Movement and comparison measures need additional history.

## Local export refresh fails after publishing

The Optimized Export variant reads a local folder. Configure an on-premises data gateway or use the Direct Query template for a connector-only deployment.

## Scheduled refresh

After publishing:

1. Open the semantic model settings in Power BI or Fabric.
2. Configure Viva Insights OAuth credentials.
3. For Direct Query, enable Auto-Refresh on both saved Viva Insights queries.
4. For Optimized Export, replace the CSV and confirm the gateway can read its
	folder.
5. Configure a refresh schedule after the inputs normally update.
6. Verify that a new complete week appears before using the refreshed report.

