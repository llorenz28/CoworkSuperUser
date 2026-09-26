# CoworkSuperUser interpretation guide

**Version:** 1.1.0

**Audience:** Cowork program owners, adoption leaders, Viva Insights analysts,
enablement teams, AI administrators, FinOps leads, and Power BI owners

CoworkSuperUser is a data-free Power BI template that turns Viva Insights
Person Query and Cowork consumption data into a guided decision experience.
It explains what is happening, where leaders should investigate, and what the
available data cannot prove.

> Repository examples use deterministic fabricated data for 1,200 fictional
> users across 26 weeks. They are not customer findings or benchmarks.

## Storyline

| Step | Page | Question answered |
| --- | --- | --- |
| 1 | **Start Here** | Which decision path should I follow? |
| 2 | **Is Cowork adoption growing?** | How many users move from the analyzed population to active use, activity in most weeks, and Cowork super-user behavior? |
| 3 | **Are users returning?** | Are users joining, returning, remaining active, or lapsing? |
| 4 | **Where should we focus enablement?** | Which departments need broader reach, more repeat use, or scaling support? |
| 5 | **How are users progressing?** | How is the distribution of user activity patterns changing? |
| 6 | **Which users could help scale adoption?** | Which consistently active users may be suitable peer-enablement partners? |
| 7 | **Where is adoption lagging while credits are high?** | Which departments combine lower reach with higher credit exposure, concentration, or estimated cost? |
| 8 | **How does work context differ?** | Do work patterns differ between Cowork super users and occasional users, and are those patterns changing over time? |
| 9 | **Definitions, sources, and limits** | How is every current metric calculated and interpreted? |

## Core definitions

| Term | Definition |
| --- | --- |
| Total population | Users included in the connected Person Query. This is not a Cowork eligibility or license roster. |
| Active user | User with at least one observed Cowork session in the selected context. |
| Active in most weeks | User active in at least 75% of available covered weeks. |
| Cowork super user | User active in at least 75% of available weeks and averaging at least six Cowork sessions per available week. |
| Steady user | User active in at least 75% of available weeks and averaging fewer than six sessions per week. |
| Emerging user | User active in 25% through 74% of available weeks. |
| Occasional user | User active at least once but in fewer than 25% of available weeks. |
| No observed use | No positive Cowork session in the available covered weeks. |
| Weekly return rate | Prior-week active users who were also active in the displayed week. |

The report automatically uses all reliable Cowork history available, up to 12
covered weeks. Shorter histories remain usable and are identified as
provisional where appropriate.

## Adoption funnel

The executive funnel is:

**Total population → Active users → Active in most weeks → Cowork super users**

Read the funnel with the weekly active-rate trend and weekly return rate:

- A growing active-user count indicates broader observed reach.
- A growing active-in-most-weeks count indicates repeat use.
- Cowork super users indicate consistently high observed usage, not skill,
  quality, value, or employee performance.
- A falling return rate can reveal a retention issue even while cumulative
  active-user counts are rising.

## Department adoption and consumption portfolio

The department portfolio combines adoption breadth and credit exposure:

- **X axis:** latest active-user rate
- **Y axis:** credits per active user
- **Bubble size:** total Cowork credits
- **Tooltip:** four-week adoption change, return rate, credits per session, and
  top-10%-user credit concentration

Interpret the quadrants carefully:

- **Lower reach + higher credits per active user:** governance review candidate.
- **Higher reach + lower credits per active user:** broader, less concentrated use.
- **Higher reach + higher credits per active user:** scaled and resource-intensive use.
- **Lower reach + lower credits per active user:** early or limited adoption.

The page dynamically names:

- The fastest-adopting department
- A lower-reach/higher-credit outlier, when one exists
- The department with the most concentrated credit usage
- Estimated cost using the customer-selected cost per credit

These are review signals, not proof of inefficiency.

## Customer cost input

The **Customer cost per credit** selector defaults to `0.0100` and can be
changed by the customer. It drives:

- Estimated cost in the selected report context
- Estimated department cost
- Estimated cost per active user
- Estimated cost per session

The report deliberately does not hardcode a universal Microsoft price or
currency. The customer should select the rate that reflects the applicable
contract, funding model, or planning assumption.

Estimated cost supports showback and planning. It is not realized ROI, business
value, or a billing invoice.

## Work-pattern context

This page addresses two descriptive questions:

1. Do Cowork super users and occasional users have different work-pattern
   averages?
2. Is the selected work-pattern metric changing over the latest four weeks
   versus the preceding four weeks?

For the selected metric, the page shows:

- Cowork super-user average
- Occasional-user average
- Percentage difference
- Recent four-week change
- A generated plain-language finding

A difference of less than 5% is described as not meaningful for the report's
decision use. Larger differences are highlighted, but they remain
**associations**. The report cannot establish that Cowork caused a work-pattern
change without an appropriate controlled design.

## Cowork tasks and assisted value

The native Viva Insights Consumption Dashboard Cowork deep dive displays task
counts, task categories, scheduled versus user-initiated tasks, and assisted
hours. Those fields are not included in the supported Consumption Query or
dashboard-export contract used by this automated template.

Therefore:

- Sessions must not be relabeled as tasks.
- Credits must not be relabeled as value.
- Task categories and assisted hours remain native-dashboard-only until
  Microsoft publishes a supported export contract.

## Evidence boundaries

| Evidence class | Meaning |
| --- | --- |
| Observed | Direct aggregation of a connected Viva Insights field |
| Derived | Calculation over observed fields |
| Context | Descriptive, non-causal comparison |
| Customer input | Customer-supplied assumption, such as cost per credit |
| Native dashboard only | Visible in Viva Insights but not exported to this template |
| Unavailable | Cannot be calculated from the current inputs |

## Privacy

- Aggregate user-derived results require at least 10 users.
- User IDs are pseudonymous unless an approved identifiable source is supplied.
- Super-user and peer-enablement signals are not performance ratings.
- Confirm willingness, manager support, communication fit, and approved data
  use before outreach.

## Presentation checklist

Before presenting:

1. Confirm the reporting period and available covered weeks.
2. State that total population comes from the Person Query.
3. Identify active filters and privacy suppression.
4. Distinguish sessions, credits, estimated cost, tasks, and business value.
5. Present department findings as investigation priorities.
6. Describe work-pattern results as associations, not causal effects.
7. Use **Definitions, sources, and limits** before quoting a measure externally.
