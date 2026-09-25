# Build the Viva Insights queries

CoworkSuperUser uses two saved Viva Insights analyses:

1. A **Person query** provides the person-week population and work-pattern context.
2. A **Microsoft 365 Copilot consumption query** provides Cowork sessions, credits, and policy context.

Both queries must use the same Viva Insights partition and overlapping dates.

## Prerequisites

- Current Power BI Desktop.
- Access to the [Viva Insights Analyst Workbench](https://analysis.insights.cloud.microsoft/).
- The **Insights Analyst** role for the target partition.
- A population that satisfies the tenant's Viva Insights privacy rules.
- Permission to use the resulting individual-level data for the report's authorized adoption and enablement purpose.

## Query 1: Person query

1. Open **Analysis results** in the Analyst Workbench.
2. Select **Create analysis** and choose **Person query**.
3. Use **all available Cowork history**, beginning with the first week Cowork data is actually available. Aim for at least 12 covered weeks when available so the report can use its full stage window. Do not add pre-Cowork weeks or interpret them as zero activity.
4. Set **Group by** to **Week**.
5. Filter the base population to active employees if that matches your approved analysis scope.
6. Add these organizational attributes:
   - Person ID
   - Organization
   - Function type
   - Layer or level designation
   - Supervisor indicator or manager status
7. Add these work-pattern metrics for the complete experience:
   - Collaboration hours
   - Active connected hours
   - Email hours
   - Chat hours
   - Meeting hours
   - Unscheduled call hours
   - After-hours collaboration hours
   - Weekend collaboration hours
   - Collaboration span
   - Internal network size
   - External network size
   - Strong ties
   - Diverse ties
   - Network outside organization
8. Save and run the query.
9. Wait until its status is **Completed** or **Success**.

The template tolerates missing optional work-pattern columns, but only supplied patterns appear as selectable buttons. At least 13 weeks supports a current and previous window for the default 4-week analysis; approximately 26 weeks provides fuller 12-week comparisons. Shorter histories still load and are labeled provisional or unavailable where appropriate.

## Query 2: Cowork consumption query

1. Select **Create analysis** and choose the Microsoft 365 Copilot consumption or cost-management analysis.
2. Use the same date range as the Person query.
3. Group by **Day**. The template aligns dates to Sunday-start weeks.
4. Use **Person ID** and **Service** as report entities.
5. Filter **Service Name** to exactly `Cowork`.
6. Include these metrics:
   - Session count
   - Total Copilot Credits used
   - Spending policy limit
   - User limit
7. Retain these grouping or metadata fields when available:
   - Person ID
   - Service ID
   - Service Name
   - Spending Policy ID
   - Metric Date
   - People Historical ID
   - Copilot license indicator
   - Plan name and included services
8. Save and run the query.
9. Wait until its status is **Completed** or **Success**.

The model filters to Cowork again and aggregates policy rows to one person-week record. A missing person-week consumption row becomes zero only when that week is covered by the consumption result; otherwise it remains unknown.

## Copy the identifiers

From a completed analysis result, record:

- **Partition Identifier**: the shared partition or scope ID.
- **Person Query Identifier**: the Person query result ID.
- **Consumption Query Identifier**: the Cowork consumption result ID.

Use raw GUIDs only, without labels, quotation marks, or URLs.

## Choose the template

### Direct Query template

Open `CoworkSuperUser - Direct Query.pbit` and enter:

1. Partition Identifier
2. Person Query Identifier
3. Consumption Query Identifier

Despite the customer-facing name, the Viva connector retrieves saved-query results and Power BI imports them during refresh; this is not Tabular DirectQuery storage mode.

### Optimized Export template

Open `CoworkSuperUser - Optimized Export.pbit` and enter:

1. Partition Identifier
2. Person Query Identifier
3. The folder containing the exported `PersonM365CreditsMetrics.csv`

This variant keeps the Person query connected and reads the Cowork consumption export once from disk. It is the fastest validated refresh path. Published refresh of a local folder requires an on-premises data gateway.

## Validation checklist

- Start Here opens after loading.
- Executive Adoption shows a nonzero population and observed active users.
- Weekly Adoption & Usage includes the expected weeks.
- Organization fields populate on Adoption by Attributes and Champion Identification.
- Sessions and Credits reconcile to the completed Cowork consumption result.
- Work Pattern Context shows only metrics supplied by the Person query.
- Methods and Metric Guide reports populated history and source status.
- No visual shows an error.
