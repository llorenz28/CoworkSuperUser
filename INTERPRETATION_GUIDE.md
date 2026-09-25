# CoworkSuperUser interpretation guide

**Version:** 1.0.1
**Audience:** Microsoft 365 Copilot adoption leads, Viva Insights analysts, enablement teams, program owners, and Power BI owners

CoworkSuperUser is a data-free Power BI template for understanding observed Cowork reach, return, usage stages, consumption, potential champions, and descriptive work-pattern context. This guide explains what each page answers, how to read it, what to investigate, and which conclusions remain outside the evidence.

> The repository screenshots use deterministic fabricated data for 1,200 fictional people across 26 weeks. They are not customer results, targets, or benchmarks.

## Five-minute orientation

| Step | Page | Decision supported |
| --- | --- | --- |
| 1 | **Executive Adoption** | Is observed Cowork reach broadening, and how much of the population is sustaining use? |
| 2 | **Weekly Adoption & Usage** | Is the latest result sustained, concentrated, returning, or driven by new people? |
| 3 | **Habit Movement** | Are people moving toward stronger stages or slipping to weaker stages? |
| 4 | **Work Pattern Context** | Which work-pattern differences should be investigated with local context? |

Use **Champion Identification** only when the next decision is peer-enablement outreach. Use **Adoption by Attributes** only after population size and organizational fields have been checked. Before quoting a result, confirm its definition in **Methods and Metric Guide**.

## Result-context block

Every reported result should carry:

| Context | What to record |
| --- | --- |
| Reporting period | Exact dates and whether the selected window is Up to 4 or Up to 12 weeks |
| Population | Tenant, organization, function, level, manager status, or selected users |
| Filters | Every active report, page, and visual filter |
| Source status | Person Query and Cowork consumption result status and overlap |
| Evidence label | Observed, Derived, Context, Reference, or Unavailable |
| Privacy state | Population and whether the 10-person floor suppressed the result |

## Evidence model

| Source | Grain | Role | Required? |
| --- | --- | --- | --- |
| Viva Insights Person Query | Person + week | Population spine, organization attributes, collaboration and network context | **Yes** |
| Cowork consumption query or export | Person + service + policy + date | Sessions, credits, coverage, and policy context | **Yes** |
| Template rules and selectors | Disconnected model tables | Window choice, stage thresholds, privacy rules, definitions, and interpretation | Included |

The model:

1. Keeps the validated Person Query at person-week grain.
2. Filters the consumption result to `ServiceName = Cowork`.
3. Aggregates policy rows to person-week.
4. Aligns all weeks to Sunday.
5. Left-joins Cowork facts to the Person Query population.
6. Treats a missing fact as zero only when that week is covered; otherwise the value stays unknown.
7. Classifies stages over the available covered weeks up to the selected 4- or 12-week cap.
8. Suppresses aggregate person-derived results below 10 people.

## Evidence wording

| Evidence class | Meaning | Safe wording |
| --- | --- | --- |
| Observed | Directly aggregated from a connected query field | “The connected result contains…” |
| Derived | Calculated from observed data | “The report calculates…” |
| Context | Descriptive comparison that does not establish impact | “The selected groups differ descriptively…” |
| Reference | A definition, threshold, or interpretation rule | “The template defines…” |
| Unavailable | Required history, population, or source is absent | “This cannot be calculated from the current inputs or filters.” |

---

## Page 1: Start Here

### Purpose

Route the current business question to the page with the right evidence and boundary.

### Read it in this order

1. Decide whether the question is about momentum, cohorts, maturity, work patterns, consumption, or organizational differences.
2. Open one primary destination.
3. Confirm the selected history window and source-status message.
4. Use Methods and Metric Guide before copying a number into another document.

### Action

Use one primary page for the answer and one corroborating page for trend or denominator context.

### Guardrail

Do not combine unrelated cards into a causal narrative. Start Here is a decision router, not a summary scorecard.

## Page 2: Executive Adoption

### Purpose

Summarize observed reach, sustained-use share, latest weekly activity, and function-level distribution.

### Read it in this order

1. **Population** establishes the analytical denominator.
2. **Observed active users** counts people with positive Cowork sessions in the selected context.
3. **Sustained-use share** combines Power and Habitual stages.
4. **Latest weekly active rate** shows the most recent complete aligned week.
5. Compare the weekly trend with the function benchmark bars.

### Diagnostic questions

- Is reach broadening while sustained use is stable or improving?
- Is activity concentrated in a small number of functions?
- Did a rollout, campaign, holiday, or source boundary coincide with a change?
- Does the selected population meet the privacy floor?

### Action

Open Weekly Adoption & Usage to determine whether the latest result is sustained. Use Adoption by Attributes when a function needs local enablement follow-up.

### Guardrail

Observed user share is not an eligibility-based adoption rate unless an approved Cowork entitlement roster is supplied.

## Page 3: Weekly Adoption & Usage

### Purpose

Show whether Cowork use is recurring and how reach, return, cohorts, sessions, and credits change over time.

### Read it in this order

1. Select one view.
2. Read exact table or heatmap values before reading relative color.
3. Compare weekly active rate, return rate, new people, and sessions per active person.
4. Expand a department only when person-level review is authorized.
5. Compare the same population and date context before describing a trend.

### Diagnostic questions

- Is growth coming from new people, retained people, or resurrected people?
- Is reach rising while return falls?
- Are sessions becoming more intense without more active people?
- Does a department pattern differ from the company trend?

### Action patterns

| Pattern | Enablement response |
| --- | --- |
| Reach up, return flat or down | Improve second-use guidance and repeatable starter workflows |
| Return up, reach flat | Scale proven workflows to additional teams |
| Sessions up, active rate flat | Check whether use is concentrated in a small cohort |
| Credits up faster than sessions | Review consumption intensity and policy context |

### Guardrail

Heatmap color is relative to the current visual. Sessions and credits describe usage and consumption, not task completion, productivity, quality, or business value.

## Page 4: Adoption by Attributes

### Purpose

Compare observed reach and sustained-use patterns across function, organization, or level.

### Read it in this order

1. Select the comparison view.
2. Check the population and privacy status.
3. Compare the selected department or function with the company benchmark.
4. Read observed reach separately from sustained-use share.
5. Use the recommended-focus view only as a program prompt.

### Action

Prioritize groups with sufficient population and a specific enablement gap. Validate the proposed response with the local owner.

### Guardrail

Differences can reflect role mix, rollout timing, geography, or work type. They are not employee-performance comparisons.

## Page 5: Habit Movement

### Purpose

Compare previous and latest adjacent stage windows and show whether people improved, remained stable, or declined.

### Stage rules

| Stage | Rule over available covered weeks |
| --- | --- |
| Cowork Power User | Active in at least 75% of weeks and at least 6 average sessions per covered week |
| Cowork Habitual User | Active in at least 75% of weeks below the Power session threshold |
| Cowork Developing User | Active in 25% through 74% of covered weeks |
| Cowork Low-user | Active in fewer than 25% of covered weeks |
| Cowork Non-user | No positive Cowork session in the window |

### Read it in this order

1. Check Improved, Stable, Declined, and sustained retention.
2. Read the stage-share table from previous to latest.
3. Inspect the stacked stage trend.
4. Switch to department view to locate where movement differs.
5. Read the methodology note before interpreting small percentage-point changes.

### Guardrail

A gain is not inherently positive for every stage. Movement is descriptive and can reflect new source history, organizational changes, or temporary behavior.

## Page 6: Champion Identification

### Purpose

Find potential peer-enablement partners and department coverage gaps.

### Candidate logic

The fixed candidate set is the top 10% of sustained users, ordered by:

1. Active weeks
2. Average weekly sessions
3. Person ID as a deterministic tie-breaker

The page reports candidate count, average active weeks, average weekly sessions, and department coverage.

### Action

Validate role fit, willingness, manager support, communication ability, and appropriate data use before outreach.

### Guardrail

This is an adoption signal—not expertise, influence, aptitude, performance, promotion, or compensation evidence.

## Page 7: Sessions and Credits

### Purpose

Describe Cowork usage frequency and credit consumption without turning either into a value claim.

### Read it in this order

1. Read total sessions and total credits.
2. Read sessions per active person and credits per session.
3. Switch between Overall and By department.
4. Expand a department to pseudonymous User IDs only when authorized.
5. Review policy limits in the filter drawer when diagnosing consumption.

### Guardrail

Sessions are not tasks. Credits are not productivity, quality, complexity, time saved, or business value.

## Page 8: Work Pattern Context

### Purpose

Compare descriptive collaboration and network patterns across Cowork stages and over time.

### Supported pattern groups

- **Collaboration network:** internal network size, external network size, network outside organization.
- **Beyond-hours work:** after-hours collaboration, weekend collaboration, collaboration span.

Only supplied patterns appear as selectable buttons.

### Read it in this order

1. Select one pattern.
2. Compare stage averages with the Non-user reference.
3. Read Cowork session intensity on its separate axis.
4. Check the weekly trend.
5. Switch to Enablement priorities for department-level program prompts.

### Guardrail

These differences are descriptive and non-causal. Cowork use can coexist with work-pattern differences without causing them.

## Page 9: Methods and Metric Guide

### Purpose

Define the model sources, calculations, grains, directions, caveats, and evidence classes.

### Use it before

- Quoting a metric.
- Comparing populations.
- Presenting a stage threshold.
- Describing a source as zero rather than unavailable.
- Sharing a person-level or champion result.

### Guardrail

A calculation can be numerically correct and still be unsuitable for a decision when the period, denominator, filter, evidence class, or privacy state is omitted.

---

## Methodology controls

### Available-history windows

- **Up to 4 weeks** is the default.
- **Up to 12 weeks** supports a longer habit view.
- The model uses available covered weeks up to the cap.
- Results remain provisional until the selected cap is populated.
- Stage movement requires at least two covered weeks and compares adjacent available-history windows.

### Privacy

- Aggregate person-derived results require at least 10 people.
- Small stage, movement, transition, and cohort results remain hidden.
- The report-facing User ID is pseudonymous.
- Person-level review must follow the customer's approved purpose and access controls.

### Population

The analytical population comes from the coverage-qualified Person Query. `IsCopilotLicensed` does not prove Cowork eligibility, so the report uses **observed reach**, not an entitlement-based adoption rate.

## Refresh validation

1. Confirm both Viva analyses completed successfully.
2. Confirm dates overlap and include the intended weeks.
3. Confirm the Person Query is unique at Person ID + Week.
4. Confirm Cowork policy rows aggregate to one person-week record.
5. Confirm Sessions and Credits reconcile to the source result.
6. Confirm organization fields have the expected match coverage.
7. Confirm Work Pattern buttons match supplied metrics.
8. Confirm no visual shows an error.

## Defensible decision language

| Situation | Recommended wording |
| --- | --- |
| Reach broadening | “Observed Cowork reach increased in the selected population and period.” |
| Sustained use improving | “The report calculates a larger Power or Habitual share under the selected window rules.” |
| Department difference | “The displayed group differs from the company benchmark; role and rollout context should be checked.” |
| Champion outreach | “These users meet the template’s sustained-use evidence rule; role fit and willingness still require confirmation.” |
| Consumption change | “Observed sessions or credits changed; this describes usage, not value or productivity.” |
| Work-pattern difference | “The selected stages differ descriptively on this Viva Insights pattern; no causal claim is supported.” |
| Missing metric | “This result is unavailable from the current query fields or history.” |

Do not claim causal impact, realized savings, employee performance, or a cross-tenant benchmark.
