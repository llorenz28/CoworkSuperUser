# Connect CoworkSuperUser to Viva Insights

CoworkSuperUser combines:

1. A **Person Query** for the approved employee population, organization
   attributes, and work-pattern context.
2. **Cowork consumption data** for sessions, credits, and spending-policy
   context.

## Choose the correct customer path

| Path | Consumption source | Who can use it | Template |
| --- | --- | --- | --- |
| **Recommended customer path** | **Consumption Dashboard > Export by day** | A Microsoft 365 Global Administrator or an Insights Analyst with global-partition access | `CoworkSuperUser - Optimized Export.pbit` |
| **Advanced connected path** | **Create analysis > Create custom query > Consumption query** | An Insights Analyst assigned to the global partition | `CoworkSuperUser - Direct Query.pbit` |

> [!IMPORTANT]
> A Global Administrator can view and export the Consumption Dashboard but
> cannot run a custom consumption query solely because they are Global
> Administrator. The Direct Query path requires the **Insights Analyst** role
> plus **global-partition access**.

Both paths require a completed Person Query.

## Prerequisites

- Current [Power BI Desktop](https://powerbi.microsoft.com/desktop/).
- Access to the
  [Viva Insights web app](https://analysis.insights.cloud.microsoft/).
- An **Insights Analyst** who can create the Person Query.
- An approved purpose for using individual-level data.
- For the recommended path, access to the Consumption Dashboard.
- For the advanced path, Insights Analyst access to the global partition.

## Step 1: Create the Person Query

1. Open the Viva Insights web app.
2. Select **Analysis results**.
3. Select **Create analysis**.
4. Select **Person query**, then **Set up analysis**.
5. Name the query `CoworkSuperUser - Person Week`.
6. Use all available Cowork history beginning with the first week Cowork data
   exists.
7. Aim for at least 12 covered weeks when available.
8. Set **Group by** to **Week**.
9. Select the approved employee population. If appropriate, filter to active
   employees.
10. Add the attributes and metrics below.
11. Select **Run** or **Save and run**.
12. Wait for **Success**.

Do not filter the Person Query to Cowork users. It defines the approved
population, including covered employees with no Cowork activity.

### Person Query attributes

| Attribute group | Select |
| --- | --- |
| Person and date | Person ID; Metric Date |
| Organizational data | Organization; Function type; Layer or level; Supervisor or manager indicator |

### Person Query metrics

In the **Metrics** pane, expand these groups:

| Metric group | Select | Metric group | Select |
| --- | --- | --- | --- |
| **After-hours collaboration** | After-hours collaboration hours | **Collaboration activity** | Active connected hours<br>Collaboration hours<br>Collaboration span<br>Email hours<br>Chat hours<br>Meeting hours<br>Unscheduled call hours |
| **Collaboration network** | Diverse ties<br>External network size<br>Internal network size<br>Network outside organization<br>Strong ties | **Collaboration by day of the week** | Weekend collaboration hours |

If Viva Insights only offers **Select all** for a group, selecting all metrics
for these four groups is supported.

The Person Query does not need Microsoft 365 Copilot metrics solely for this
report. Cowork sessions and credits come from the consumption source.

### Validate the Person Query

Confirm:

- Status is **Success**.
- Group by is **Week**.
- Person ID and Metric Date are populated.
- Organization, Function, Level, and manager status are present.
- There is one row per person per week.
- The period starts no earlier than actual Cowork availability.

## Path A: Recommended — Consumption Dashboard export

Use this path when the customer can open **Consumption Dashboard** in the Viva
Insights left navigation.

### A1. Export the consumption data

1. Select **Consumption Dashboard**.
2. Select the **download** button in the upper-right corner.
3. Select **Export by day**.
4. Wait for the ZIP file to download.
5. Extract the ZIP to a protected folder.

The ZIP contains:

- `PersonServiceCreditsMetrics.csv`
- `PeopleMetaData.csv`

CoworkSuperUser reads `PersonServiceCreditsMetrics.csv` directly. **Do not
rename it.**

The daily export contains one row per person, service, and date. It includes the
service name, session count, credits, spending-policy limit, user limit, and
join identifiers.

### A2. Prepare the folder

1. Create a dedicated folder for the current export.
2. Place the extracted `PersonServiceCreditsMetrics.csv` in that folder.
3. Keep only one file with that name beneath the folder.
4. Close the CSV if it is open in Excel.
5. Do not modify its headers.

`PeopleMetaData.csv` may remain in the folder, but the template does not require
it because organization attributes come from the Person Query.

### A3. Open the Optimized Export template

1. Download and open `CoworkSuperUser - Optimized Export.pbit`.
2. Enter:
   - **Partition Identifier**
   - **Person Query Identifier**
   - **Viva Export Folder Path**
3. For the folder parameter, enter the folder path—not the CSV file path.
4. Select **Load**.
5. For the Viva Insights source, sign in with an **Organizational account**
   that can read the Person Query and partition.
6. If Power BI requests a privacy level, use the organization-approved level;
   **Organizational** is normally appropriate.
7. Wait for the refresh to complete.

### A4. Find the Person Query identifiers

1. Return to **Analysis results**.
2. Find the successful Person Query.
3. Select its **Copy link** icon.
4. The link contains the Partition Identifier and Person Query Identifier,
   separated by a slash.
5. Enter only the raw GUID values in the template.

## Path B: Advanced — Connected consumption query

Use this path only when the operator is an **Insights Analyst assigned to the
global partition**.

### B1. If Consumption query is missing

An Insights Administrator must:

1. Open the Viva Insights admin experience.
2. Go to **Settings > Partitions**.
3. Select **Global partition**.
4. Add the user under analysts with access.
5. Save or finish the change.

A Global Administrator can assign the Viva role:

1. Open the [Microsoft 365 admin center](https://admin.microsoft.com/).
2. Go to **Settings > Viva > Viva Insights**.
3. Under **Add-on Plan**, select **Insights Analyst**.
4. Add the user.

Then the user signs out, closes the browser, signs back in, and selects the
global partition.

### B2. Create the custom consumption query

1. Select **Create analysis**.
2. Select the **Custom query** tab.
3. Select **Create custom query**.
4. Select **Consumption query**.
5. Name it `CoworkSuperUser - Cowork Consumption`.
6. Use a period overlapping the Person Query.
7. Under **More settings**, set **Group by** to **Day**.
8. Keep the preselected metrics:
   - Total Copilot Credits used
   - Session count
   - User limit
   - Spending policy limit
9. Add the condition:

   ```text
   ServiceName = Cowork
   ```

10. Optionally select Organization, Function, and Level as HR attributes.
11. Select **Run**.
12. Wait for **Success**.

### B3. Connect the Direct Query template

1. In **Analysis results**, copy the link for the Person Query.
2. Copy the link for the successful Consumption query.
3. Record:
   - Shared Partition Identifier
   - Person Query Identifier
   - Consumption Query Identifier
4. Open `CoworkSuperUser - Direct Query.pbit`.
5. Enter the three raw GUIDs.
6. Select **Load**.
7. Sign in with the Insights Analyst organizational account.
8. Wait for refresh to complete.

The Direct Query name describes the setup experience. Power BI imports the
saved-query results during refresh; it is not Tabular DirectQuery storage mode.

## Validate the loaded report

Before publishing, confirm:

- Start Here opens first.
- Population matches the Person Query scope.
- Expected completed weeks appear.
- Organization, Function, Level, and manager fields populate.
- Sessions and credits reconcile with the dashboard export or consumption
  query.
- Covered people without Cowork sessions remain zero/non-users.
- Work Pattern Context enables the supplied metrics.
- The history card correctly reports coverage.
- Aggregate person-derived results below 10 people are suppressed.
- Methods and Metric Guide contains 117 definitions.
- No page or alternate view displays an error.

## Save, label, and publish

1. Save the loaded report as PBIX.
2. Apply the customer's required sensitivity label.
3. Publish to an approved Power BI or Fabric workspace.
4. Configure Viva Insights OAuth2 credentials.
5. For Optimized Export, configure an on-premises data gateway with access to
   the export folder.
6. Schedule refresh after Viva Insights data is available.
7. Test an on-demand refresh before sharing.

For Optimized Export, each update requires a newly downloaded daily export to
replace `PersonServiceCreditsMetrics.csv` in the configured folder.

## Troubleshooting

| Symptom | Resolution |
| --- | --- |
| Consumption Dashboard is visible but Consumption query is missing | Use Path A, or assign Insights Analyst plus global-partition access for Path B |
| Access to the resource is forbidden | In Power BI, clear Viva Insights permissions under **File > Options and settings > Data source settings**, exit Desktop, reopen, and sign in again |
| Export file not found | Confirm the folder contains exactly one `PersonServiceCreditsMetrics.csv` |
| Duplicate export files | Remove duplicate copies beneath the configured folder |
| Sessions are zero | Confirm the export includes `ServiceName = Cowork` and overlaps the Person Query dates |
| Work-pattern button is missing | Add the corresponding Person Query metric, rerun, and refresh |
| History is provisional | Continue refreshing; do not add pre-Cowork zero weeks |

## Official references

- [Create a custom consumption query](https://learn.microsoft.com/viva/insights/advanced/analyst/ai-cost-query)
- [Export AI cost metrics from the Consumption Dashboard](https://learn.microsoft.com/viva/insights/org-team-insights/export-ai-cost-metrics)
- [Consumption Dashboard access requirements](https://learn.microsoft.com/viva/insights/org-team-insights/ai-cost-dashboard)
- [Assign Viva Insights roles](https://learn.microsoft.com/viva/insights/advanced/setup-maint/assign-user-roles)
- [Manage Viva Insights partitions](https://learn.microsoft.com/viva/insights/advanced/admin/partitions)
- [Viva Insights metric descriptions](https://learn.microsoft.com/viva/insights/advanced/reference/metrics)
