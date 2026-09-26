# Set up CoworkSuperUser

This is the authoritative setup guide for both CoworkSuperUser templates. It
separates the fields required to load the report from optional fields that add
breakdowns or work-pattern context.

CoworkSuperUser always combines:

1. A weekly **Person Query** that defines the approved employee population.
2. Daily **Cowork consumption data** for sessions and credits.

After both inputs are ready, use the shorter [Power BI connection
checklist](../SETUP.md) while you load the template.

## Choose a connection path

Choose the path before creating the consumption input. You do not need both.

| | Recommended: Optimized Export | Advanced: Direct Query |
| --- | --- | --- |
| Consumption input | **Consumption Dashboard > Download > Export by day** | A saved custom **Consumption query** |
| Template | `CoworkSuperUser - Optimized Export.pbit` | `CoworkSuperUser - Direct Query.pbit` |
| Who can obtain the input | Microsoft 365 Global Administrator or Insights Analyst with global-partition access | Insights Analyst with global-partition access |
| Power BI parameters | Partition ID, Person Query ID, export folder | Partition ID, Person Query ID, Consumption Query ID |
| Gateway after publishing | Required for scheduled refresh from a local or network folder | Not required |

The recommended path avoids creating a custom consumption query. The advanced
path is useful when the saved query should refresh without replacing a local
CSV. Despite its name, the Direct Query template imports saved-query results
during refresh; it does not use Power BI DirectQuery storage mode.

> [!IMPORTANT]
> Microsoft 365 Global Administrator access is sufficient to export from the
> Consumption Dashboard, but it does not grant permission to create a custom
> Consumption query. That requires the **Insights Analyst** role and access to
> the **global partition**.

## What you need

| Requirement | Why it is needed |
| --- | --- |
| Current [Power BI Desktop](https://powerbi.microsoft.com/desktop/) | Opens and loads the PBIT |
| An approved purpose and protected storage location | Both inputs contain person-level data |
| Insights Analyst access to the Person Query partition | Creates the Person Query and authenticates the Viva Insights connector |
| Consumption Dashboard export access | Recommended path only; currently available to a Microsoft 365 Global Administrator or a global-partition Insights Analyst |
| Insights Analyst access to the global partition | Advanced path only; required to create and connect to the Consumption query |

The Consumption Dashboard export is a preview feature and must be available in
the tenant. Different people can create the Person Query, export the dashboard
data, and load Power BI, provided each person has the access required for their
step.

## Part 1: Create the Person Query

Both connection paths use the same Person Query.

### 1. Configure the query

1. Open the [Viva Insights web app](https://analysis.insights.cloud.microsoft/)
   and switch to the partition that contains the approved population. For the
   advanced path, use the global partition so both query IDs share one
   Partition ID.
2. Select **Create analysis > Create custom query > Person query**.
3. Give the query a recognizable name, such as
   `CoworkSuperUser - Person Week`.
4. Choose a time period that covers the Cowork analysis period. At least 12
   complete weeks enables the report's 12-week comparisons, but shorter
   histories load and are labeled provisional or unavailable where needed.
5. Under **More settings**, set **Group by** to **Week**.
6. Apply only population filters required by the approved analysis scope.
   Do not filter to Cowork users, because people with zero observed Cowork use
   must remain in the denominator.

The **Is Active** filter is not a CoworkSuperUser requirement. Use it only when
the approved population definition calls for active collaborators; it changes
who is included in the report.

### 2. Select fields

The template handles missing enrichment fields without failing. Use these
three levels to avoid requesting data that the report does not use.

#### Required to load

The query result must contain **Person ID** and **Metric Date**, with one row
per person per week. In the field picker these may appear as `PersonId` and
`MetricDate`.

#### Recommended for the full adoption views

Select the organizational attributes available in your tenant:

| Report field | Common Viva Insights label |
| --- | --- |
| Organization | Organization |
| Function | Function type |
| Level | Layer, level, or level designation |
| Manager status | Supervisor or manager indicator |

The report still loads if one is unavailable. The related slicer or breakdown
will be blank or show **Not provided**.

#### Optional: Work Pattern Context

Select only the metrics for the work-pattern views you intend to use. If a
metric is omitted or entirely blank, its report control is hidden.

| Metric group | Select |
| --- | --- |
| **After-hours collaboration** | After-hours collaboration hours |
| **Collaboration activity** | Active connected hours; Collaboration hours; Collaboration span; Email hours; Chat hours; Meeting hours; Unscheduled call hours |
| **Collaboration network** | Diverse ties; External network size; Internal network size; Network outside organization; Strong ties |
| **Collaboration by day of the week** | Weekend collaboration hours |

If the tenant only offers **Select all** at metric-group level, selecting all
metrics in these four groups is supported; unused columns are ignored.

> [!NOTE]
> Do not select **Microsoft 365 Copilot** metrics solely for this template.
> Cowork sessions and credits come from the separate consumption input. The
> metric selections shown in DecodingSuperUsage apply to that report, not to
> CoworkSuperUser.

### 3. Run and verify

1. Select **Run**.
2. In **Analysis results**, wait for the green **Success** status.
3. Confirm **Group by = Week**, Person ID and Metric Date are populated, and
   each person appears once per week.
4. Select **Copy link** for the result. The link contains the Partition ID and
   Person Query ID separated by a slash. Keep the link in an approved secure
   location; do not email exported person-level data.

## Part 2A: Recommended - use the dashboard export

Use this path when an eligible user can open **Consumption Dashboard**.

### 1. Export and extract the file

1. In Viva Insights, select **Consumption Dashboard**.
2. Select the **download** button in the upper-right corner.
3. Select **Export by day**.
4. Extract the downloaded ZIP into a protected, dedicated folder.

The ZIP contains `PersonServiceCreditsMetrics.csv` and
`PeopleMetaData.csv`. CoworkSuperUser reads only
`PersonServiceCreditsMetrics.csv`; `PeopleMetaData.csv` can remain in the same
folder. Do not rename or edit the consumption file.

The template searches the selected folder and its subfolders. Keep only one
`PersonServiceCreditsMetrics.csv` beneath that folder. A legacy filename,
`PersonM365CreditsMetrics.csv`, is also accepted, but only one supported file
may be present.

> [!NOTE]
> The dashboard controls how much history is included in a daily export. If it
> contains fewer than 12 complete weeks, the report still loads and marks
> longer comparisons as provisional or unavailable. Do not append artificial
> zero-use weeks.

### 2. Load the Optimized Export template

1. Download and open
   [`CoworkSuperUser - Optimized Export.pbit`](../CoworkSuperUser%20-%20Optimized%20Export.pbit).
2. Enter the two raw GUIDs from the Person Query link and the export folder:

   | Template parameter | Enter |
   | --- | --- |
   | Partition Identifier | Person Query Partition ID |
   | Person Query Identifier | Person Query ID |
   | Viva Export Folder Path | Folder path, not the CSV file path |

3. Select **Load**.
4. When prompted for the Viva Insights source, select **Organizational
   account** and sign in with an account that can read the Person Query and its
   partition.
5. If prompted for a privacy level, use the level required by your
   organization; **Organizational** is commonly appropriate.
6. Wait for refresh to finish, then continue to [Part 3](#part-3-validate-the-loaded-report).

You do not need a custom Consumption query or a Consumption Query ID for this
path.

## Part 2B: Advanced - use a saved Consumption query

Use this path only when the analyst can work in the **global partition**.

### 1. Confirm access if the query type is missing

If **Consumption query** is not available, verify both assignments:

1. A Microsoft 365 Global Administrator or Privileged Role Administrator has
   assigned the user the **Insights Analyst** role.
2. An Insights Administrator has opened **Settings > Partitions > Global
   partition** and added that analyst.

These are access-remediation steps, not part of the normal flow when the query
type is already visible.

### 2. Create the Consumption query

1. In the global partition, select
   **Create analysis > Create custom query > Consumption query**.
2. Give it a recognizable name, such as
   `CoworkSuperUser - Cowork Consumption`.
3. Choose a time period that overlaps the Person Query.
4. Under **More settings**, set **Group by** to **Day**.
5. Leave the four preselected metrics in place:
   - Total Copilot Credits used
   - Session count
   - User limit
   - Spending policy limit
6. Add the condition `ServiceName = Cowork`.
7. Do not add HR attributes solely for CoworkSuperUser; organization fields
   come from the Person Query.
8. Select **Run** and wait for **Success** in **Analysis results**.
9. Select **Copy link** for the result and record its raw Consumption Query ID.

The Person Query and Consumption query links must contain the same Partition
ID. If they do not, recreate the Person Query in the global partition.

### 3. Load the Direct Query template

1. Download and open
   [`CoworkSuperUser - Direct Query.pbit`](../CoworkSuperUser%20-%20Direct%20Query.pbit).
2. Enter:

   | Template parameter | Enter |
   | --- | --- |
   | Partition Identifier | Shared Partition ID |
   | Person Query Identifier | Person Query ID |
   | Consumption Query Identifier | Consumption Query ID |

3. Select **Load**.
4. Select **Organizational account** and sign in with the Insights Analyst
   account that can read both successful results.
5. Wait for refresh to finish, then continue to Part 3.

## Part 3: Validate the loaded report

Before sharing the report, confirm:

- **Start Here** opens first and no visual displays an error.
- Population and completed weeks match the Person Query.
- Sessions and credits reconcile to the Cowork rows in the dashboard export or
  Consumption query over the same complete period.
- People in the Person Query with no Cowork row remain covered zero-users for
  weeks present in the consumption input.
- Organization, Function, Level, and Manager populate when selected.
- **Work Pattern Context** shows a control for each supplied metric and hides
  metrics that were not supplied.
- The history message reflects the available coverage.
- Aggregate person-derived results are suppressed below 10 people.

Review the [Interpretation Guide](../INTERPRETATION_GUIDE.md) before presenting
results. In particular, sessions are not tasks, credits are not productivity,
and potential champions are not employee-performance scores.

## Optional: publish and schedule refresh

Publishing is not required to use the report in Power BI Desktop.

1. Save the loaded report as PBIX and apply the sensitivity label required by
   the customer's information-protection policy.
2. Publish to an approved Power BI or Fabric workspace.
3. In semantic model settings, configure the Viva Insights source with OAuth2
   credentials.
4. If using Optimized Export, configure an on-premises data gateway that can
   read the export folder. Replace the CSV with a new dashboard export before
   each scheduled refresh.
5. If using Direct Query, turn on **Auto-Refresh** for both saved Viva Insights
   queries when recurring updates are needed.
6. Schedule the Power BI refresh after the Viva Insights inputs normally
   finish, then run one on-demand refresh and verify the newest complete week.

For audience-specific access, follow [Security and row-level security
guidance](../SECURITY.md).

## Troubleshooting

Use [Troubleshooting](TROUBLESHOOTING.md) for authentication, missing fields,
duplicate export files, zero sessions, and refresh issues.

## Official references

- [Create a custom Person Query](https://learn.microsoft.com/viva/insights/advanced/analyst/person-query)
- [Access query results and copy connector IDs](https://learn.microsoft.com/viva/insights/advanced/analyst/query-results)
- [Create a custom Consumption query](https://learn.microsoft.com/viva/insights/advanced/analyst/ai-cost-query)
- [Export Consumption Dashboard metrics](https://learn.microsoft.com/viva/insights/org-team-insights/export-ai-cost-metrics)
- [Consumption Dashboard access requirements](https://learn.microsoft.com/viva/insights/org-team-insights/ai-cost-dashboard)
- [Assign Viva Insights roles](https://learn.microsoft.com/viva/insights/advanced/setup-maint/assign-user-roles)
- [Manage Viva Insights partitions](https://learn.microsoft.com/viva/insights/advanced/admin/partitions)
- [Viva Insights metric descriptions](https://learn.microsoft.com/viva/insights/advanced/reference/metrics)
