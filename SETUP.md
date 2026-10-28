# CoworkSuperUser setup

## Access prerequisites

1. Open **[aka.ms/copilotdashboard](https://aka.ms/copilotdashboard)** and
  confirm that the Viva Insights web app loads with an organizational account
  that has an active Exchange Online account.
2. Confirm that the tenant has at least **50 assigned Microsoft Copilot or Viva
  Insights licenses**.
3. Confirm that the person exporting has **global Copilot Dashboard access**.
  This may be through Microsoft 365 Global Administrator access, Viva Insights
  Analyst global access, eligible senior-leader access, manual assignment, or
  delegation from a globally enabled user.
4. If using delegated access, use **Combined access**. The **Your company**
  scope does not include the Consumption Dashboard.
5. Confirm that an AI Administrator or Global Administrator has not disabled
  the Viva Insights web app or data export through feature access management.

Managers with only team-level dashboard access cannot use the standard data
export. Access-policy changes can take up to 24 hours to appear. See Microsoft's
[export prerequisites](https://learn.microsoft.com/viva/insights/org-team-insights/export-copilot-metrics#prerequisites)
and
[access-management guidance](https://learn.microsoft.com/viva/insights/advanced/admin/manage-settings-copilot-dashboard).

## Start here

1. Download [`CoworkSuperUser.pbit`](CoworkSuperUser.pbit).
2. Go to **Consumption Dashboard** > **Explore Cowork**.
3. Review the displayed **View as**, **Scope**, **Job function**, and time
  period as dashboard context. The standard export is not customizable, so do
  not assume these controls change the downloaded population.
4. Select **Export data**, then choose **Export by week** when prompted. The
  week-level export provides up to six months of completed-week history.
5. Extract the download and put both required CSV files in the same local or
  SharePoint folder.
6. Open the PBIT, set `DataFolder` to that folder, and refresh.
7. Validate the report with the checklist below.

To explore the report without customer data, open the
[`CoworkSuperUser.pbix`](CoworkSuperUser.pbix) synthetic demonstration report.

## Required files

`CoworkWeeklyMetrics.csv` must contain:

```text
PersonId,MetricDate,TaskCategory,TaskType,Total credits used,Total Cowork tasks,PeopleHistoricalId
```

`PeopleMetaData.csv` must contain:

```text
PeopleHistoricalId,Organization,FunctionType,IsCopilotLicensed
```

Use UTF-8 comma-delimited CSV files. The template does not fall back to sample
data if a file is missing, inaccessible, or incompatible.

The export can be up to six days behind and contains only completed weeks. The
dashboard can include partial-week activity, so dashboard totals and imported
totals might differ. The export contains anonymized user IDs by default, but it
can contain identifiable fields when an administrator enables identifiable
export. Handle every download as potentially personal and confidential data.

## Configure `DataFolder`

Set `DataFolder` to one of these values:

- A local folder, such as `C:\CoworkData\`
- An exact SharePoint folder URL containing both files

For SharePoint, authenticate with an organizational account and use the privacy
level required by your tenant policy. The folder must contain exactly named
files that match the schemas above.

## Validation

- **Overview** is the opening page.
- All eight pages open without visual errors.
- Active users, tasks, credits, and date coverage reconcile with the source CSVs.
- Organization, function, category, and task-type controls populate.
- Latest-versus-prior trend windows use complete source periods.
- Cost, labor, realization, and category-time assumptions are reviewed before
  modeled value is presented.
- The Metric Glossary contains the 35 priority definitions.
- No visual shows an error.

## Publish

1. Save as PBIX.
2. Apply the organization's sensitivity label.
3. Publish to an approved Power BI or Fabric workspace.
4. Configure SharePoint credentials or a gateway for local-folder refresh.
5. Add and test row-level security if audiences require restricted access.
6. Schedule refresh only after source availability and privacy controls are
   approved.

Read [Security](SECURITY.md) and the
[Interpretation Guide](CoworkSuperUser%20Interpretation%20Guide.pptx) before
sharing populated results.

