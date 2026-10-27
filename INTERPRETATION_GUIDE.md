# CoworkSuperUser interpretation guide

**Version:** 1.0.1
**Audience:** Microsoft 365 Copilot adoption leads, enablement teams, program
owners, analysts, and Power BI owners

CoworkSuperUser explains observed Cowork activity, concentration, trends, group
patterns, and modeled value. Use this guide to keep observed results separate
from calculations, assumptions, and business interpretation.

The distributed PBIX contains only generated synthetic data. Its results are
demonstrations, not customer benchmarks, targets, or expected outcomes.

## Five-minute orientation

| Step | Page | Decision supported |
| --- | --- | --- |
| 1 | **Overview** | How much activity is observed, who is active, and what is the current task and credit mix? |
| 2 | **Trends** | Are tasks, credits, and credits per task changing across complete periods? |
| 3 | **Cost Concentration** | How concentrated are tasks and credits among the highest-usage users? |
| 4 | **Group Breakdown** | Which organization, function, or usage-tier differences warrant follow-up? |
| 5 | **Value assumptions** | What scenario results from the selected time, labor, credit, and realization assumptions? |

Use **Appendix - Share Shift** to diagnose composition changes. Use **Metric
Glossary** and **Category assumptions** before presenting definitions or modeled
value.

## Source and evidence model

The current release uses the two files exported through **Consumption
Dashboard** > **Explore Cowork** > **Export data**:

| Source | Grain and role |
| --- | --- |
| `CoworkWeeklyMetrics.csv` | Person, week, task category, and task type; supplies observed tasks and credits |
| `PeopleMetaData.csv` | Person metadata; supplies organization, function, and Copilot-license context |

The report uses four evidence classes:

| Class | Meaning | Safe wording |
| --- | --- | --- |
| Observed | Direct aggregation from the exported source | "The export contains..." |
| Calculated | A deterministic calculation from observed rows | "The report calculates..." |
| Modeled | A scenario that applies selected assumptions | "Under the selected assumptions, the model estimates..." |
| Selected input | A user-controlled scenario parameter | "The selected assumption is..." |

Do not present a modeled result as an observed saving, accounting return, or
causal impact.

## Result-context block

Record this context whenever a result is shared:

| Context | What to record |
| --- | --- |
| Reporting period | Exact complete-week dates used by the report |
| Population | Tenant or selected organization, function, usage tier, or user cohort |
| Filters | Active report, page, and visual filters |
| Source | Export date, source-file coverage, and whether identifiers are anonymized or identifiable |
| Evidence class | Observed, Calculated, Modeled, or Selected input |
| Assumptions | Time, labor, credit, and realization inputs used by modeled outputs |

## Page 1: Overview

### Purpose

Establish the current population, active users, tasks, credits, credits per
task, and task-type or category mix.

### Read it in this order

1. Confirm the selected period and population.
2. Read users, tasks, and credits as separate quantities.
3. Compare user-initiated and scheduled activity.
4. Review category mix before interpreting total consumption.
5. Open **Metric Glossary** before quoting a metric.

### Guardrail

Tasks and credits describe activity and consumption. They do not measure
productivity, output quality, complexity, or employee performance.

## Page 2: Cost Concentration

### Purpose

Show how much task and credit activity is concentrated among the highest-usage
users.

### Read it in this order

1. Confirm the selected period and denominator.
2. Compare the share of tasks with the share of credits.
3. Review the distribution rather than relying on a single top-user value.
4. Use concentration as a prompt for workflow, policy, or enablement review.

### Guardrail

Concentration is not a personnel score. High usage can reflect role, workflow,
automation, rollout timing, or access differences.

## Page 3: Trends

### Purpose

Compare tasks, credits, and credits per task over complete periods.

### Read it in this order

1. Confirm the latest and prior comparison periods.
2. Read task and credit direction separately.
3. Use credits per task to distinguish volume from consumption intensity.
4. Check whether category or task-type mix changed at the same time.

### Guardrail

Latest-versus-prior measures use complete comparison periods and might not
follow every ordinary week selection. The dashboard can include a partial week
that is not present in the export.

## Page 4: Group Breakdown

### Purpose

Compare activity and intensity by organization, function, or usage tier.

### Read it in this order

1. Select one grouping dimension.
2. Check group size and metadata coverage.
3. Compare tasks, credits, and intensity without collapsing them into one rank.
4. Validate any proposed response with the local business owner.

### Guardrail

Group differences are descriptive. They can reflect work mix, access, rollout
timing, geography, or metadata coverage and do not establish causation.

## Page 5: Value assumptions

### Purpose

Show scenario outputs for modeled time, cost, gross value, net value, and value
per cost under explicit assumptions.

### Read it in this order

1. Review labor cost, credit cost, realization rate, and time assumptions.
2. Check the category assumptions used by the selected activity mix.
3. Read gross value, modeled cost, and net value separately.
4. Test a reasonable range of assumptions rather than presenting one point as
   measured fact.

### Guardrail

Time saved and value are modeled scenarios. They are not measured savings,
budget reductions, realized benefits, or accounting ROI.

## Page 6: Appendix - Share Shift

### Purpose

Identify categories or cohorts that gained or lost share between comparison
periods.

### Read it in this order

1. Confirm the two complete periods being compared.
2. Separate absolute volume change from share change.
3. Check whether a shift comes from the numerator, denominator, or both.
4. Use the result as a diagnostic prompt, not a causal explanation.

### Guardrail

A share can rise while its absolute activity falls when the total falls faster.
Always pair share movement with volume.

## Page 7: Metric Glossary

### Purpose

Define the 35 priority business metrics and identify whether each is observed,
calculated, modeled, or a selected input.

Use it before quoting a result, comparing pages, or describing a modeled output
as evidence. Internal helper measures are intentionally excluded.

## Page 8: Category assumptions

### Purpose

Review the time-saved assumption applied to each task category.

Change assumptions only with a documented, reviewed rationale. Record the
values used whenever modeled results are exported or presented.

## Data and privacy boundaries

- The week-level export provides up to six months of completed-week history and
  can be up to six days behind.
- The standard export is not customizable. Do not assume dashboard filters
  changed the downloaded population.
- Exported identifiers are anonymized by default, but an administrator can
  enable identifiable export.
- Organization comes from Entra ID or uploaded organizational data.
  `FunctionType` can be blank when the attribute is unavailable.
- The public template has no preconfigured row-level security role.
- Apply the organization's required sensitivity label, permissions, retention,
  and tested access controls before sharing a populated report.

## Refresh validation

1. Confirm both required files and exact headers are present.
2. Confirm complete-week dates match the intended export.
3. Reconcile total tasks and credits to the input files.
4. Confirm metadata joins and organization/function coverage.
5. Confirm all eight pages render without errors.
6. Review every modeled assumption before using value outputs.
7. Record export date, filters, evidence class, and assumptions with shared
   results.

## Defensible decision language

| Situation | Recommended wording |
| --- | --- |
| Activity increased | "Observed Cowork tasks increased across the compared complete periods." |
| Consumption changed | "Observed credits changed; this describes consumption, not productivity or value." |
| Group difference | "The displayed groups differ descriptively; role, rollout, and metadata context should be checked." |
| Concentrated usage | "Activity is concentrated in the displayed cohort; the underlying workflows and access should be reviewed." |
| Modeled value | "Under the selected assumptions, the model estimates this scenario result." |
| Share shift | "The category's share changed; absolute volume and denominator movement should also be reviewed." |

Do not claim causal impact, realized savings, employee performance, or a
cross-tenant benchmark from this report.