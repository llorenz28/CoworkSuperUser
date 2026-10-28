# Troubleshooting

This guidance applies to the current two-file `DataFolder` release. The saved
query guidance in [QUERY_SETUP.md](QUERY_SETUP.md) is historical and does not
apply to [`CoworkSuperUser.pbit`](../CoworkSuperUser.pbit).

## The Viva Insights web app does not open

- Sign in to **[aka.ms/copilotdashboard](https://aka.ms/copilotdashboard)** with
	the intended organizational account.
- Confirm that the account has an active Exchange Online account in an eligible
	Microsoft 365 or Office 365 tenant.
- Ask an AI Administrator or Global Administrator to confirm that the Viva
	Insights web app is enabled for your user or group.
- An AI Administrator can manage the policy but is not automatically granted
	dashboard access. Add that administrator as a dashboard user if they also
	need to export.
- Allow up to 24 hours after an access-policy change.

## Consumption Dashboard or Explore Cowork is missing

- Confirm the tenant has at least 50 assigned Microsoft Copilot or Viva
	Insights licenses and has completed initial data processing.
- Confirm that Cowork activity exists for the tenant and selected context.
- If you are a delegate, ask the leader to grant **Combined access**. The
	**Your company** scope does not include the Consumption Dashboard.
- Confirm that tenant feature policies do not exclude your account.

## Export data is missing

The standard export is available only to users with global Copilot Dashboard
access. Managers with only team-level views cannot export.

Global access may come from Microsoft 365 Global Administrator access, Viva
Insights Analyst global access, eligible senior-leader access, manual
assignment, or delegation from a globally enabled user. If you have global
access and still do not see the control, ask an AI Administrator or Global
Administrator whether data export is disabled through Viva Feature Access
Management. The export capability can also vary while the feature is in public
preview.

## The download does not start

Large exports can take time to prepare. Keep the dashboard page open and wait
for the browser download to begin. If an error appears, verify network access
and retry later. Do not repeatedly start parallel exports.

## A required CSV is missing

The report requires both files with exact names:

- `CoworkWeeklyMetrics.csv`
- `PeopleMetaData.csv`

Extract the complete dashboard download. If the current Cowork export does not
provide both files or the documented columns, stop and confirm export
availability and format with the dashboard administrator. Do not fabricate a
missing file or infer identifiers.

## Power BI says a column is missing or has the wrong type

Compare the first row of each CSV with the exact schemas in
[`SETUP.md`](../SETUP.md). Common causes are:

- Renamed or deleted columns
- Excel changing the file delimiter or encoding
- Dates not convertible using the `en-US` locale
- Text in the two numeric usage columns
- Invalid values in `IsCopilotLicensed`

Download a fresh export and preserve its identifiers. Do not manually re-key
`PeopleHistoricalId`.

## Power BI cannot find the files

Open **Transform data > Edit parameters** and verify `DataFolder`.

- For a local source, provide the folder path, not a CSV filename.
- For SharePoint, provide the exact folder URL containing both files and sign in
	with an organizational account.
- Keep both required CSVs together and remove stale copies with the same names
	from nested folders.

If Power BI is reusing the wrong credentials, open **File > Options and
settings > Data source settings**, select the source, clear its permissions,
and sign in again with the correct account.

## Visuals are blank after a successful refresh

- Confirm the export contains Cowork tasks and credits for complete weeks.
- Clear report filters and reopen **Overview**.
- Confirm `PeopleHistoricalId` is populated in both files and matches across
	the usage and metadata inputs.
- Blank organization or function breakdowns can indicate that organizational
	data was not uploaded or that `FunctionType` was not supplied.
- Review **Metric Glossary** for metrics that intentionally return blank when
	their required source or assumption is unavailable.

## Dashboard totals and report totals differ

The week-level export contains completed weeks and can be up to six days behind.
The dashboard can include partial-week activity. The standard export is not
customizable, so on-screen scope, job-function, or time filters do not
necessarily define the downloaded population. Compare the same completed dates
and population before treating a difference as a defect.

## Refresh fails after publishing

- A local `DataFolder` requires an on-premises data gateway with access to that
	folder.
- A SharePoint folder requires organizational-account credentials in the
	semantic model settings.
- Replace both CSV files as one coordinated update before refresh so the usage
	and metadata inputs remain aligned.
- Schedule refresh only after the new dashboard export has been placed in the
	configured folder.

## A populated report is being shared

The public template has no preconfigured row-level security role. Apply the
organization's required sensitivity label, workspace permissions, retention,
and tested row-level security before sharing restricted data. Treat anonymized
or pseudonymous identifiers as potentially personal data.

