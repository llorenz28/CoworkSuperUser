# Setup

## Choose a template

Use **Optimized Export** with **Consumption Dashboard > Export by day** for the standard customer experience. Use **Direct Query** when an Insights Analyst has global-partition access and can create a custom Consumption Query. Both files open to **Start Here** and provide the same report experience.

## Optimized Export

1. Open the Consumption Dashboard and select **Download > Export by day**.
2. Extract `PersonServiceCreditsMetrics.csv` from the downloaded ZIP. Do not rename it.
3. Open the optimized PBIT.
4. Enter the shared Viva Insights partition identifier.
5. Enter the Person Query identifier.
6. Enter the folder containing the Cowork consumption CSV.
7. Load the template.

## Direct Query

1. Create a Viva Insights Person Query at person-week grain.
2. In the global partition, create a custom Consumption Query, group by Day, retain the four preselected metrics, and filter `ServiceName = Cowork`.
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
