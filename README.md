<div align="center">

# CoworkSuperUser

### Turn Viva Insights and Cowork consumption data into a clear, privacy-aware adoption story.

[![Built by Microsoft](https://img.shields.io/badge/Built%20by-Microsoft-0078d4?style=for-the-badge&logo=microsoft&logoColor=white)](https://microsoft.github.io/Analytics-Hub/team/)
[![Analytics Hub](https://img.shields.io/badge/Analytics%20Hub-11%20Repositories-8661c5?style=for-the-badge&logo=github&logoColor=white)](https://microsoft.github.io/Analytics-Hub/)

**All Reports:** [https://microsoft.github.io/Analytics-Hub/](https://microsoft.github.io/Analytics-Hub/)

**Cowork Billing:** [https://microsoft.github.io/Analytics-Hub/cowork-billing/](https://microsoft.github.io/Analytics-Hub/cowork-billing/)

**Found this useful? Star this repository to help others discover it.**

**[Dashboard Preview](#dashboard-preview)** | **[Download](#download)** | **[Instructions](#instructions)** | **[Interpretation](#interpretation-and-storytelling)** | **[Related Resources](#related-resources)** | **[Email Your Admin](#email-your-admin)**

</div>

---

> [!IMPORTANT]
> **Version 1.0 is public and in testing.** Validate outputs, source coverage, privacy requirements, and metric definitions before using findings for production decisions.

CoworkSuperUser is a data-free Power BI template for Microsoft 365 Copilot Cowork program owners, Viva Insights analysts, adoption leads, enablement teams, and Power BI owners. It connects:

- Observed Cowork reach and weekly return
- Available-history usage stages and movement
- Cowork sessions, credits, and consumption intensity
- Organizational adoption patterns
- Potential peer-enablement champions
- Descriptive collaboration-network and beyond-hours context
- Transparent sources, formulas, evidence classes, and privacy rules

The repository includes two customer connection options with the same nine pages, 39 bookmarks, 117 measures, visuals, filters, and interpretation logic.

<a id="dashboard-preview"></a>

## Dashboard preview

<details open>
<summary><strong>CoworkSuperUser dashboard preview</strong></summary>

<br>

<img src="images/CoworkSuperUser.gif" alt="CoworkSuperUser dashboard preview using deterministic fabricated data" width="100%" />

The preview uses deterministic fabricated Contoso, Fabrikam, and Northwind data for 1,200 fictional people across 26 weeks. It contains no customer findings, identities, or benchmarks.

</details>

---

<a id="download"></a>

## Download

| Template | Customer inputs | Best for | Download |
| --- | --- | --- | --- |
| **Direct Query** | Partition ID, Person Query ID, Consumption Query ID | Script-free saved-query connection and scheduled refresh | [Download PBIT](https://github.com/microsoft/CoworkSuperUser/raw/main/CoworkSuperUser%20-%20Direct%20Query.pbit) |
| **Optimized Export** | Partition ID, Person Query ID, Cowork consumption export folder | Fastest validated refresh and support fallback | [Download PBIT](https://github.com/microsoft/CoworkSuperUser/raw/main/CoworkSuperUser%20-%20Optimized%20Export.pbit) |

> The Direct Query name describes the customer setup experience. The Viva Insights connector retrieves saved-query results, and Power BI imports those results during refresh; this is not Tabular DirectQuery storage mode.

### Validated release characteristics

- Nine report pages
- 39 bookmark-controlled states
- 117 measures
- Start Here saved as the opening page
- Header alignment validated across all pages
- Short histories load with provisional or unavailable labels
- Aggregate person-derived results suppressed below 10 people
- No tenant identifiers, customer data, local QA paths, or cached semantic-model data in the PBIT files

---

## Questions the report answers

| Page | Business question |
| --- | --- |
| **Start Here** | Which page should I use for my question? |
| **Executive Adoption** | Is observed Cowork reach broadening, and how much use is sustained? |
| **Weekly Adoption & Usage** | Are people joining, returning, intensifying, or churning? |
| **Adoption by Attributes** | Where do reach and sustained-use patterns differ? |
| **Habit Movement** | Are people moving toward stronger Cowork usage stages? |
| **Champion Identification** | Who may be a suitable peer-enablement partner? |
| **Sessions and Credits** | How much Cowork frequency and credit consumption is observed? |
| **Work Pattern Context** | Which collaboration or beyond-hours differences should be investigated? |
| **Methods and Metric Guide** | How is each metric calculated and interpreted? |

Potential champion results are enablement signals, not employee-performance ratings. Confirm role fit, willingness, manager support, and appropriate data use before outreach.

---

<a id="instructions"></a>

## Instructions

![Viva Insights Person Query setup reference](https://raw.githubusercontent.com/microsoft/DecodingSuperUsage/refs/heads/DecodingSuperUsage/images/viva_insights_setup.gif)

The animation above is the public DecodingSuperUsage Person Query setup reference. CoworkSuperUser additionally requires the Cowork consumption query described below.

<details open>
<summary><strong>Quick setup</strong></summary>

### 1. Build the Person Query

In the [Viva Insights Analyst Workbench](https://analysis.insights.cloud.microsoft/):

1. Open **Analysis results**.
2. Select **Create analysis > Person query**.
3. Use a rolling **last 6 months** period when possible.
4. Set **Group by** to **Week**.
5. Include Person ID, Organization, Function type, Layer or level, and Supervisor indicator.
6. Include collaboration hours, active connected hours, email, chat, meeting, unscheduled calls, after-hours collaboration, weekend collaboration, collaboration span, network size, strong ties, diverse ties, and network outside organization.
7. Run the query and wait for **Completed** or **Success**.

### 2. Build the Cowork consumption query

1. Create the Microsoft 365 Copilot consumption or cost-management analysis.
2. Use the same date range.
3. Set **Group by** to **Day**.
4. Use Person and Service as entities.
5. Filter **Service Name** to exactly `Cowork`.
6. Include Session count, Total Copilot Credits used, Spending policy limit, and User limit.
7. Run the query and wait for **Completed** or **Success**.

### 3. Copy the identifiers

Record:

- Shared Partition Identifier
- Person Query Identifier
- Consumption Query Identifier

Use raw GUIDs only.

### 4. Load a template

- **Direct Query:** enter all three identifiers.
- **Optimized Export:** enter the partition and Person Query identifiers, then select the folder containing `PersonM365CreditsMetrics.csv`.

### 5. Validate

Confirm population, weeks, sessions, organization coverage, visible work-pattern buttons, history status, privacy suppression, and no visual errors.

Read the complete guide: **[Build the Viva Insights queries](docs/QUERY_SETUP.md)**.

</details>

<details>
<summary><strong>Access and roles</strong></summary>

- **Insights Analyst** for the target Viva Insights partition
- Access to the Analyst Workbench
- Power BI Desktop to open PBIT files
- Permission to use individual-level data for the approved adoption and enablement purpose
- Power BI workspace permission to publish and configure semantic-model refresh

The report exposes pseudonymous User IDs in selected drill paths. Customers are responsible for access control, approved purpose, retention, and sensitivity labeling after loading production data.

</details>

<details>
<summary><strong>Publish and refresh</strong></summary>

1. Save the loaded report as PBIX.
2. Apply the customer's required Purview sensitivity label.
3. Publish to an approved Power BI or Fabric workspace.
4. Configure Viva Insights OAuth credentials.
5. For Optimized Export, configure an on-premises data gateway for the local folder.
6. Schedule refresh after the saved Viva analyses normally complete.
7. Verify that a new covered week appears before using refreshed findings.

</details>

<details>
<summary><strong>Row-level security</strong></summary>

Define roles in Power BI Desktop against the `Organization` table when different audiences should see different functions or organizations. After publishing, assign Entra ID security groups to roles from the semantic model's **Security** settings.

Use groups rather than individual accounts. Workspace admins and semantic-model owners can see all data. Test each role with **Modeling > View as** before distribution.

</details>

<details>
<summary><strong>Troubleshooting</strong></summary>

Common fixes:

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Access to the resource is forbidden | Stale Viva Insights credentials | Clear Viva Insights permissions, exit Desktop, reopen, and sign in |
| Blank visuals | Query incomplete or required fields missing | Wait for Success and rerun with the documented fields |
| Work-pattern buttons missing | Optional Person Query metric absent or blank | Add the metric and rerun the Person Query |
| Provisional history | Fewer weeks than the selected cap | Continue refreshing; the report uses available covered weeks |
| Local-folder refresh fails in service | Gateway not configured | Configure a gateway or use Direct Query |

See **[Troubleshooting](docs/TROUBLESHOOTING.md)**.

</details>

---

<a id="interpretation-and-storytelling"></a>

## Interpretation and storytelling

- [Interpretation Storyboard PPTX](CoworkSuperUser%20Interpretation%20Storyboard.pptx)
- [Detailed interpretation guide](INTERPRETATION_GUIDE.md)
- [Narrated walkthrough MP4](media/CoworkSuperUser-Walkthrough.mp4)
- [Walkthrough transcript](media/CoworkSuperUser-Walkthrough-transcript.md)
- [Captions](media/CoworkSuperUser-Walkthrough.srt)

Use these assets to:

- Create an executive-ready review
- Separate reach, return, stage movement, and consumption
- Explain potential champions responsibly
- Frame work-pattern context without a causal claim
- Carry period, population, filters, source status, evidence class, and privacy state into decision records

The walkthrough uses the same `en-US-AvaNeural` voice, friendly-professional pacing, 1080p format, and story rhythm as the Cowork Adoption Intelligence walkthrough.

---

## Privacy and interpretation boundaries

1. The Person Query is the analytical population spine, not proof of Cowork entitlement.
2. Observed active-user share is not an eligibility-based adoption rate.
3. Sessions are not tasks.
4. Credits are not productivity, quality, complexity, time saved, or business value.
5. Work-pattern differences are descriptive and non-causal.
6. Champion candidates are outreach starting points, not personnel scores.
7. Missing optional evidence means unavailable, not zero.
8. Aggregate person-derived results below 10 people are suppressed.

---

<a id="related-resources"></a>

## Related resources

### Microsoft templates

- [Cowork Adoption Intelligence](https://github.com/microsoft/Cowork-Adoption-Intelligence)
- [Decoding Super Usage](https://github.com/microsoft/DecodingSuperUsage)
- [Cowork Billing](https://microsoft.github.io/Analytics-Hub/cowork-billing/)
- [Microsoft Analytics Hub](https://microsoft.github.io/Analytics-Hub/)

### Viva Insights

- [Viva Insights Analyst Workbench](https://analysis.insights.cloud.microsoft/)
- [Viva Insights Python library](https://microsoft.github.io/vivainsights-py/)
- [Viva Insights R library](https://microsoft.github.io/vivainsights/)

### Attribution

See [ATTRIBUTION.md](ATTRIBUTION.md) for the public Microsoft patterns and assets adapted by this project.

---

<a id="email-your-admin"></a>

## Email your admin

Before setup, a Viva Insights administrator or Insights Analyst must create the Person and Cowork consumption queries.

**[Email the query prerequisites](mailto:?subject=Action%20Required%3A%20Viva%20Insights%20query%20setup%20for%20CoworkSuperUser%20Power%20BI&body=To%3A%20Viva%20Insights%20Administrator%20/%20Insights%20Analyst%0A%0AWe%20are%20preparing%20the%20public%20CoworkSuperUser%20Power%20BI%20report%20for%20Microsoft%20365%20Copilot%20Cowork%20adoption%20analysis.%20Please%20create%20two%20completed%20Viva%20Insights%20analyses%20in%20the%20same%20partition.%0A%0A1.%20PERSON%20QUERY%0A-%20Rolling%20last%206%20months%20when%20possible%0A-%20Group%20by%20Week%0A-%20Active%20employee%20population%0A-%20Attributes%3A%20Person%20ID%2C%20Organization%2C%20Function%20type%2C%20Layer%20or%20level%2C%20Supervisor%20indicator%0A-%20Metrics%3A%20collaboration%20hours%2C%20active%20connected%20hours%2C%20email%2C%20chat%2C%20meeting%2C%20unscheduled%20calls%2C%20after-hours%20collaboration%2C%20weekend%20collaboration%2C%20collaboration%20span%2C%20internal%20and%20external%20network%20size%2C%20strong%20and%20diverse%20ties%2C%20and%20network%20outside%20organization%0A%0A2.%20COWORK%20CONSUMPTION%20QUERY%0A-%20Same%20date%20range%0A-%20Group%20by%20Day%0A-%20Entity%3A%20Person%20and%20Service%0A-%20Filter%20Service%20Name%20%3D%20Cowork%0A-%20Metrics%3A%20Session%20count%2C%20Total%20Copilot%20Credits%20used%2C%20Spending%20policy%20limit%2C%20User%20limit%0A%0AWait%20for%20both%20results%20to%20show%20Completed%20or%20Success.%20Then%20provide%20the%20shared%20Partition%20ID%2C%20Person%20Query%20ID%2C%20and%20Consumption%20Query%20ID.%20Please%20do%20not%20send%20exported%20person-level%20data%20by%20email.%0A%0ASetup%20guide%3A%20https%3A//github.com/microsoft/CoworkSuperUser/blob/main/docs/QUERY_SETUP.md)**

---

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

The distributable PBIT files contain no customer data or machine-bound `.pbi` cache. After loading customer data, apply the organization's required sensitivity label before sharing the saved PBIX.

---

## Feedback and updates

- Use [GitHub Issues](https://github.com/microsoft/CoworkSuperUser/issues) for reproducible defects and documentation gaps.
- Star the repository for discovery.
- Watch releases for updated templates, definitions, and walkthrough assets.

