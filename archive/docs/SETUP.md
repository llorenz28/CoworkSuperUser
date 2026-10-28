# Detailed setup

This page applies to the current [`CoworkSuperUser.pbit`](../CoworkSuperUser.pbit)
release. It does not require saved query IDs, an Analyst Workbench partition, or
either historical template under `src/`.

## 1. Confirm access

Open **[aka.ms/copilotdashboard](https://aka.ms/copilotdashboard)**. The link
opens the Viva Insights web app.

To use the standard export, Microsoft requires:

- An organizational account with an active Exchange Online account in an
	eligible Microsoft 365 or Office 365 tenant.
- At least **50 assigned Microsoft Copilot or Viva Insights licenses** in the
	tenant.
- **Global Copilot Dashboard access** for the person exporting. This includes
	Microsoft 365 Global Administrators, Viva Insights Analysts with global
	access, eligible senior leaders, users manually granted global access, and
	delegates of globally enabled users.
- The Viva Insights web app and data export feature to be enabled by policy.

Managers with only team-level access cannot export. A delegate needs
**Combined access** to open the Consumption Dashboard; **Your company** scope
alone does not include it. An AI Administrator can manage access policy but is
not automatically granted dashboard access.

If access was recently granted, allow up to 24 hours for the change to appear.
See Microsoft's
[export prerequisites](https://learn.microsoft.com/viva/insights/org-team-insights/export-copilot-metrics#prerequisites),
[access-management guidance](https://learn.microsoft.com/viva/insights/advanced/admin/manage-settings-copilot-dashboard),
and
[delegation guidance](https://learn.microsoft.com/viva/insights/org-team-insights/delegate-access).

## 2. Export Cowork data

1. In the Viva Insights web app, open **Consumption Dashboard**.
2. Under **Explore service insights**, select **Explore Cowork**.
3. Review the displayed **View as**, **Scope**, **Job function**, and time period.
4. Select **Export data** or the download icon.
5. Choose **Export by week** when prompted.
6. Keep the browser page open until the download starts, then extract the
	 downloaded archive.

Use the week-level export because this report analyzes complete weekly periods.
It provides up to six months of history and can be up to six days behind. The
standard Microsoft export is not customizable, so do not assume that on-screen
filters changed the downloaded population. Validate the extracted files before
using them.

## 3. Prepare the input folder

Place these two files in one local or SharePoint folder, using the exact names:

`CoworkWeeklyMetrics.csv`

```text
PersonId,MetricDate,TaskCategory,TaskType,Total credits used,Total Cowork tasks,PeopleHistoricalId
```

`PeopleMetaData.csv`

```text
PeopleHistoricalId,Organization,FunctionType,IsCopilotLicensed
```

Keep the exported identifier values unchanged so the files continue to join on
`PeopleHistoricalId`. Use UTF-8 comma-delimited CSV. Dates, numeric values, and
`IsCopilotLicensed` must be convertible using the `en-US` locale.

`Organization` is sourced from Entra ID or uploaded organizational data.
`FunctionType` depends on the organizational data maintained by an authorized
administrator and can be blank when the attribute is unavailable. Do not infer
or fabricate missing organizational values.

## 4. Load the template

1. Open [`CoworkSuperUser.pbit`](../CoworkSuperUser.pbit) in a current version
	 of Power BI Desktop.
2. Set `DataFolder` to either:
	 - A local folder, such as `C:\CoworkData\`
	 - The exact SharePoint folder URL that contains both files
3. For SharePoint, sign in with an organizational account and use the privacy
	 level required by your tenant policy.
4. Select **Load** and allow the initial refresh to finish.

The template does not use embedded sample data when an input is missing or
invalid. To explore the report without customer data, use the separate
[`CoworkSuperUser.pbix`](../CoworkSuperUser.pbix) synthetic demonstration.

## 5. Validate the refresh

Before interpreting or publishing the report:

1. Confirm that all eight pages open without visual errors.
2. Confirm that the date range matches the complete weeks in the export.
3. Reconcile total Cowork tasks and credits to the source files.
4. Confirm that organization and function values have the expected coverage.
5. Review the time, labor, credit, and realization assumptions before using any
	 modeled value result.
6. Check each definition in **Metric Glossary** before quoting a metric.

The dashboard can include a partial current week while the export contains only
completed weeks. A difference between dashboard and report totals is not by
itself a refresh defect.

## 6. Publish safely

The repository and unpopulated release template are classified **Public**. A
populated report is not automatically Public.

- Treat dashboard exports as potentially personal and confidential data. IDs
	are anonymized by default, but an administrator can enable identifiable
	exports.
- Save populated PBIX files outside this repository.
- Apply the organization's required sensitivity label before sharing.
- Configure workspace permissions and retention for the intended audience.
- No row-level security role is preconfigured; add and test one if restricted
	audiences require it.
- A local `DataFolder` requires an on-premises data gateway for service refresh.
	A SharePoint folder can use organizational-account cloud credentials.
