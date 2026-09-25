# CoworkSuperUser setup

This page is the Power BI connection checklist. For the complete Viva Insights
analysis-building procedure, required fields, validation, and troubleshooting,
start with:

**[Build and connect the Viva Insights analyses](docs/QUERY_SETUP.md)**

## Recommended customer path

Use a completed Person Query plus the Consumption Dashboard daily export.

1. Create the **Person Query**:
   - Group by Week.
   - Use the approved population.
   - Include Person ID, Metric Date, Organization, Function, Level, and manager
     indicator.
   - From **After-hours collaboration**, select After-hours collaboration
     hours.
   - From **Collaboration activity**, select Active connected hours,
     Collaboration hours, Collaboration span, Email hours, Chat hours, Meeting
     hours, and Unscheduled call hours.
   - From **Collaboration network**, select Diverse ties, External network size,
     Internal network size, Network outside organization, and Strong ties.
   - From **Collaboration by day of the week**, select Weekend collaboration
     hours.
2. Open **Consumption Dashboard**.
3. Select **Download > Export by day**.
4. Extract the ZIP to a protected folder.
5. Keep `PersonServiceCreditsMetrics.csv` unchanged in that folder.
6. Open `CoworkSuperUser - Optimized Export.pbit`.
7. Enter the Person Query's Partition ID, Person Query ID, and the export
   folder path.
8. Select **Load**.

Use all available Cowork history from the first available week and aim for at
least 12 covered weeks when available. Do not add pre-Cowork zero weeks.

Wait until the Person Query shows **Success** before loading the template.

## Parameters

### Advanced Direct Query

This path requires an Insights Analyst assigned to the global partition. Create
a custom **Consumption query**, group by Day, retain the four preselected
consumption metrics, and filter `ServiceName = Cowork`.

Then open `CoworkSuperUser - Direct Query.pbit` and enter:

1. Partition Identifier
2. Person Query Identifier
3. Consumption Query Identifier

Use raw GUIDs only. Select **Load**, then authenticate with an organizational
account that can read the selected partition and completed results.

### Optimized Export parameters

1. Open `CoworkSuperUser - Optimized Export.pbit`.
2. Enter:
   - Partition Identifier
   - Person Query Identifier
   - The folder containing `PersonServiceCreditsMetrics.csv`
3. Select **Load** and authenticate to Viva Insights for the Person Query.

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
