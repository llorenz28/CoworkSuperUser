# CoworkSuperUser setup

This page is the Power BI connection checklist. For the complete Viva Insights
analysis-building procedure, required fields, validation, and troubleshooting,
start with:

**[Build and connect the Viva Insights analyses](docs/QUERY_SETUP.md)**

## Required analyses

Create two completed analyses in the same Viva Insights partition with
overlapping dates:

1. **Person Query**
   - Group by Week.
   - Use the approved population.
   - Include Person ID, Metric Date, Organization, Function, Level, and manager
     indicator.
   - Include collaboration, communication, meetings/calls, beyond-hours, and
     network metrics listed in the full guide.
2. **Cowork consumption analysis**
   - Group by Day.
   - Include Person and Service.
   - Filter `Service Name` to exactly `Cowork`.
   - Include Session count, Total Copilot Credits used, Spending policy limit,
     and User limit.

Use all available Cowork history from the first available week and aim for at
least 12 covered weeks when available. Do not add pre-Cowork zero weeks.

Wait until both analyses show **Completed** or **Success**.

## Parameters

### Direct Query

Open `CoworkSuperUser - Direct Query.pbit` and enter:

1. Partition Identifier
2. Person Query Identifier
3. Consumption Query Identifier

Use raw GUIDs only. Select **Load**, then authenticate with an organizational
account that can read the selected partition and completed results.

### Optimized Export

1. Export the completed Cowork consumption result as row-level CSV.
2. Store it in a dedicated protected folder.
3. Name it exactly `PersonM365CreditsMetrics.csv`.
4. Open `CoworkSuperUser - Optimized Export.pbit`.
5. Enter:
   - Partition Identifier
   - Person Query Identifier
   - The folder containing the CSV
6. Select **Load** and authenticate to Viva Insights for the Person Query.

Keep only one matching CSV beneath the configured folder.

## Post-load validation

- Start Here is the opening page.
- Population and latest completed week are present.
- Expected covered weeks appear.
- Organization, Function, Level, and manager fields populate.
- Sessions and credits reconcile with the completed consumption result.
- Covered people without Cowork sessions remain zero/non-users.
- Work Pattern Context enables the supplied Person Query metrics.
- Privacy suppression applies below 10 people.
- Methods and Metric Guide contains 117 current definitions.
- No visual displays an error.

## Publish

1. Save as PBIX.
2. Apply the customer's required sensitivity label.
3. Publish to an approved Power BI or Fabric workspace.
4. Configure Viva Insights OAuth2 credentials.
5. For Optimized Export, configure an on-premises data gateway with access to
   the CSV folder.
6. Schedule refresh after the Viva Insights analyses complete.
7. Test an on-demand refresh and confirm the newest complete week appears.

See [Troubleshooting](docs/TROUBLESHOOTING.md) and the
[Interpretation Guide](INTERPRETATION_GUIDE.md).
