# Setup

## Choose a template

Use **Optimized Export** for the fastest refresh. Use **Direct Query** when customers need a script-free saved-query connection. Both files open to **Start Here** and provide the same report experience.

## Optimized Export

1. Export `PersonM365CreditsMetrics.csv` from Viva Insights.
2. Open the optimized PBIT.
3. Enter the shared Viva Insights partition identifier.
4. Enter the Person Query identifier.
5. Enter the folder containing the Cowork consumption CSV.
6. Load the template.

## Direct Query

1. Create a Viva Insights Person Query at person-week grain.
2. Create a Viva Insights Consumption Query that includes Cowork service, session, credit, policy, person, and metric-date fields.
3. Open the Direct Query PBIT.
4. Enter the shared partition identifier, Person Query identifier, and Consumption Query identifier.
5. Load the template.

The Direct Query template evaluates each source once in its integrated person-week ingestion path. It requires access to the partition and both saved queries.

## Sensitivity label

The release is classified **Public**. Power BI retains sensitivity labels on PBIX files but not on exported PBIT files. After loading customer data, apply the label required by the customer's information-protection policy.

## Data expectations

- Person Query must be unique at person-week grain.
- Cowork consumption rows are aggregated to person-week.
- Weeks start on Sunday.
- Aggregate person-derived results are suppressed below 10 people.
- User IDs are pseudonymous report identifiers.
- Short histories load immediately and display provisional or unavailable states where appropriate.
