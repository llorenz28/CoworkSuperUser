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

## Preview and walkthrough

The GIF carousel provides a quick tour of all nine pages. The narrated video
explains what the pages answer, how to interpret them, and how the two setup
paths differ.

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

## Start here

For most customers, the shortest setup is **Optimized Export**: one Person
Query plus one Consumption Dashboard download. Use **Direct Query** only when
an Insights Analyst has global-partition access and recurring connector-based
consumption refresh is important.

| Your task | Start with |
| --- | --- |
| Create the Viva Insights inputs | [Detailed setup runbook](docs/QUERY_SETUP.md) |
| You already have the inputs and want to load Power BI | [Power BI connection checklist](SETUP.md) |
| Review or present an already loaded report | [Interpretation Guide](INTERPRETATION_GUIDE.md) |

The end-to-end flow is:

1. Create one weekly **Person Query** for the approved employee population.
2. Choose one Cowork consumption input: **Export by day** from the Consumption
   Dashboard, or a saved daily **Consumption query**.
3. Open the matching PBIT and enter the requested IDs or export folder.
4. Validate the population, date coverage, sessions, and credits before
   sharing findings.

Different people can complete these steps. The runbook identifies exactly
which role is needed at each point and distinguishes load-critical fields from
optional report enrichment.

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

| | Optimized Export (recommended) | Direct Query (advanced) |
| --- | --- | --- |
| **Use when** | An eligible user can export the Consumption Dashboard | An Insights Analyst can create Consumption queries in the global partition |
| **Inputs** | Person Query link and dashboard export folder | Person Query link and Consumption Query link |
| **Consumption source** | `PersonServiceCreditsMetrics.csv` from **Export by day** | Saved custom Consumption query grouped by Day |
| **After publishing** | A gateway is needed only for scheduled refresh from the folder | No folder gateway; schedule refresh after both saved queries update |
| **Download** | [`CoworkSuperUser - Optimized Export.pbit`](https://github.com/microsoft/CoworkSuperUser/raw/main/CoworkSuperUser%20-%20Optimized%20Export.pbit) | [`CoworkSuperUser - Direct Query.pbit`](https://github.com/microsoft/CoworkSuperUser/raw/main/CoworkSuperUser%20-%20Direct%20Query.pbit) |

Both templates open on **Start Here** and explain both connection choices.
The Direct Query name describes the connection setup; both editions use Power
BI Import storage.

<a id="instructions"></a>

<details open>
<summary><strong>Instructions</strong></summary>

<br>

1. Follow **[Set up CoworkSuperUser](docs/QUERY_SETUP.md)** to create the weekly
   Person Query and one consumption input.
2. Use **[Connect the Power BI template](SETUP.md)** to enter the parameters and
   validate the loaded report.
3. Use **[Troubleshooting](docs/TROUBLESHOOTING.md)** only if a load, field, or
   refresh check fails.

The Person Query needs Person ID and Metric Date to load. Organization fields
are recommended for breakdowns, while collaboration and network metrics are
optional inputs for **Work Pattern Context**. The detailed guide lists every
supported field and what happens when it is omitted.

> [!NOTE]
> Do not reuse the Microsoft 365 Copilot and Focus metric selections from the
> DecodingSuperUsage setup animation. That report has a different model.
> CoworkSuperUser gets sessions and credits from its separate consumption
> input and does not require Microsoft 365 Copilot metrics in the Person Query.

</details>

## Release kit

| Resource | Open or download |
| --- | --- |
| Direct Query Power BI template | [`CoworkSuperUser - Direct Query.pbit`](CoworkSuperUser%20-%20Direct%20Query.pbit) |
| Optimized Export Power BI template | [`CoworkSuperUser - Optimized Export.pbit`](CoworkSuperUser%20-%20Optimized%20Export.pbit) |
| Power BI connection checklist | [`SETUP.md`](SETUP.md) |
| Detailed setup runbook | [`docs/QUERY_SETUP.md`](docs/QUERY_SETUP.md) |
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

## Hand off the setup

Every path needs one successful Person Query. For Optimized Export, an eligible
user then downloads **Export by day** from the Consumption Dashboard; no custom
Consumption query is needed. Only the advanced Direct Query path needs two
successful analyses in the same global partition.

**Advanced path only:**

**[Email the advanced-path prerequisites](mailto:?subject=CoworkSuperUser%20advanced%20setup%20request&body=Please%20create%20two%20successful%20Viva%20Insights%20queries%20in%20the%20global%20partition%20for%20CoworkSuperUser.%0A%0A1.%20Person%20Query%3A%20Group%20by%20Week%2C%20use%20the%20approved%20population%2C%20and%20do%20not%20filter%20to%20Cowork%20users.%20Include%20Person%20ID%20and%20Metric%20Date.%20Use%20the%20guide%20for%20optional%20organization%20and%20work-pattern%20fields.%0A%0A2.%20Consumption%20query%3A%20Group%20by%20Day%2C%20keep%20the%20four%20preselected%20metrics%2C%20add%20ServiceName%20%3D%20Cowork%2C%20and%20use%20a%20date%20range%20that%20overlaps%20the%20Person%20Query.%0A%0APlease%20send%20the%20Copy%20link%20for%20each%20successful%20result.%20Do%20not%20send%20exported%20person-level%20data%20by%20email.%0A%0AGuide%3A%20https%3A%2F%2Fgithub.com%2Fmicrosoft%2FCoworkSuperUser%2Fblob%2Fmain%2Fdocs%2FQUERY_SETUP.md)**

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
