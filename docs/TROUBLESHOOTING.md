# Troubleshooting

## Access to the resource is forbidden

Power BI may be reusing stale Viva Insights credentials.

1. In Power BI Desktop, open **File > Options and settings > Data source settings**.
2. Select the Viva Insights source and choose **Clear Permissions**.
3. Exit Power BI Desktop completely.
4. Reopen the PBIT and sign in with the organizational account that has Insights Analyst access to the partition.

If your browser authentication flow is blocked, open **File > Options and settings > Options > Global > Security** and disable **Use my default web browser** to use the embedded sign-in experience.

## Blank visuals

- Confirm both analyses show **Completed** or **Success**.
- Confirm the Person query uses **Week**, not Month.
- Confirm the query contains the attributes and work-pattern metrics in [QUERY_SETUP.md](QUERY_SETUP.md).
- Confirm both results cover overlapping dates.
- Confirm the consumption query filters Service Name to `Cowork`.

## Work Pattern buttons are missing

The template intentionally hides patterns whose Person query column is absent or entirely blank. Add the missing metric and rerun the Person query.

## History is provisional or unavailable

This is expected for a new deployment. The selected **Up to 4 weeks** or **Up to 12 weeks** window uses available covered weeks up to that cap. Movement and comparison measures need additional history.

## Local export refresh fails after publishing

The Optimized Export variant reads a local folder. Configure an on-premises data gateway or use the Direct Query template for a connector-only deployment.

## Scheduled refresh

After publishing:

1. Open the semantic model settings in Power BI or Fabric.
2. Configure Viva Insights OAuth credentials.
3. Configure a refresh schedule after the saved Viva analyses normally complete.
4. Verify that a new week appears before using the refreshed report.

