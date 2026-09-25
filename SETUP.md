# CoworkSuperUser setup

## Start here

1. Read [Build the Viva Insights queries](docs/QUERY_SETUP.md).
2. Download either:
   - `CoworkSuperUser - Direct Query.pbit`
   - `CoworkSuperUser - Optimized Export.pbit`
3. Wait until the required Viva Insights analyses show **Completed** or **Success**.
4. Open the PBIT and enter the requested parameters.
5. Validate the report with the checklist below.

## Parameters

### Direct Query

- Partition Identifier
- Person Query Identifier
- Consumption Query Identifier

### Optimized Export

- Partition Identifier
- Person Query Identifier
- Folder containing `PersonM365CreditsMetrics.csv`

## Validation

- Start Here is the opening page.
- Population and latest weekly activity are nonzero.
- Expected weeks appear.
- Organization fields populate.
- Sessions and credits reconcile with the source.
- Work-pattern buttons match the supplied Person Query fields.
- Privacy suppression applies below 10 people.
- No visual shows an error.

## Publish

1. Save as PBIX.
2. Apply the organization's sensitivity label.
3. Publish to an approved Power BI or Fabric workspace.
4. Configure OAuth credentials.
5. Configure a gateway for local-folder refresh when using Optimized Export.
6. Schedule refresh after the Viva Insights analyses complete.

See [Troubleshooting](docs/TROUBLESHOOTING.md) and the [Interpretation Guide](INTERPRETATION_GUIDE.md).

