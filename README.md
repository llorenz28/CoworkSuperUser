# CoworkSuperUser

> **Turn Viva Insights and Microsoft 365 Copilot Cowork consumption data into a
> clear, privacy-aware story of reach, repeat use, usage stages, potential
> champions, and work-pattern context.**

[![Status](https://img.shields.io/badge/status-testing-D83B96)](CHANGELOG.md)
[![Power BI](https://img.shields.io/badge/Power%20BI-2%20PBITs%20%2B%20PBIP-F2C811)](src/)
[![Classification](https://img.shields.io/badge/classification-Public-008272)](SECURITY.md)
[![Microsoft Analytics Hub](https://img.shields.io/badge/Microsoft-Analytics%20Hub-0078D4)](https://microsoft.github.io/Analytics-Hub/)

> [!IMPORTANT]
> **Template status: Public and in testing.** Validate source coverage, privacy
> requirements, outputs, and metric definitions before using findings for
> production decisions.

CoworkSuperUser is a data-free Power BI template for Cowork program owners,
Viva Insights analysts, adoption leads, enablement teams, and Power BI owners.
It combines:

- A Viva Insights Person Query that defines the approved person-week population
- A Microsoft 365 Copilot consumption query filtered to exactly
  `Service Name = "Cowork"`
- Available-history usage stages and movement
- Cowork sessions, credits, and consumption intensity
- Organizational adoption patterns and potential peer-enablement champions
- Descriptive collaboration, network, and beyond-hours context
- A complete glossary for all 117 semantic-model measures, including helpers

Both connection editions provide the same nine report pages, 39
bookmark-controlled states, 117 measures, visual logic, filters, privacy rules,
and interpretation guidance.

<div align="center">
<img src="images/CoworkSuperUser.gif" alt="Animated preview of all nine CoworkSuperUser pages using deterministic fabricated data" width="900">
</div>

The preview uses deterministic fabricated Contoso, Fabrikam, and Northwind data
for 1,200 fictional people across 26 weeks. It contains no customer findings,
identities, or benchmarks.

> **CoworkSuperUser Walkthrough:** a narrated tour of observed reach, weekly
> return, usage-stage movement, potential champions, sessions and credits,
> work-pattern context, metric interpretation, and the two setup paths.

https://github.com/user-attachments/assets/67e54184-bc7f-4e7f-a2fc-ed6d8c34545f

[Open or download the MP4](media/CoworkSuperUser-Walkthrough.mp4) ·
[Read the transcript](media/CoworkSuperUser-Walkthrough-transcript.md) ·
[Download subtitles](media/CoworkSuperUser-Walkthrough.srt)

---

## New here? Start in 3 steps

1. Ask a Viva Insights analyst to create the
   [Person and Cowork consumption queries](docs/QUERY_SETUP.md).
2. Download the
   [Direct Query template](https://github.com/microsoft/CoworkSuperUser/raw/main/CoworkSuperUser%20-%20Direct%20Query.pbit)
   or
   [Optimized Export template](https://github.com/microsoft/CoworkSuperUser/raw/main/CoworkSuperUser%20-%20Optimized%20Export.pbit).
3. Enter the requested identifiers or export folder, select **Load**, and
   complete the [post-load checks](SETUP.md).

The Direct Query edition is the simplest customer experience: enter the
Partition, Person Query, and Consumption Query identifiers. The Viva Insights
connector retrieves saved-query results and Power BI imports them during
refresh; this is not Tabular DirectQuery storage mode.

> **Not ready to load production data?** Review the animation, walkthrough,
> interpretation storyboard, and fabricated page captures first. The public
> assets contain no customer data.

---

## What the report answers

| Page | Business question |
| --- | --- |
| **Start Here** | Which page and connection path should I use? |
| **Executive Adoption** | Is observed Cowork reach broadening, and how much use is sustained? |
| **Weekly Adoption & Usage** | Are people joining, returning, intensifying, or churning? |
| **Adoption by Attributes** | Where do reach and sustained-use patterns differ? |
| **Habit Movement** | Are people moving toward stronger Cowork usage stages? |
| **Champion Identification** | Who may be a suitable peer-enablement partner? |
| **Sessions and Credits** | How much Cowork frequency and credit consumption is observed? |
| **Work Pattern Context** | Which collaboration or beyond-hours differences should be investigated? |
| **Methods and Metric Guide** | How is every current metric calculated and interpreted? |

Potential champion results are enablement signals, not employee-performance
ratings. Confirm role fit, willingness, manager support, and approved data use
before outreach.

![Weekly adoption and usage page populated with fabricated data](images/report-pages/03-weekly-adoption.png)

## Why use this template

- Keep the Person Query population intact while separating Cowork users from
  covered people with zero observed Cowork sessions.
- Read reach, repeat use, usage stage, movement, sessions, and credits as
  distinct signals.
- Compare functions and organization groups without treating correlation as
  causation.
- Identify possible peer-enablement champions using transparent criteria.
- Preserve missing optional evidence as unavailable rather than converting it
  to zero.
- Suppress aggregate person-derived results below the 10-person privacy floor.
- Trace every current measure to its definition, source, grain, evidence class,
  caveat, and report use.

## Choose your connection path

| | Direct Query | Optimized Export |
| --- | --- | --- |
| **Best for** | Script-free saved-query connection and scheduled refresh | Fastest validated refresh and support fallback |
| **Inputs** | Partition ID, Person Query ID, Consumption Query ID | Partition ID, Person Query ID, Cowork consumption export folder |
| **Consumption source** | Viva Insights saved-query connector | `PersonM365CreditsMetrics.csv` |
| **Refresh behavior** | Imports both completed saved-query results during refresh | Imports the connected Person Query and the exported Cowork consumption CSV |
| **Download** | [`CoworkSuperUser - Direct Query.pbit`](https://github.com/microsoft/CoworkSuperUser/raw/main/CoworkSuperUser%20-%20Direct%20Query.pbit) | [`CoworkSuperUser - Optimized Export.pbit`](https://github.com/microsoft/CoworkSuperUser/raw/main/CoworkSuperUser%20-%20Optimized%20Export.pbit) |

Both templates open on **Start Here** and explain both connection choices.

<a id="instructions"></a>

<details open>
<summary><strong>Instructions</strong></summary>

<br>

![Viva Insights Person Query setup reference](https://raw.githubusercontent.com/microsoft/DecodingSuperUsage/refs/heads/DecodingSuperUsage/images/viva_insights_setup.gif)

The animation is the public DecodingSuperUsage Person Query reference.
CoworkSuperUser requires both the Person Query and the Cowork consumption
analysis described below.

<details open>
<summary><strong>Written setup guide</strong></summary>

### Step 1: Confirm access and dates

You need current Power BI Desktop, access to the
[Viva Insights Analyst Workbench](https://analysis.insights.cloud.microsoft/),
and the **Insights Analyst** role for the target partition.

Use all available Cowork history beginning with the first week Cowork data
exists. Aim for at least 12 covered weeks when available. Use the same partition
and overlapping dates for both analyses. Do not add pre-Cowork weeks or
interpret them as zero.

### Step 2: Build the Person Query

1. Open **Analysis results**.
2. Select **Create analysis > Person query > Set up analysis**.
3. Set **Group by** to **Week**.
4. Select the approved employee population. If appropriate, filter to active
   employees.
5. Include every field below.
6. Run the analysis and wait for **Completed** or **Success**.

**Attributes**

| Attribute group | Select |
| --- | --- |
| Person and date | Person ID; Metric Date |
| Organizational data | Organization; Function type; Layer or level; Supervisor or manager indicator |

**Metrics**

| Metric group | Select | Metric group | Select |
| --- | --- | --- | --- |
| **After-hours collaboration** | After-hours collaboration hours | **Collaboration activity** | Active connected hours<br>Collaboration hours<br>Collaboration span<br>Email hours<br>Chat hours<br>Meeting hours<br>Unscheduled call hours |
| **Collaboration network** | Diverse ties<br>External network size<br>Internal network size<br>Network outside organization<br>Strong ties | **Collaboration by day of the week** | Weekend collaboration hours |

If the tenant only offers **Select all** at metric-group level, selecting all
metrics for these four groups is supported. CoworkSuperUser uses only the fields
listed above.

Do not select Microsoft 365 Copilot metrics for this Person Query solely for
CoworkSuperUser. Cowork sessions and credits come from the separate consumption
analysis.

Reference: [Viva Insights advanced analysis metric descriptions](https://learn.microsoft.com/viva/insights/advanced/reference/metrics).

The result must remain unique at one row per person per week. Do not filter this
query to Cowork users; it defines the full approved analytical population.

### Step 3: Build the Cowork consumption analysis

1. Select **Create analysis**.
2. Choose the Microsoft 365 Copilot consumption or cost-management analysis
   that exposes Person, Service, sessions, credits, and policy limits.
3. Use the same partition and an overlapping date range.
4. Set **Group by** to **Day**.
5. Include the **Person** and **Service** entities.
6. Apply the exact filter:

   ```text
   Service Name equals Cowork
   ```

7. Include Session count, Total Copilot Credits used, Spending policy limit,
   and User limit.
8. Retain Person ID, Service ID, Service Name, Spending Policy ID, Metric Date,
   and People Historical ID when available.
9. Run the analysis and wait for **Completed** or **Success**.

The model checks the exact Cowork filter again and aggregates daily and policy
rows to person-week. Covered people with no Cowork session remain in the report
as zero/non-users rather than being removed.

### Step 4: Copy the identifiers

From the completed result details, record:

- The shared **Partition Identifier**
- The **Person Query Identifier**
- The **Consumption Query Identifier**

If the page only provides **Copy link**, use the partition and result GUIDs from
that link. Enter raw GUIDs only—no labels, quotation marks, braces, or URLs.

### Step 5A: Connect Direct Query

1. Open `CoworkSuperUser - Direct Query.pbit`.
2. Enter the Partition, Person Query, and Consumption Query identifiers.
3. Select **Load**.
4. Sign in using **Organizational account/OAuth2** with an account that can read
   the partition and both completed results.
5. If Power BI asks for a privacy level, use the organization-approved level;
   **Organizational** is normally appropriate.
6. Wait for the entire refresh to finish.

This edition imports both saved-query results during refresh; it is not Tabular
DirectQuery storage mode.

### Step 5B: Connect Optimized Export

1. Export the completed Cowork consumption result as row-level CSV.
2. Place the CSV in a dedicated protected folder.
3. Ensure its filename is exactly:

   ```text
   PersonM365CreditsMetrics.csv
   ```

4. Remove duplicate copies beneath that folder and close the file in Excel.
5. Open `CoworkSuperUser - Optimized Export.pbit`.
6. Enter the Partition Identifier, Person Query Identifier, and the **folder**
   containing the CSV.
7. Select **Load** and authenticate to Viva Insights for the Person Query.

The folder loader searches subfolders and rejects missing or duplicate copies.

Read the full runbook:
**[Build and connect the Viva Insights analyses](docs/QUERY_SETUP.md)**.

</details>

<details>
<summary><strong>Validation and troubleshooting</strong></summary>

Confirm that:

- Start Here opens first.
- Population and expected covered weeks appear.
- Organization, Function, Level, and manager fields populate.
- Sessions and credits reconcile with the completed consumption result.
- Work Pattern Context enables every supplied metric.
- History status and the 10-person privacy floor behave correctly.
- Methods and Metric Guide contains 117 current definitions.
- No page or alternate view displays an error.

For **Access to the resource is forbidden**, open
**File > Options and settings > Data source settings**, clear the Viva Insights
permissions, exit Desktop completely, reopen the PBIT, and sign in with the
correct organizational account.

See [Troubleshooting](docs/TROUBLESHOOTING.md).

</details>

<details>
<summary><strong>Publish and automatic refresh</strong></summary>

1. Save the loaded report as PBIX.
2. Apply the customer's required sensitivity label.
3. Publish to an approved Power BI or Fabric workspace.
4. Configure the Viva Insights source with OAuth2 credentials.
5. For Optimized Export, configure an on-premises data gateway that can read
   the export folder.
6. Schedule refresh after the Viva analyses normally complete.
7. Run an on-demand refresh and verify the newest complete week before sharing.

</details>

</details>

## Release kit

| Resource | Open or download |
| --- | --- |
| Direct Query Power BI template | [`CoworkSuperUser - Direct Query.pbit`](CoworkSuperUser%20-%20Direct%20Query.pbit) |
| Optimized Export Power BI template | [`CoworkSuperUser - Optimized Export.pbit`](CoworkSuperUser%20-%20Optimized%20Export.pbit) |
| Step-by-step setup | [`SETUP.md`](SETUP.md) |
| Query build instructions | [`docs/QUERY_SETUP.md`](docs/QUERY_SETUP.md) |
| Interpretation guide | [`INTERPRETATION_GUIDE.md`](INTERPRETATION_GUIDE.md) |
| Interpretation storyboard | [`PPTX`](CoworkSuperUser%20Interpretation%20Storyboard.pptx) |
| Narrated walkthrough | [`MP4`](media/CoworkSuperUser-Walkthrough.mp4) · [`Transcript`](media/CoworkSuperUser-Walkthrough-transcript.md) · [`Subtitles`](media/CoworkSuperUser-Walkthrough.srt) |
| Editable PBIP sources | [`Direct Query`](src/direct-query/CoworkVivaV3.pbip) · [`Optimized Export`](src/optimized-export/CoworkVivaV3.pbip) |
| Troubleshooting | [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) |
| Security guidance | [`SECURITY.md`](SECURITY.md) |
| Release evidence | [`validation/release-manifest.json`](validation/release-manifest.json) |

### Validated report contract

- Nine report pages
- 39 bookmark-controlled states
- 117 semantic-model measures
- Complete 117-row Methods and Metric Guide
- Start Here saved as the opening page
- Consistent page-header alignment
- Available-history four- and twelve-week windows
- Aggregate person-derived results suppressed below 10 people
- No tenant identifiers, customer data, local QA paths, or cached model data in
  the distributable templates

Power BI sensitivity labels apply to PBIX files and are not retained in PBIT
exports. The public classification is documented here and in the release
manifest; customers must label the refreshed PBIX before sharing it.

## Interpretation boundaries

1. The Person Query is the analytical population spine, not proof of Cowork
   entitlement.
2. Observed active-user share is not an eligibility-based adoption rate.
3. Sessions are not tasks.
4. Credits are not productivity, quality, complexity, time saved, or business
   value.
5. Work-pattern differences are descriptive and non-causal.
6. Champion candidates are outreach starting points, not personnel scores.
7. Missing optional evidence means unavailable, not zero.
8. Pre-Cowork weeks are outside the analysis, not zero-use weeks.
9. Aggregate person-derived results below 10 people are suppressed.

Use the
[interpretation guide](INTERPRETATION_GUIDE.md) and
[interpretation storyboard](CoworkSuperUser%20Interpretation%20Storyboard.pptx)
before presenting results.

## Security and privacy

The PBIT files are data-free and contain no customer data or machine-bound
`.pbi` cache. Production Person Query and consumption results can contain
personal and business information. Never commit them, attach them to an issue,
or place them in an unapproved location.

Define row-level security roles against the `Organization` table when audiences
should see different functions or organizations. Assign Entra ID security
groups rather than individual accounts and test each role with
**Modeling > View as**. Workspace admins and semantic-model owners can see all
data.

Read [SECURITY.md](SECURITY.md) before using production data.

## Email your Viva Insights analyst

Before setup, a Viva Insights administrator or Insights Analyst must create two
completed analyses in the same partition.

**[Email the query prerequisites](mailto:?subject=Viva%20Insights%20query%20setup%20for%20CoworkSuperUser&body=Please%20create%20two%20completed%20Viva%20Insights%20analyses%20in%20the%20same%20partition%20for%20the%20public%20CoworkSuperUser%20Power%20BI%20template.%0A%0A1.%20Person%20Query%3A%20all%20available%20Cowork%20history%20beginning%20with%20the%20first%20available%20Cowork%20week%2C%20aiming%20for%20at%20least%2012%20covered%20weeks%20when%20available%3B%20group%20by%20Week%3B%20include%20Person%20ID%2C%20Organization%2C%20Function%2C%20Level%2C%20Supervisor%20indicator%2C%20collaboration%20hours%2C%20active%20connected%20hours%2C%20email%2C%20chat%2C%20meeting%2C%20unscheduled%20calls%2C%20after-hours%20and%20weekend%20collaboration%2C%20collaboration%20span%2C%20network%20size%2C%20strong%20ties%2C%20diverse%20ties%2C%20and%20network%20outside%20organization.%0A%0A2.%20Cowork%20consumption%20query%3A%20same%20date%20range%3B%20group%20by%20Day%3B%20Person%20and%20Service%20entities%3B%20filter%20Service%20Name%20equals%20Cowork%3B%20include%20Session%20count%2C%20Total%20Copilot%20Credits%20used%2C%20Spending%20policy%20limit%2C%20and%20User%20limit.%0A%0AWhen%20both%20analyses%20show%20Completed%20or%20Success%2C%20please%20provide%20the%20shared%20Partition%20ID%2C%20Person%20Query%20ID%2C%20and%20Consumption%20Query%20ID.%20Do%20not%20send%20exported%20person-level%20data%20by%20email.%0A%0AGuide%3A%20https%3A%2F%2Fgithub.com%2Fmicrosoft%2FCoworkSuperUser%2Fblob%2Fmain%2Fdocs%2FQUERY_SETUP.md)**

## Repository structure

```text
CoworkSuperUser - Direct Query.pbit
CoworkSuperUser - Optimized Export.pbit
CoworkSuperUser Interpretation Storyboard.pptx
INTERPRETATION_GUIDE.md
README.md
SETUP.md
docs/
images/report-pages/
media/
release/
src/
tools/
validation/
```

## Related resources

- [Cowork Adoption Intelligence](https://github.com/microsoft/Cowork-Adoption-Intelligence)
- [Decoding Super Usage](https://github.com/microsoft/DecodingSuperUsage)
- [Cowork Billing](https://microsoft.github.io/Analytics-Hub/cowork-billing/)
- [Microsoft Analytics Hub](https://microsoft.github.io/Analytics-Hub/)
- [Viva Insights Analyst Workbench](https://analysis.insights.cloud.microsoft/)
- [Viva Insights Python library](https://microsoft.github.io/vivainsights-py/)
- [Viva Insights R library](https://microsoft.github.io/vivainsights/)

See [ATTRIBUTION.md](ATTRIBUTION.md) for the Microsoft patterns and public assets
adapted by this project.

## Release status and feedback

The current public release is **v1.0.1**. Review the
[changelog](CHANGELOG.md) and
[release manifest](validation/release-manifest.json) before broad distribution.

- Use [GitHub Issues](https://github.com/microsoft/CoworkSuperUser/issues) for
  reproducible defects and documentation gaps.
- Do not attach tenant exports, credentials, customer identifiers, or
  identifiable screenshots.
- Star the repository for discovery and watch releases for updated templates,
  definitions, and walkthrough assets.

## License

This project is licensed under the [MIT License](LICENSE).

## Trademarks

This project may contain Microsoft trademarks or logos. Use of Microsoft
trademarks or logos must follow
[Microsoft's Trademark and Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks).
Modified versions must not cause confusion or imply Microsoft sponsorship.
