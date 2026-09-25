# Build and connect the Viva Insights analyses

CoworkSuperUser requires two completed Viva Insights analyses from the same
partition:

1. A **Person Query** supplies the approved population, organization
   attributes, and work-pattern context at person-week grain.
2. A **Microsoft 365 Copilot consumption or cost-management analysis** supplies
   Cowork sessions, credits, and policy context.

> [!IMPORTANT]
> Do not filter the Person Query down to Cowork users. It is the population
> spine. Apply `Service Name = "Cowork"` in the consumption analysis. The
> template joins Cowork activity onto the approved Person Query population, so
> covered people without a Cowork session remain valid zero/non-user records.

## What you need

- A current version of
  [Power BI Desktop](https://powerbi.microsoft.com/desktop/).
- Access to the
  [Viva Insights Analyst Workbench](https://analysis.insights.cloud.microsoft/).
- The **Insights Analyst** role for the target Viva Insights partition.
- Permission to use individual-level results for the approved adoption and
  enablement purpose.
- Power BI or Fabric workspace access if you will publish the report.

The person creating the analyses and the person refreshing Power BI can be
different, but the Power BI account must be able to read the selected partition
and completed results.

## Before creating either analysis

1. Confirm the partition that contains the intended measured population.
2. Identify the first week Cowork data is available.
3. Use all available Cowork history from that first week through the latest
   complete period.
4. Aim for at least 12 covered weeks when available. Shorter histories load,
   but some stage and movement results will be provisional or unavailable.
5. Use the same partition and overlapping dates for both analyses.
6. Do not add pre-Cowork weeks merely to lengthen the range. They are outside
   coverage, not zero-use weeks.

## Step 1: Create the Person Query

1. Open the Viva Insights Analyst Workbench.
2. Select **Analysis results** in the left navigation.
3. Select **Create analysis**.
4. Choose **Person query**, then select **Set up analysis**.
5. Enter a recognizable analysis name, such as
   `CoworkSuperUser - Person Week`.
6. Set the time period to the available Cowork history identified above.
7. Set **Group by** to **Week**.
8. Select the approved base population. If appropriate for the approved scope,
   filter to active employees.
9. Add every attribute and metric in the tables below.
10. Review the analysis before running it:
    - It must be a Person Query.
    - It must be grouped by Week, not Month or Day.
    - It must not be filtered to Cowork users.
    - It must not add another grouping that produces more than one row per
      person-week.
11. Select **Run** or **Save and run**.
12. Wait until the result status is **Completed** or **Success**.

### Required Person Query attributes

| Report requirement | Viva Insights field or accepted exported label |
| --- | --- |
| Person identifier | Person ID or `PersonId` |
| Week date | Metric Date or `MetricDate` |
| Organization | Organization or `OrganizationName` |
| Function | Function type, Function, `FunctionType`, or `Function Type` |
| Layer or level | Level, Layer, `LevelDesignation`, or `Level Designation` |
| Supervisor indicator | Manager Source, `SupervisorIndicator`, or `IsManager` |

### Required Person Query metrics

In the **Metrics** pane, expand these metric groups and select the listed
metrics:

| Metric group | Select | Metric group | Select |
| --- | --- | --- | --- |
| **After-hours collaboration** | After-hours collaboration hours | **Collaboration activity** | Active connected hours<br>Collaboration hours<br>Collaboration span<br>Email hours<br>Chat hours<br>Meeting hours<br>Unscheduled call hours |
| **Collaboration network** | Diverse ties<br>External network size<br>Internal network size<br>Network outside organization<br>Strong ties | **Collaboration by day of the week** | Weekend collaboration hours |

If the tenant only presents **Select all** at metric-group level, selecting all
metrics for these four groups is supported; the report uses only the fields
listed above. Selecting only the listed metrics keeps the result smaller.

The Person Query does **not** need the **Microsoft 365 Copilot** metric group
solely for CoworkSuperUser. Cowork sessions, credits, and policy data come from
the separate Cowork consumption analysis.

Reference: [Viva Insights advanced analysis metric descriptions](https://learn.microsoft.com/viva/insights/advanced/reference/metrics).

The template accepts common Viva export variations such as spaces, underscores,
and selected legacy labels. Missing optional context metrics do not stop the
report from loading, but their Work Pattern Context buttons remain unavailable.
For the published report contract, include every listed metric.

### Validate the completed Person Query

Before continuing, confirm:

- The result status is **Completed** or **Success**.
- Person ID and Metric Date are populated.
- Organization, Function, Level, and manager status contain expected values.
- Dates are weekly.
- The result has one record per person per week.
- The earliest result week is not earlier than actual Cowork availability.
- At least one work-pattern metric contains nonblank values.

Do not remove or rename columns after the analysis completes.

## Step 2: Create the Cowork consumption analysis

The name of this analysis can vary by tenant or rollout. Choose the Microsoft
365 Copilot consumption or cost-management analysis that exposes Person and
Service entities plus sessions, credits, and policy limits.

1. Return to **Analysis results**.
2. Select **Create analysis**.
3. Choose the Microsoft 365 Copilot consumption or cost-management analysis.
4. Enter a recognizable name, such as
   `CoworkSuperUser - Cowork Consumption`.
5. Select the same Viva Insights partition as the Person Query.
6. Use a date range that overlaps the Person Query.
7. Set **Group by** to **Day**.
8. Include the **Person** and **Service** entities.
9. Add a filter where:

   ```text
   Service Name equals Cowork
   ```

   Use the exact service value `Cowork`; do not use a contains filter or a
   broader Microsoft 365 Copilot service filter.

10. Include these metrics:
    - Session count
    - Total Copilot Credits used
    - Spending policy limit
    - User limit
11. Retain these dimensions or metadata fields when the analysis exposes them:
    - Person ID
    - Service ID
    - Service Name
    - Spending Policy ID
    - Metric Date
    - People Historical ID
    - Copilot license indicator
    - Plan name
    - Included services
12. Select **Run** or **Save and run**.
13. Wait until the result status is **Completed** or **Success**.

The template applies the exact Cowork filter again, aligns dates to
Sunday-start weeks, and aggregates daily and policy-level records to
person-week grain.

### Validate the completed consumption result

Confirm:

- The result status is **Completed** or **Success**.
- Every returned Service Name is `Cowork`.
- Person ID, Metric Date, and Session count are populated.
- The result includes the same period as the Person Query.
- Session and credit totals are plausible for the selected population.
- Multiple policy rows are retained; the template performs the required
  aggregation.

## Step 3: Copy the identifiers

Open the completed analysis-result details and record:

- **Partition Identifier**: the partition or scope ID shared by both analyses.
- **Person Query Identifier**: the result/query ID for the Person Query.
- **Consumption Query Identifier**: the result/query ID for the Cowork
  consumption analysis.

If the result page offers **Copy link** rather than separate copy buttons, the
link contains the relevant GUIDs. Record the partition GUID and the GUID for
each completed result.

Use raw GUIDs only:

```text
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Do not paste a label, quotation marks, braces, spaces, or the complete result
URL into a Power BI parameter.

## Step 4: Choose a template

| Path | Inputs | Recommended use |
| --- | --- | --- |
| **Direct Query** | Partition ID, Person Query ID, Consumption Query ID | Simplest setup; both completed analyses are read through the Viva Insights connector |
| **Optimized Export** | Partition ID, Person Query ID, consumption export folder | Faster refresh and support fallback; Person Query remains connected while consumption comes from one CSV |

The Direct Query label describes the setup experience. Power BI imports the
saved-query results during refresh; this is not Tabular DirectQuery storage
mode.

## Step 5A: Connect the Direct Query template

1. Download `CoworkSuperUser - Direct Query.pbit`.
2. Open it in Power BI Desktop.
3. In the parameter dialog, paste:
   - Partition Identifier
   - Person Query Identifier
   - Consumption Query Identifier
4. Verify each value is a raw GUID.
5. Select **Load**.
6. When Power BI requests Viva Insights credentials:
   - Choose **Organizational account** or **OAuth2**.
   - Sign in with the account that can read the selected partition and both
     completed results.
   - If prompted for a privacy level, use the organization-approved level;
     **Organizational** is normally appropriate for tenant data.
7. Allow the complete refresh to finish.
8. Continue to the validation checklist below.

## Step 5B: Connect the Optimized Export template

1. Open the completed Cowork consumption result.
2. Export or download the row-level CSV.
3. Place it in a dedicated protected folder.
4. Ensure the file is named exactly:

   ```text
   PersonM365CreditsMetrics.csv
   ```

   If the browser added a suffix such as `(1)`, rename the file.

5. Keep only one file with that name anywhere under the selected folder. The
   loader searches subfolders and rejects duplicates.
6. Close the CSV if it is open in Excel.
7. Download and open `CoworkSuperUser - Optimized Export.pbit`.
8. In the parameter dialog, enter:
   - Partition Identifier
   - Person Query Identifier
   - Viva Export Folder Path
9. For **Viva Export Folder Path**, enter the folder path, not the CSV path.
10. Select **Load**.
11. Authenticate to Viva Insights for the connected Person Query using the
    organizational account with partition access.
12. Allow the complete refresh to finish.
13. Continue to the validation checklist below.

## Step 6: Validate the loaded report

Do not publish until every applicable check passes:

- **Start Here** is the opening page.
- The population is nonzero and matches the Person Query scope.
- Expected covered weeks appear.
- Organization, Function, Level, and manager fields populate.
- Weekly Adoption & Usage contains the expected weekly dates.
- Sessions and credits reconcile with the completed Cowork consumption result.
- People covered by the Person Query but without Cowork sessions remain in the
  population as zero/non-users for covered weeks.
- Work Pattern Context enables every supplied Person Query metric.
- Champion Identification uses the expected pseudonymous Person IDs.
- The history card correctly reports available, provisional, or unavailable
  history.
- Aggregate person-derived results below 10 people are suppressed.
- Methods and Metric Guide contains 117 current definitions.
- No page or alternate view displays an error.

## Step 7: Save, label, and publish

1. Save the loaded template as a PBIX.
2. Apply the sensitivity label required by the customer organization.
   PBIT files do not retain Purview labels.
3. Publish the PBIX to an approved Power BI or Fabric workspace.
4. Open the semantic model settings.
5. Configure the Viva Insights data-source credentials as **OAuth2** using an
   account that can read the partition and completed results.
6. For Optimized Export, configure an on-premises data gateway that:
   - Can reach the configured folder path.
   - Runs under an account with read access to the CSV.
   - Maps to the same folder source used in Desktop.
7. Set scheduled refresh to run after the Viva Insights analyses normally
   complete.
8. Run an on-demand refresh and verify that it succeeds before sharing the
   report.

## Step 8: Operate the report

For each update cycle:

1. Confirm the two Viva analyses completed successfully.
2. For Direct Query, refresh the published semantic model.
3. For Optimized Export, replace
   `PersonM365CreditsMetrics.csv` with the latest completed export, preserving
   the exact filename and columns, then refresh the semantic model.
4. Confirm that the newest complete week appears.
5. Check the history-status card and privacy suppression.
6. Investigate unexpected population or source-coverage changes before using
   refreshed findings.

## Troubleshooting

| Symptom | Likely cause | Resolution |
| --- | --- | --- |
| Access to the resource is forbidden | Stale credentials, wrong account, wrong partition, or inaccessible result | Clear Viva Insights permissions in **File > Options and settings > Data source settings**, exit Desktop, reopen, and sign in with the correct organizational account |
| No sign-in prompt | Power BI reused cached credentials | Clear permissions and restart Power BI Desktop |
| Blank report | Analysis is incomplete, IDs are wrong, or required fields are missing | Confirm both results are Completed/Success, verify raw GUIDs, and compare the query fields with this guide |
| Duplicate person-week rows | Person Query has an incompatible grouping or duplicate records | Use Person Query grouped by Week and remove additional groupings that create multiple rows per person-week |
| Sessions are all zero | Consumption dates do not overlap, Service Name is not exactly Cowork, or the wrong result ID was used | Correct the period/filter/ID and rerun the consumption analysis |
| Work-pattern button is missing | The corresponding Person Query metric is absent or entirely blank | Add the metric, rerun the Person Query, and refresh Power BI |
| Export file not found | Wrong folder or filename | Place exactly one `PersonM365CreditsMetrics.csv` under the configured folder |
| Duplicate export files | More than one matching filename exists in the folder tree | Remove or archive duplicate copies outside the configured folder |
| Local-folder refresh fails after publishing | Gateway is missing or cannot read the folder | Configure the gateway and folder permissions, or use Direct Query |
| History is provisional | Available Cowork history is shorter than the selected window | Continue refreshing; do not manufacture pre-Cowork zero weeks |

See [Troubleshooting](TROUBLESHOOTING.md) for authentication details.

## Data-handling requirements

- Store exported person-level CSV files only in approved protected locations.
- Do not email exports or attach them to GitHub issues.
- Do not commit production data, screenshots, tenant identifiers, or query IDs.
- Apply the customer's required sensitivity label after saving as PBIX.
- Use Entra ID groups and row-level security where different audiences require
  different organization views.
