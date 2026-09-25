# Security

Do not commit tenant query identifiers, local export paths, exported Viva Insights data, Power BI cache folders, or credentials.

The distributed PBIT files are classified **Public** and contain no customer data. Power BI does not retain sensitivity labels in PBIT exports. Apply an appropriate organizational sensitivity label after loading customer data and before sharing populated reports.

## Report data

- Person-level data remains customer-controlled.
- User IDs displayed by the report are pseudonymous source identifiers.
- Aggregate person-derived measures are suppressed below 10 people.
- Customers must validate their authorized purpose, workspace permissions, retention, export handling, and downstream sharing.

## Reporting a vulnerability

Follow the [Microsoft Security Response Center reporting guidance](https://aka.ms/security.md). Do not include customer data, query identifiers, or credentials in a public GitHub issue.
