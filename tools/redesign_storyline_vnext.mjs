import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const variants = ["direct-query", "optimized-export"];
const modelName = "CoworkVivaV3.SemanticModel";
const reportName = "CoworkVivaV3.Report";

const technicalReplacements = new Map([
  ["Weekly Active People (Latest 12 Weeks)", "Weekly Active Users (Latest 12 Weeks)"],
  ["New People (Latest 12 Weeks)", "New Users (Latest 12 Weeks)"],
  ["Retained People (Latest 12 Weeks)", "Retained Users (Latest 12 Weeks)"],
  ["Resurrected People (Latest 12 Weeks)", "Returned Users (Latest 12 Weeks)"],
  ["Churned People (Negative, Latest 12 Weeks)", "Lapsed Users (Negative, Latest 12 Weeks)"],
  ["Returned People (Latest 12 Weeks)", "Returned Users (Latest 12 Weeks)"],
  ["Lapsed People (Negative, Latest 12 Weeks)", "Lapsed Users (Negative, Latest 12 Weeks)"],
  ["Churned People (Negative)", "Lapsed Users (Negative)"],
  ["Latest Weekly Active People", "Latest Weekly Active Users"],
  ["Average Weekly Active People", "Average Weekly Active Users"],
  ["Prior Week Active People", "Prior Week Active Users"],
  ["Average Active Weeks per Person", "Average Active Weeks per User"],
  ["Average Sessions per Person", "Average Sessions per User"],
  ["Sessions per Active Person", "Sessions per Active User"],
  ["Selected Metric Sustained Average", "Selected Metric Regular-Use Average"],
  ["Selected Metric Regular-Use Average", "Selected Metric Active-Most-Weeks Average"],
  ["Selected Metric Active-Most-Weeks Difference", "Selected Metric Highest-Lowest Gap"],
  ["Selected Metric Stage Difference vs Non-user", "Selected Metric Stage Difference vs No Observed Use"],
  ["Company Sustained Usage Share", "Company Regular-Use Share"],
  ["Company Regular-Use Share", "Company Active-Most-Weeks Rate"],
  ["Function Sustained Gap pp", "Function Regular-Use Gap pp"],
  ["Function Regular-Use Gap pp", "Function Active-Most-Weeks Gap pp"],
  ["Sustained Retention Rate", "Regular-Use Retention Rate"],
  ["Regular-Use Retention Rate", "Most-Weeks User Retention"],
  ["Sustained Usage Share", "Regular-Use Share"],
  ["Regular-Use Share", "Active-Most-Weeks Rate"],
  ["Sustained Users", "Regularly Active Users"],
  ["Regularly Active Users", "Users Active Most Weeks"],
  ["Champion Cohort People", "Champion Cohort Users"],
  ["Weekly Segment People", "Weekly Segment Users"],
  ["Transition People", "Transition Users"],
  ["Movement People", "Movement Users"],
  ["Improved People", "Improved Users"],
  ["Stable People", "Stable Users"],
  ["Declined People", "Declined Users"],
  ["Segment People", "Segment Users"],
  ["Weekly Active People", "Weekly Active Users"],
  ["New People", "New Users"],
  ["Retained People", "Retained Users"],
  ["Resurrected People", "Returned Users"],
  ["Churned People", "Lapsed Users"],
  ["Returned People", "Returned Users"],
  ["Lapsed People", "Lapsed Users"],
  ["Power User Session Threshold", "Super User Session Threshold"],
  ["Power Session Threshold", "Super User Session Threshold"],
  ["Power User Share", "Cowork Super User Share"],
  ["Habitual User Share", "Regular User Share"],
  ["Regular User Share", "Steady User Share"],
  ["Developing User Share", "Emerging User Share"],
  ["Low User Share", "Occasional User Share"],
  ["Non-user Share", "No Observed Use Share"],
  ["Power Users", "Cowork Super Users"],
  ["Habitual Users", "Regular Users"],
  ["Regular Users", "Steady Users"],
  ["Developing Users", "Emerging Users"],
  ["Low Users", "Occasional Users"],
  ["Non-users", "Users with No Observed Use"],
  ["Cowork Power User", "Cowork super user"],
  ["Cowork Habitual User", "Regular user"],
  ["Regular user", "Steady user"],
  ["Cowork Developing User", "Emerging user"],
  ["Cowork Low User", "Occasional user"],
  ["Cowork Non-user", "No observed use"],
  ["Cowork coverage unknown", "Coverage unavailable"],
  ["Regular users", "Users active most weeks"],
  ["Developing cohort", "Emerging cohort"],
  ["Coverage unknown", "Coverage unavailable"],
]);

const modelCopyReplacements = new Map([
  ["Activate observed use", "Expand reach"],
  ["Build repeat habit", "Increase repeat use"],
  ["Build regular use", "Increase repeat use"],
  ["Scale champion practice", "Scale successful practices"],
  ["sustained-use", "regular-use"],
  ["Sustained-use", "Regular-use"],
  ["sustained use", "regular use"],
  ["Sustained use", "Regular use"],
  ["Sustained-user retention", "Regular-use retention"],
  ["sustained-user retention", "regular-use retention"],
  ["the privacy-safe Power User cohort", "the privacy-safe Cowork super-user cohort"],
  ["Cowork Power or Habitual users", "regularly active users"],
  ["Cowork Power and Habitual cohort", "regularly active user cohort"],
  ["Cowork Habitual and Cowork super users", "regular and Cowork super users"],
  ["No observed use, Low, and emerging users", "no-observed-use, occasional, and emerging users"],
  ["People in the latest", "Users in the latest"],
  ["Cowork Power or Habitual", "Cowork super or regular"],
  ["Power or Habitual", "super or regular"],
  ["Power and Habitual", "super and regular"],
  ["Person-derived", "User-derived"],
  ["10-person", "10-user"],
  ["Grain: Person-window", "Grain: User-window"],
  ["Grain: Person.", "Grain: User."],
  ["CHAMPION CANDIDATE EVIDENCE", "PEER-ENABLEMENT EVIDENCE"],
  ["Cowork Power User cohort", "Cowork super-user cohort"],
  ["Cowork Habitual User cohort", "Regular-user cohort"],
  ["Habit Movement begins", "User progression begins"],
  [" people show observed Cowork activity", " users show observed Cowork activity"],
  [" people improved stage", " users moved to a higher-use pattern"],
  [" people remained stable", " users remained in the same pattern"],
  [" people declined", " users moved to a lower-use pattern"],
  [" people (", " users ("],
  ["fewer than 10 people", "fewer than 10 users"],
  ["regular-use share", "share active in most weeks"],
  ["Regular-use share", "Share active in most weeks"],
  ["regular use", "active in most weeks"],
  ["Regular use", "Active in most weeks"],
  ["regularly active users", "users active most weeks"],
  ["regularly active user cohort", "users active most weeks"],
  ["Regular-user retention", "Most-weeks retention"],
  ["regular-user retention", "most-weeks retention"],
  ["regular and Cowork super users", "steady and Cowork super users"],
  ["Regular-user cohort", "Steady-user cohort"],
  ["Cowork Power and active in most weeksrs", "Cowork super and steady users"],
  ["previously regular Cowork users still regular", "users active in most weeks who remain active in most weeks"],
  ["Share of users", "Percentage of users"],
  ["active in most weeksrs", "users active in most weeks"],
  ["remain sustained", "remain active in most weeks"],
  ["Cowork super or regular stage", "Cowork super or steady stage"],
]);

const technicalPairs = [...technicalReplacements.entries()].sort(
  ([left], [right]) => right.length - left.length
);

function walkFiles(directory, extensions) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, extensions));
    } else if (extensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function applyTechnicalReplacements(value) {
  let result = value;
  for (const [before, after] of technicalPairs) {
    result = result.split(before).join(after);
  }
  return result;
}

function humanize(value) {
  return applyTechnicalReplacements(value)
    .replace(/\bPower \+ Habitual\b/gi, "Cowork super users + steady users")
    .replace(/\bPower (?:or|and) Habitual\b/gi, "Cowork super users and steady users")
    .replace(/\bPower:/g, "Cowork super user:")
    .replace(/\bHabitual:/g, "Steady user:")
    .replace(/\bDeveloping:/g, "Emerging user:")
    .replace(/\bLow:/g, "Occasional user:")
    .replace(/\bactive-most-weeks rate\b/gi, "Active in most weeks")
    .replace(/\bactive-most-weeks\b/gi, "Active in most weeks")
    .replace(/\bmost-weeks user retention\b/gi, "Continued active most weeks")
    .replace(/\bno observed use share\b/gi, "percentage with no observed use")
    .replace(/\bshare of users\b/gi, "percentage of users")
    .replace(/\bregular-use share\b/gi, "active in most weeks")
    .replace(/\bregular-use\b/gi, "active most weeks")
    .replace(/\bregular use\b/gi, "active in most weeks")
    .replace(/\bregularly active users\b/gi, "users active most weeks")
    .replace(/\bregular users\b/gi, "steady users")
    .replace(/\bregular user\b/gi, "steady user")
    .replace(/\bsustained-use\b/gi, "active in most weeks")
    .replace(/\bsustained use\b/gi, "active in most weeks")
    .replace(/\bsustained users\b/gi, "users active most weeks")
    .replace(/\bsustained\b/gi, "consistent")
    .replace(/\bpower users\b/gi, "Cowork super users")
    .replace(/\bpower user\b/gi, "Cowork super user")
    .replace(/\bhabitual users\b/gi, "steady users")
    .replace(/\bhabitual user\b/gi, "steady user")
    .replace(/\bdeveloping users\b/gi, "emerging users")
    .replace(/\bdeveloping user\b/gi, "emerging user")
    .replace(/\blow users\b/gi, "occasional users")
    .replace(/\blow user\b/gi, "occasional user")
    .replace(/\bnon-users\b/gi, "users with no observed use")
    .replace(/\bnon-user\b/gi, "no observed use")
    .replace(/\bchurned\b/gi, "lapsed")
    .replace(/\bresurrected\b/gi, "returned")
    .replace(/\bpeople\b/gi, "users")
    .replace(/\bperson\b/gi, "user");
}

function replaceUiStrings(node, key = "") {
  if (Array.isArray(node)) {
    for (let index = 0; index < node.length; index += 1) {
      node[index] = replaceUiStrings(node[index], key);
    }
    return node;
  }
  if (node && typeof node === "object") {
    for (const [childKey, childValue] of Object.entries(node)) {
      node[childKey] = replaceUiStrings(childValue, childKey);
    }
    return node;
  }
  if (
    typeof node === "string" &&
    ["value", "Value", "displayName", "nativeQueryRef"].includes(key)
  ) {
    return humanize(node);
  }
  return node;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function visualPath(reportRoot, pageId, visualId) {
  return path.join(
    reportRoot,
    "definition",
    "pages",
    pageId,
    "visuals",
    visualId,
    "visual.json"
  );
}

function editVisual(reportRoot, pageId, visualId, callback) {
  const filePath = visualPath(reportRoot, pageId, visualId);
  const visual = readJson(filePath);
  callback(visual);
  writeJson(filePath, visual);
}

function setHidden(reportRoot, pageId, visualId, hidden) {
  editVisual(reportRoot, pageId, visualId, (visual) => {
    visual.isHidden = hidden;
  });
}

function setPosition(reportRoot, pageId, visualId, position) {
  editVisual(reportRoot, pageId, visualId, (visual) => {
    Object.assign(visual.position, position);
  });
}

function setTextboxText(reportRoot, pageId, visualId, text) {
  editVisual(reportRoot, pageId, visualId, (visual) => {
    const general = visual.visual?.objects?.general?.[0]?.properties;
    if (!general?.paragraphs) {
      throw new Error(`Textbox paragraphs not found: ${pageId}/${visualId}`);
    }
    const firstRun = general.paragraphs
      .flatMap((paragraph) => paragraph.textRuns ?? [])
      .find(Boolean);
    const textStyle = firstRun?.textStyle ? { ...firstRun.textStyle } : undefined;
    general.paragraphs = text.split("\n").map((line) => ({
      textRuns: [
        {
          value: line,
          ...(textStyle ? { textStyle } : {}),
        },
      ],
    }));
  });
}

function cloneVisual(reportRoot, pageId, sourceVisualId, targetVisualId, position) {
  const targetPath = visualPath(reportRoot, pageId, targetVisualId);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  const visual = readJson(visualPath(reportRoot, pageId, sourceVisualId));
  visual.name = targetVisualId;
  visual.position = { ...visual.position, ...position };
  writeJson(targetPath, visual);
}

function cloneTextbox(reportRoot, pageId, sourceVisualId, targetVisualId, position, text) {
  cloneVisual(reportRoot, pageId, sourceVisualId, targetVisualId, position);
  setTextboxText(reportRoot, pageId, targetVisualId, text);
}

function setCardMeasureBinding(
  reportRoot,
  pageId,
  visualId,
  entity,
  property,
  label
) {
  editVisual(reportRoot, pageId, visualId, (visual) => {
    const projection = visual.visual?.query?.queryState?.Data?.projections?.[0];
    if (!projection?.field?.Measure) {
      throw new Error(`Card measure projection not found: ${pageId}/${visualId}`);
    }
    projection.field.Measure.Expression.SourceRef.Entity = entity;
    projection.field.Measure.Property = property;
    projection.queryRef = `${entity}.${property}`;
    projection.nativeQueryRef = label;
    projection.displayName = label;
    delete visual.visual.query.sortDefinition;
    const labelObject = visual.visual?.objects?.label?.[0]?.properties?.text;
    if (labelObject?.expr?.Literal) {
      labelObject.expr.Literal.Value = `'${label}'`;
    }
    const valueObject = visual.visual?.objects?.value?.[0]?.properties;
    if (valueObject) {
      valueObject.labelDisplayUnits = {
        expr: { Literal: { Value: "1D" } },
      };
    }
  });
}

function setChartMeasureBinding(
  reportRoot,
  pageId,
  visualId,
  role,
  entity,
  property,
  label,
  title
) {
  editVisual(reportRoot, pageId, visualId, (visual) => {
    const projection =
      visual.visual?.query?.queryState?.[role]?.projections?.[0];
    if (!projection?.field?.Measure) {
      throw new Error(`Chart measure projection not found: ${pageId}/${visualId}/${role}`);
    }
    projection.field.Measure.Expression.SourceRef.Entity = entity;
    projection.field.Measure.Property = property;
    projection.queryRef = `${entity}.${property}`;
    projection.nativeQueryRef = label;
    projection.displayName = label;
    visual.visual.query.sortDefinition = {
      sort: [
        {
          field: {
            Measure: {
              Expression: {
                SourceRef: {
                  Entity: entity,
                },
              },
              Property: property,
            },
          },
          direction: "Descending",
        },
      ],
      isDefaultSort: true,
    };
    const titleValue =
      visual.visual?.visualContainerObjects?.title?.[0]?.properties?.text?.expr
        ?.Literal;
    if (titleValue) {
      titleValue.Value = `'${title}'`;
    }
  });
}

function measureProjection(entity, property, label) {
  return {
    field: {
      Measure: {
        Expression: {
          SourceRef: {
            Entity: entity,
          },
        },
        Property: property,
      },
    },
    queryRef: `${entity}.${property}`,
    nativeQueryRef: label,
    displayName: label,
  };
}

function configureDepartmentPortfolioScatter(reportRoot) {
  editVisual(reportRoot, "92_activity_value", "av_bar_workload", (visual) => {
    visual.isHidden = false;
    visual.position = {
      ...visual.position,
      x: 16,
      y: 232,
      width: 608,
      height: 384,
      tabOrder: 1700,
    };
    visual.visual.visualType = "scatterChart";
    visual.visual.query = {
      queryState: {
        Category: {
          projections: [
            {
              field: {
                Column: {
                  Expression: {
                    SourceRef: {
                      Entity: "Organization",
                    },
                  },
                  Property: "Function",
                },
              },
              queryRef: "Organization.Function",
              nativeQueryRef: "Department",
              displayName: "Department",
              active: true,
            },
          ],
        },
        X: {
          projections: [
            measureProjection(
              "Consumption Weekly",
              "Latest Weekly Active Rate",
              "Latest active-user rate"
            ),
          ],
        },
        Y: {
          projections: [
            measureProjection(
              "Consumption Weekly",
              "Credits per Active User",
              "Credits per active user"
            ),
          ],
        },
        Size: {
          projections: [
            measureProjection(
              "Consumption Weekly",
              "Total Cowork Credits",
              "Total credits"
            ),
          ],
        },
        Tooltips: {
          projections: [
            measureProjection(
              "Consumption Weekly",
              "Active Rate Momentum pp",
              "4-week adoption change"
            ),
            measureProjection(
              "Consumption Weekly",
              "Weekly Return Rate",
              "Weekly return rate"
            ),
            measureProjection(
              "Consumption Weekly",
              "Credits per Session",
              "Credits per session"
            ),
            measureProjection(
              "Consumption Weekly",
              "Top 10 Percent User Credit Share",
              "Credits from top 10% of users"
            ),
          ],
        },
      },
    };
    visual.visual.objects = {
      bubbles: [
        {
          properties: {
            preventOverflow: { expr: { Literal: { Value: "true" } } },
          },
        },
      ],
      dataPoint: [
        {
          properties: {
            defaultColor: {
              solid: {
                color: { expr: { Literal: { Value: "'#4B2D83'" } } },
              },
            },
          },
        },
      ],
      categoryLabels: [
        {
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            fontSize: { expr: { Literal: { Value: "9D" } } },
            color: {
              solid: {
                color: { expr: { Literal: { Value: "'#1B1F27'" } } },
              },
            },
          },
        },
      ],
      legend: [
        {
          properties: {
            show: { expr: { Literal: { Value: "false" } } },
          },
        },
      ],
      categoryAxis: [
        {
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            labelColor: {
              solid: {
                color: { expr: { Literal: { Value: "'#5A6472'" } } },
              },
            },
            gridlineColor: {
              solid: {
                color: { expr: { Literal: { Value: "'#D8DEE9'" } } },
              },
            },
            showAxisTitle: { expr: { Literal: { Value: "true" } } },
          },
        },
      ],
      valueAxis: [
        {
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            labelColor: {
              solid: {
                color: { expr: { Literal: { Value: "'#5A6472'" } } },
              },
            },
            gridlineColor: {
              solid: {
                color: { expr: { Literal: { Value: "'#D8DEE9'" } } },
              },
            },
            showAxisTitle: { expr: { Literal: { Value: "true" } } },
          },
        },
      ],
    };
    visual.visual.visualContainerObjects =
      visual.visual.visualContainerObjects ?? {};
    visual.visual.visualContainerObjects.title = [
      {
        properties: {
          show: { expr: { Literal: { Value: "true" } } },
          text: {
            expr: {
              Literal: {
                Value: "'Adoption breadth versus credit exposure'",
              },
            },
          },
          fontFamily: { expr: { Literal: { Value: "'Segoe UI Semibold'" } } },
          fontSize: { expr: { Literal: { Value: "11D" } } },
        },
      },
    ];
    visual.visual.visualContainerObjects.general = [
      {
        properties: {
          altText: {
            expr: {
              Literal: {
                Value:
                  "'Department portfolio plotting latest active-user rate against credits per active user. Bubble size represents total Cowork credits.'",
              },
            },
          },
        },
      },
    ];
  });
}

function configureDepartmentPortfolioMatrix(reportRoot) {
  editVisual(reportRoot, "92_activity_value", "av_department_matrix", (visual) => {
    visual.position = {
      ...visual.position,
      x: 640,
      y: 232,
      width: 624,
      height: 384,
      tabOrder: 1800,
    };
    visual.visual.query.queryState.Values.projections = [
      measureProjection(
        "Consumption Weekly",
        "Latest Weekly Active Rate",
        "Active rate"
      ),
      measureProjection(
        "Consumption Weekly",
        "Active Rate Momentum pp",
        "4-week change"
      ),
      measureProjection(
        "Consumption Weekly",
        "Total Cowork Credits",
        "Total credits"
      ),
      measureProjection(
        "Consumption Weekly",
        "Credits per Active User",
        "Credits per active user"
      ),
      measureProjection(
        "Cost per Credit",
        "Estimated Cost",
        "Estimated cost"
      ),
      measureProjection(
        "Consumption Weekly",
        "Top 10 Percent User Credit Share",
        "Top 10% credit share"
      ),
    ];
    visual.visual.objects.columnWidth = [
      ["Organization.Function", 140],
      ["Consumption Weekly.Latest Weekly Active Rate", 70],
      ["Consumption Weekly.Active Rate Momentum pp", 70],
      ["Consumption Weekly.Total Cowork Credits", 80],
      ["Consumption Weekly.Credits per Active User", 90],
      ["Cost per Credit.Estimated Cost", 90],
      ["Consumption Weekly.Top 10 Percent User Credit Share", 80],
    ].map(([metadata, width]) => ({
      properties: {
        value: { expr: { Literal: { Value: `${width}D` } } },
      },
      selector: { metadata },
    }));
    visual.visual.query.sortDefinition = {
      sort: [
        {
          field: {
            Measure: {
              Expression: {
                SourceRef: {
                  Entity: "Consumption Weekly",
                },
              },
              Property: "Total Cowork Credits",
            },
          },
          direction: "Descending",
        },
      ],
      isDefaultSort: true,
    };
    const titleValue =
      visual.visual.visualContainerObjects?.title?.[0]?.properties?.text?.expr
        ?.Literal;
    if (titleValue) {
      titleValue.Value = "'Department adoption and consumption detail'";
    }
  });
}

function configureCostRateSlicer(reportRoot) {
  const page = "92_activity_value";
  cloneVisual(
    reportRoot,
    page,
    "adoption_window_selector",
    "cost_per_credit_input",
    {
      x: 1016,
      y: 96,
      width: 248,
      height: 48,
      z: 910000,
      tabOrder: 700,
    }
  );
  editVisual(reportRoot, page, "cost_per_credit_input", (visual) => {
    visual.isHidden = false;
    visual.visual.query = {
      queryState: {
        Values: {
          projections: [
            {
              field: {
                Column: {
                  Expression: {
                    SourceRef: {
                      Entity: "Cost per Credit",
                    },
                  },
                  Property: "Cost per Credit",
                },
              },
              queryRef: "Cost per Credit.Cost per Credit",
              nativeQueryRef: "Cost per credit",
              displayName: "Cost per credit",
              active: true,
            },
          ],
        },
      },
    };
    delete visual.visual.syncGroup;
    visual.visual.objects.general = [
      {
        properties: {
          filter: {
            filter: {
              Version: 2,
              From: [
                {
                  Name: "c",
                  Entity: "Cost per Credit",
                  Type: 0,
                },
              ],
              Where: [
                {
                  Condition: {
                    In: {
                      Expressions: [
                        {
                          Column: {
                            Expression: {
                              SourceRef: {
                                Source: "c",
                              },
                            },
                            Property: "Cost per Credit",
                          },
                        },
                      ],
                      Values: [
                        [
                          {
                            Literal: {
                              Value: "0.01D",
                            },
                          },
                        ],
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ];
    const title =
      visual.visual.visualContainerObjects?.title?.[0]?.properties?.text?.expr
        ?.Literal;
    if (title) {
      title.Value = "'Customer cost per credit'";
    }
    const altText =
      visual.visual.visualContainerObjects?.general?.[0]?.properties?.altText?.expr
        ?.Literal;
    if (altText) {
      altText.Value =
        "'Customer-selected cost per credit used only for estimated cost and department showback. Default is 0.010 in the customer's currency.'";
    }
  });
}

function configureAdoptionFunnel(reportRoot) {
  editVisual(
    reportRoot,
    "06_adoption_over_time",
    "1b4c7bb1f2323047a6fb",
    (visual) => {
      visual.visual.visualType = "funnel";
      visual.visual.query = {
        queryState: {
          Category: {
            projections: [
              {
                field: {
                  Column: {
                    Expression: {
                      SourceRef: {
                        Entity: "Adoption Funnel",
                      },
                    },
                    Property: "Stage",
                  },
                },
                queryRef: "Adoption Funnel.Stage",
                nativeQueryRef: "Adoption journey",
                displayName: "Adoption journey",
                active: true,
              },
            ],
          },
          Y: {
            projections: [
              {
                field: {
                  Measure: {
                    Expression: {
                      SourceRef: {
                        Entity: "Adoption Funnel",
                      },
                    },
                    Property: "Funnel Users",
                  },
                },
                queryRef: "Adoption Funnel.Funnel Users",
                nativeQueryRef: "Users",
                displayName: "Users",
              },
            ],
          },
        },
      };
      visual.visual.objects = {
        categoryAxis: [
          {
            properties: {
              show: { expr: { Literal: { Value: "true" } } },
              fontFamily: { expr: { Literal: { Value: "'Segoe UI'" } } },
              fontSize: { expr: { Literal: { Value: "9D" } } },
              color: {
                solid: {
                  color: { expr: { Literal: { Value: "'#1B1F27'" } } },
                },
              },
            },
          },
        ],
        dataPoint: [
          {
            properties: {
              defaultColor: {
                solid: {
                  color: { expr: { Literal: { Value: "'#4B2D83'" } } },
                },
              },
            },
          },
        ],
        labels: [
          {
            properties: {
              show: { expr: { Literal: { Value: "true" } } },
              labelPosition: { expr: { Literal: { Value: "'Auto'" } } },
              labelDisplayUnits: { expr: { Literal: { Value: "1D" } } },
              labelPrecision: { expr: { Literal: { Value: "0L" } } },
              percentageLabelPrecision: {
                expr: { Literal: { Value: "0L" } },
              },
              funnelLabelStyle: {
                expr: { Literal: { Value: "'Data, percent of first'" } },
              },
              fontFamily: { expr: { Literal: { Value: "'Segoe UI'" } } },
              fontSize: { expr: { Literal: { Value: "9D" } } },
              bold: { expr: { Literal: { Value: "true" } } },
              color: {
                solid: {
                  color: { expr: { Literal: { Value: "'#FFFFFF'" } } },
                },
              },
            },
          },
        ],
        percentBarLabel: [
          {
            properties: {
              show: { expr: { Literal: { Value: "false" } } },
            },
          },
        ],
      };
      visual.visual.visualContainerObjects =
        visual.visual.visualContainerObjects ?? {};
      visual.visual.visualContainerObjects.title = [
        {
          properties: {
            show: { expr: { Literal: { Value: "true" } } },
            text: {
              expr: {
                Literal: {
                  Value: "'From total population to Cowork super users'",
                },
              },
            },
            fontFamily: { expr: { Literal: { Value: "'Segoe UI Semibold'" } } },
            fontSize: { expr: { Literal: { Value: "11D" } } },
          },
        },
      ];
      visual.visual.visualContainerObjects.general = [
        {
          properties: {
            altText: {
              expr: {
                Literal: {
                  Value:
                    "'Adoption funnel from total population to active users, users active in most weeks, and Cowork super users.'",
                },
              },
            },
          },
        },
      ];
    }
  );
}

function replaceVisualStrings(reportRoot, pageId, visualId, replacements) {
  editVisual(reportRoot, pageId, visualId, (visual) => {
    function visit(node) {
      if (Array.isArray(node)) {
        node.forEach(visit);
        return;
      }
      if (!node || typeof node !== "object") {
        return;
      }
      for (const [key, value] of Object.entries(node)) {
        if (typeof value === "string") {
          let updated = value;
          for (const [before, after] of Object.entries(replacements)) {
            updated = updated.split(before).join(after);
          }
          node[key] = updated;
        } else {
          visit(value);
        }
      }
    }
    visit(visual);
  });
}

function renamePage(reportRoot, pageId, displayName) {
  const filePath = path.join(
    reportRoot,
    "definition",
    "pages",
    pageId,
    "page.json"
  );
  const page = readJson(filePath);
  page.displayName = displayName;
  page.objects = page.objects ?? {};
  page.objects.background = [
    {
      properties: {
        color: {
          solid: {
            color: {
              expr: {
                Literal: {
                  Value: "'#F6F7FB'",
                },
              },
            },
          },
        },
        transparency: {
          expr: {
            Literal: {
              Value: "0D",
            },
          },
        },
      },
    },
  ];
  writeJson(filePath, page);
}

function hideVisualType(reportRoot, pageId, visualType) {
  const visualRoot = path.join(
    reportRoot,
    "definition",
    "pages",
    pageId,
    "visuals"
  );
  for (const directory of fs.readdirSync(visualRoot)) {
    const filePath = path.join(visualRoot, directory, "visual.json");
    if (!fs.existsSync(filePath)) {
      continue;
    }
    const visual = readJson(filePath);
    if (visual.visual?.visualType === visualType) {
      visual.isHidden = true;
      writeJson(filePath, visual);
    }
  }
}

function updateTheme(reportRoot) {
  const themePath = path.join(
    reportRoot,
    "StaticResources",
    "RegisteredResources",
    "M365CoworkProfessional-20260906.json"
  );
  const theme = readJson(themePath);
  theme.background = "#F6F7FB";
  theme.secondaryBackground = "#FFFFFF";
  theme.firstLevelElements = "#1B1F27";
  theme.secondLevelElements = "#5A6472";
  theme.dataColors = [
    "#4B2D83",
    "#003087",
    "#167A7A",
    "#D67213",
    "#2EA44F",
    "#B02A2A",
    "#5A6472",
    "#0099BC",
  ];
  writeJson(themePath, theme);
}

function updateStartHere(reportRoot) {
  const page = "00_start_here";
  setTextboxText(
    reportRoot,
    page,
    "sh_title",
    "Use this report to decide where to focus Cowork"
  );
  setTextboxText(
    reportRoot,
    page,
    "sh_subtitle",
    "Same report in both editions: Optimized Export (recommended) or Direct Query (advanced)."
  );

  const cards = [
    {
      title: "sh_card1_title",
      description: "sh_card1_desc",
      button: "sh_card1_btn",
      heading: "Is Cowork adoption growing?",
      copy: "See active users, active-user rate, users active in most weeks, trend, and the organizations driving the result.",
      buttonText: "View executive summary ->",
    },
    {
      title: "sh_card2_title",
      description: "sh_card2_desc",
      button: "sh_card2_btn",
      heading: "Are users coming back?",
      copy: "Track new, retained, returned, and lapsed users alongside weekly return rate and session intensity.",
      buttonText: "View user journey ->",
    },
    {
      title: "sh_card3_title",
      description: "sh_card3_desc",
      button: "sh_card3_btn",
      heading: "How are users progressing?",
      copy: "See movement across clearly defined usage patterns, from no observed use to Cowork super user.",
      buttonText: "View user progress ->",
    },
    {
      title: "sh_card4_title",
      description: "sh_card4_desc",
      button: "sh_card4_btn",
      heading: "How does work context differ?",
      copy: "Compare collaboration and network context by usage pattern. Results are descriptive, not causal.",
      buttonText: "View work context ->",
    },
    {
      title: "sh_card5_title",
      description: "sh_card5_desc",
      button: "sh_card5_btn",
      heading: "Which departments need attention?",
      copy: "Find fast adopters, concentrated credit use, and departments with lower reach but higher credit exposure.",
      buttonText: "View department portfolio ->",
    },
    {
      title: "sh_card6_title",
      description: "sh_card6_desc",
      button: "sh_card6_btn",
      heading: "Where should we focus enablement?",
      copy: "Compare reach and users active in most weeks by organization, then follow the recommended action.",
      buttonText: "View enablement focus ->",
    },
  ];

  for (const card of cards) {
    setTextboxText(reportRoot, page, card.title, card.heading);
    setTextboxText(reportRoot, page, card.description, card.copy);
    replaceVisualStrings(reportRoot, page, card.button, {
      "View executive adoption ->": card.buttonText,
      "View weekly momentum ->": card.buttonText,
      "View habit movement ->": card.buttonText,
      "View work-pattern context ->": card.buttonText,
      "View sessions and credits ->": card.buttonText,
      "View adoption attributes ->": card.buttonText,
    });
  }

  replaceVisualStrings(reportRoot, page, "00fea4424f6424f68f89", {
    "View champion identification ->": "View users who can help ->",
    "Open Champion Identification.": "Open users who can help scale adoption.",
  });
  replaceVisualStrings(reportRoot, page, "sh_glossary_btn", {
    "Methods guide ->": "Definitions and limits ->",
    "Open the Methods and Metric Guide.": "Open definitions, sources, and limits.",
  });
  setHidden(reportRoot, page, "5c93d44975ef46f5a3f1", true);
  cloneTextbox(
    reportRoot,
    page,
    "sh_subtitle",
    "sh_task_availability_note",
    {
      x: 63,
      y: 696,
      width: 1064,
      height: 56,
      z: 321000,
      tabOrder: 3100,
    },
    "TASK DATA BOUNDARY | Task categories, scheduled-task share, and assisted hours are available in the Viva Insights Cowork deep dive, but are not exported to this automated template. Sessions are not tasks."
  );
}

function updateExecutive(reportRoot) {
  const page = "06_adoption_over_time";
  renamePage(reportRoot, page, "Is Cowork adoption growing?");
  setTextboxText(
    reportRoot,
    page,
    "dce6b71b3a9ac25423ca",
    "Is Cowork adoption growing?"
  );
  setTextboxText(
    reportRoot,
    page,
    "36bf419d5ba54da0971c",
    "Follow the full journey from total population to active users, repeat use, and Cowork super users."
  );
  setHidden(reportRoot, page, "panel_open_06adoption", true);
  replaceVisualStrings(reportRoot, page, "38112c6a1074a402bdd5", {
    "Population": "Users included",
  });
  setCardMeasureBinding(
    reportRoot,
    page,
    "38112c6a1074a402bdd5",
    "Organization",
    "Population",
    "Total population"
  );
  setCardMeasureBinding(
    reportRoot,
    page,
    "2ec55b9fc2690c3f2215",
    "Consumption Weekly",
    "Observed Cowork Active Users",
    "Active users"
  );
  setCardMeasureBinding(
    reportRoot,
    page,
    "a9a7b6378c051d1ab640",
    "Usage Segment Snapshot",
    "Users Active Most Weeks",
    "Active in most weeks"
  );
  setCardMeasureBinding(
    reportRoot,
    page,
    "81ce810efe5284af16e9",
    "Consumption Weekly",
    "Weekly Return Rate",
    "Weekly return rate"
  );
  replaceVisualStrings(reportRoot, page, "0753d9b45c6de03c7b37", {
    "Observed Cowork active users by department":
      "Where active Cowork use is concentrated",
  });
  configureAdoptionFunnel(reportRoot);
  replaceVisualStrings(reportRoot, page, "a9a7b6378c051d1ab640", {
    "regular-use share": "Regular-use share",
  });
}

function updateWeeklyJourney(reportRoot) {
  const page = "c2e315038d903964e507";
  renamePage(reportRoot, page, "Are users returning?");
  setTextboxText(
    reportRoot,
    page,
    "eec514d7908e94e59f05",
    "Are users coming back after first use?"
  );
  hideVisualType(reportRoot, page, "actionButton");
  for (const id of [
    "2318db9ca9cd739a4ca7",
    "590a06170668158798a5",
    "ed05a1bdce257261daef",
    "weekly_function_detail_note",
  ]) {
    setHidden(reportRoot, page, id, true);
  }
  setHidden(reportRoot, page, "weekly_users_chart", false);
  setHidden(reportRoot, page, "weekly_users_note", false);
  setPosition(reportRoot, page, "weekly_users_chart", {
    x: 59,
    y: 232,
    width: 1248,
    height: 352,
    tabOrder: 2000,
  });
  setPosition(reportRoot, page, "weekly_users_note", {
    x: 59,
    y: 592,
    width: 1248,
    height: 88,
    tabOrder: 3000,
  });
  const cards = [
    "53400c30ef013f69fe9a",
    "37af942da5224c407ef6",
    "a941337199e3de6924ef",
    "6e0b5757f4b2db57dffd",
  ];
  [59, 371, 683, 995].forEach((x, index) => {
    setPosition(reportRoot, page, cards[index], {
      x,
      y: 128,
      width: 296,
      height: 88,
      tabOrder: 1000 + index * 100,
    });
  });
  setTextboxText(
    reportRoot,
    page,
    "weekly_users_note",
    "WHAT THIS MEANS | New users expand reach; retained and returned users show repeat use; lapsed users need follow-up.\nNEXT STEP | Prioritize organizations with falling return rates or rising lapsed-user counts."
  );
  replaceVisualStrings(reportRoot, page, "weekly_users_chart", {
    "Weekly user movement": "Who joined, returned, stayed, or lapsed?",
    "Churned": "Lapsed",
    "Resurrected": "Returned",
  });
}

function updateEnablement(reportRoot) {
  const page = "102_adoption_attributes";
  renamePage(reportRoot, page, "Where should we focus enablement?");
  setTextboxText(
    reportRoot,
    page,
    "title_header_102attributes",
    "Where should we focus enablement?"
  );
  hideVisualType(reportRoot, page, "actionButton");
  for (const id of [
    "attribute_view_selector_panel",
    "attribute_view_selector_title",
    "attribute_weekly_rate_company_trend",
    "attribute_weekly_rate_selection_trend",
    "attribute_weekly_rate_kpi_change",
    "attribute_weekly_rate_kpi_people",
    "attribute_weekly_rate_kpi_rate",
    "attribute_weekly_rate_kpi_return",
    "attribute_weekly_rate_title",
    "attribute_weekly_rate_guide",
    "usage_tier_by_dept",
  ]) {
    setHidden(reportRoot, page, id, true);
  }
  const focusCards = [
    "attribute_focus_total_users",
    "attribute_focus_company_reach",
    "attribute_focus_company_repeat",
    "attribute_focus_power_users",
  ];
  for (const id of [
    ...focusCards,
    "delegation_tier_by_dept",
    "attribute_action_focus_guide",
  ]) {
    setHidden(reportRoot, page, id, false);
  }
  [59, 371, 683, 995].forEach((x, index) => {
    setPosition(reportRoot, page, focusCards[index], {
      x,
      y: 152,
      width: 296,
      height: 84,
      tabOrder: 1000 + index * 100,
    });
  });
  setPosition(reportRoot, page, "org_data_gate", {
    x: 59,
    y: 104,
    width: 1248,
    height: 32,
    tabOrder: 800,
  });
  setPosition(reportRoot, page, "delegation_tier_by_dept", {
    x: 59,
    y: 248,
    width: 760,
    height: 424,
    tabOrder: 2000,
  });
  setPosition(reportRoot, page, "attribute_action_focus_guide", {
    x: 835,
    y: 248,
    width: 472,
    height: 424,
    tabOrder: 2100,
  });
  setTextboxText(
    reportRoot,
    page,
    "attribute_action_focus_guide",
    "HOW TO ACT\nExpand reach\nActive-user share is below the company benchmark. Validate access, awareness, and first-use support.\n\nIncrease repeat use\nReach meets the benchmark, but fewer users are active in most weeks. Reinforce repeatable Cowork workflows.\n\nScale successful practices\nBoth measures meet or exceed the benchmark. Use willing Cowork super users for peer learning.\n\nInvestigate decline\nReview organizations with weakening active-user or return trends before expanding."
  );
  replaceVisualStrings(reportRoot, page, "delegation_tier_by_dept", {
    "Recommended focus": "Recommended action",
    "Repeat habit": "Active in most weeks",
    "Power users": "Cowork super users",
  });
  replaceVisualStrings(reportRoot, page, "attribute_focus_company_repeat", {
    "Company repeat habit": "Company: active in most weeks",
  });
}

function updateProgress(reportRoot) {
  const page = "92d_action_maturity";
  renamePage(reportRoot, page, "How are users progressing?");
  setTextboxText(
    reportRoot,
    page,
    "am_title",
    "How are users progressing?"
  );
  setTextboxText(
    reportRoot,
    page,
    "cb645b0c559047b682fc",
    "Usage patterns summarize consistency and frequency across all available covered weeks, up to 12."
  );
  hideVisualType(reportRoot, page, "actionButton");
  setHidden(reportRoot, page, "am_subtitle", true);
  setHidden(reportRoot, page, "am_trend_automation", true);
  setTextboxText(
    reportRoot,
    page,
    "am_stage_method_overview",
    "GROUP DEFINITIONS | Cowork super user: active in at least 75% of weeks and at least 6 sessions/week. Steady: active in at least 75% and under 6 sessions/week. Emerging: active in 25–74%. Occasional: active in under 25%. No observed use: no sessions.\nUse all reliable history available, up to 12 weeks. These groups support enablement planning—not performance evaluation."
  );
  replaceVisualStrings(reportRoot, page, "am_trend_automation", {
    "Movement Narrative": "What changed",
  });
  replaceVisualStrings(reportRoot, page, "a267a7a9e8ea8c0613f6", {
    "Usage stage mix over time": "How the user mix is changing",
    "Share of users": "Share of users",
  });
  replaceVisualStrings(reportRoot, page, "am_ladder_stack", {
    "Stage share: previous vs latest": "Previous versus latest user mix",
    "Usage stage": "Usage pattern",
  });
  replaceVisualStrings(reportRoot, page, "am_kpi_steps", {
    "regular retention": "Continued active most weeks",
  });
}

function updateChampions(reportRoot) {
  const page = "92e_cowork_champions";
  renamePage(reportRoot, page, "Which users could help scale adoption?");
  setTextboxText(
    reportRoot,
    page,
    "9ddc19013bfcf0627dd5",
    "Which users could help scale adoption?"
  );
  setTextboxText(
    reportRoot,
    page,
    "198bbad4dc127140083e",
    "Review consistently active users, then confirm willingness, communication fit, manager support, and consent."
  );
  setHidden(reportRoot, page, "67c6d96a1d5c02bcaa08", true);
  setTextboxText(
    reportRoot,
    page,
    "b4e4407f17185d85cc6d",
    "COWORK SUPER USER VS POTENTIAL PEER ENABLER\nCowork super user = active in at least 75% of available weeks and averages at least 6 sessions per available week.\nPotential peer enabler = a top-ranked user who is active in most weeks, based on active weeks and average weekly sessions.\nUsage is only the starting signal. Confirm willingness, communication fit, manager support, and consent before outreach."
  );
  replaceVisualStrings(reportRoot, page, "08660f4c9c5f5e4b3518", {
    "Potential champions": "Potential peer enablers",
  });
  replaceVisualStrings(reportRoot, page, "2c5b4a806b23522c2c9d", {
    "Potential champions by department": "Potential peer enablers by department",
  });
  replaceVisualStrings(reportRoot, page, "57a017353115c9a7ee16", {
    "Potential champion activity": "Potential peer-enabler evidence",
  });
  setTextboxText(
    reportRoot,
    page,
    "41acbb262c9b82e562e7",
    "CANDIDATE SIGNAL, NOT A DESIGNATION\nA potential peer enabler is not a separate usage group.\nConfirm willingness, communication fit, manager support, and employee consent before outreach."
  );
}

function updateConsumption(reportRoot) {
  const page = "92_activity_value";
  renamePage(reportRoot, page, "Where is adoption lagging while credits are high?");
  setTextboxText(
    reportRoot,
    page,
    "av_title",
    "Where is adoption lagging while credits are high?"
  );
  hideVisualType(reportRoot, page, "actionButton");
  setCardMeasureBinding(
    reportRoot,
    page,
    "av_card_users",
    "Consumption Weekly",
    "Fastest Adoption Department",
    "Fastest adoption"
  );
  setCardMeasureBinding(
    reportRoot,
    page,
    "av_card_interactions",
    "Consumption Weekly",
    "High Credit Low Reach Department",
    "Low reach + high credits"
  );
  setCardMeasureBinding(
    reportRoot,
    page,
    "av_card_hours",
    "Consumption Weekly",
    "Most Concentrated Department",
    "Most concentrated"
  );
  setCardMeasureBinding(
    reportRoot,
    page,
    "av_card_avg",
    "Cost per Credit",
    "Estimated Cost",
    "Estimated cost"
  );
  for (const id of [
    "av_card_users",
    "av_card_interactions",
    "av_card_hours",
    "av_card_avg",
  ]) {
    editVisual(reportRoot, page, id, (visual) => {
      visual.visual.objects.value[0].properties.fontSize = {
        expr: { Literal: { Value: "12D" } },
      };
      visual.visual.objects.value[0].properties.fontFamily = {
        expr: { Literal: { Value: "'Segoe UI Semibold'" } },
      };
    });
  }
  editVisual(reportRoot, page, "av_card_interactions", (visual) => {
    visual.visual.objects.value[0].properties.fontSize = {
      expr: { Literal: { Value: "10D" } },
    };
  });
  setHidden(reportRoot, page, "av_department_sessions", true);
  setHidden(reportRoot, page, "av_department_credits", true);
  configureDepartmentPortfolioScatter(reportRoot);
  configureDepartmentPortfolioMatrix(reportRoot);
  configureCostRateSlicer(reportRoot);
  setTextboxText(
    reportRoot,
    page,
    "av_narrative",
    "HOW TO READ | Each bubble is a department. Right = broader latest-week adoption. Up = more credits per active user. Bubble size = total credits.\nCOST | Estimated cost uses the customer-selected cost per credit. It supports showback; it is not ROI or realized business value."
  );
  replaceVisualStrings(reportRoot, page, "av_department_matrix", {
    "Department comparison": "Consumption by organization and user",
  });
}

function updateWorkContext(reportRoot) {
  const page = "92_actions_hub";
  renamePage(reportRoot, page, "How does work context differ?");
  setTextboxText(
    reportRoot,
    page,
    "mv_ax_ax_title",
    "How does work context differ by usage pattern?"
  );
  hideVisualType(reportRoot, page, "actionButton");
  setHidden(reportRoot, page, "skill_treemap_actions", true);
  for (const [id, x, width, property, label] of [
    [
      "mv_ax_ax_card_coverage",
      432,
      192,
      "Selected Metric Super User Average",
      "Cowork super users",
    ],
    [
      "mv_ax_ax_card_actions",
      640,
      192,
      "Selected Metric Occasional User Average",
      "Occasional users",
    ],
    [
      "mv_ax_ax_card_interactions",
      848,
      192,
      "Selected Metric Super vs Occasional Difference",
      "High vs low difference",
    ],
  ]) {
    setHidden(reportRoot, page, id, false);
    setPosition(reportRoot, page, id, {
      x,
      y: 96,
      width,
      height: 80,
    });
    setCardMeasureBinding(reportRoot, page, id, "Person Metrics", property, label);
  }
  cloneVisual(
    reportRoot,
    page,
    "mv_ax_ax_card_coverage",
    "mv_ax_ax_card_difference",
    {
      x: 1056,
      y: 96,
      width: 208,
      height: 80,
      z: 21100,
      tabOrder: 1900,
    }
  );
  setCardMeasureBinding(
    reportRoot,
    page,
    "mv_ax_ax_card_difference",
    "Person Metrics",
    "Selected Metric Recent 4 Week Change",
    "Recent 4-week change"
  );
  for (const id of ["mv_ax_ax_card_coverage", "mv_ax_ax_card_actions"]) {
    editVisual(reportRoot, page, id, (visual) => {
      visual.visual.objects.value[0].properties.fontSize = {
        expr: { Literal: { Value: "12D" } },
      };
    });
  }
  cloneVisual(
    reportRoot,
    page,
    "mv_ax_ax_card_coverage",
    "mv_ax_ax_dynamic_finding",
    {
      x: 16,
      y: 438,
      width: 400,
      height: 266,
      z: 21200,
      tabOrder: 3600,
    }
  );
  setCardMeasureBinding(
    reportRoot,
    page,
    "mv_ax_ax_dynamic_finding",
    "Person Metrics",
    "Selected Metric Finding",
    "What this means"
  );
  editVisual(reportRoot, page, "mv_ax_ax_dynamic_finding", (visual) => {
    const value = visual.visual.objects.value[0].properties;
    value.fontSize = { expr: { Literal: { Value: "12D" } } };
    value.fontFamily = { expr: { Literal: { Value: "'Segoe UI'" } } };
    value.bold = { expr: { Literal: { Value: "false" } } };
    value.textWrap = { expr: { Literal: { Value: "true" } } };
  });
  setPosition(reportRoot, page, "mv_ax_ax_table", {
    x: 432,
    y: 192,
    width: 832,
    height: 192,
  });
  replaceVisualStrings(reportRoot, page, "mv_ax_ax_table", {
    "Behavioral differences by Cowork usage stage":
      "Work context by Cowork usage pattern",
  });
  replaceVisualStrings(reportRoot, page, "wp_metric_trend", {
    "Work pattern and Cowork session intensity over time":
      "Selected work-context metric over time",
  });
}

function updateGlossary(reportRoot) {
  const page = "100_glossary";
  renamePage(reportRoot, page, "Definitions, sources, and limits");
  setTextboxText(
    reportRoot,
    page,
    "glossary_title",
    "Definitions, sources, and limits"
  );
  setTextboxText(
    reportRoot,
    page,
    "glossary_info",
    "VALIDATE A RESULT\nUse the filters, then confirm period, users included, calculation, and evidence.\n\nEVIDENCE\nObserved = reported by Viva Insights.\nDerived = calculated.\nDashboard only = visible in Viva but not exported.\nUnavailable = never inferred from sessions or credits."
  );
}

function ensureAdoptionFunnel(modelRoot) {
  const definitionRoot = path.join(modelRoot, "definition");
  const tablePath = path.join(definitionRoot, "tables", "Adoption Funnel.tmdl");
  const tableDefinition = `/// Executive adoption journey from the analyzed population to high-frequency recurring users.
table 'Adoption Funnel'
\tlineageTag: 6a305b2e-8e3b-4d5c-9f16-0f6f0f3e63ae

\t/// Privacy-safe number of users at the selected adoption-funnel stage.
\tmeasure 'Funnel Users' =
\t\t\tVAR _stage = SELECTEDVALUE('Adoption Funnel'[Stage])
\t\t\tRETURN
\t\t\tSWITCH(
\t\t\t    _stage,
\t\t\t    "Total population", [Reportable Population],
\t\t\t    "Active users", [Observed Cowork Active Users],
\t\t\t    "Active in most weeks", [Users Active Most Weeks],
\t\t\t    "Cowork super users", [Cowork Super Users]
\t\t\t)
\t\tformatString: #,##0
\t\tdisplayFolder: Adoption funnel
\t\tlineageTag: f2d01898-7fc8-49f8-ad30-4fbd42ef7770

\tcolumn Stage
\t\tdataType: string
\t\tlineageTag: 7ce74128-1f69-43ff-a7cb-98cb668db213
\t\tsummarizeBy: none
\t\tsourceColumn: Stage
\t\tsortByColumn: 'Stage Sort'

\tcolumn 'Stage Sort'
\t\tdataType: int64
\t\tisHidden
\t\tlineageTag: 7f16e56a-827f-4695-889c-0ba17141c733
\t\tsummarizeBy: none
\t\tsourceColumn: Stage Sort

\tpartition 'Adoption Funnel' = m
\t\tmode: import
\t\tsource =
\t\t\t\tlet
\t\t\t\t\tData = #table({"Stage", "Stage Sort"}, {
\t\t\t\t\t        {"Total population", 1},
\t\t\t\t\t        {"Active users", 2},
\t\t\t\t\t        {"Active in most weeks", 3},
\t\t\t\t\t        {"Cowork super users", 4}
\t\t\t\t\t    })
\t\t\t\tin
\t\t\t\t\tData
`;
  fs.writeFileSync(tablePath, tableDefinition, "utf8");

  const modelPath = path.join(definitionRoot, "model.tmdl");
  let model = fs.readFileSync(modelPath, "utf8");
  if (!model.includes("ref table 'Adoption Funnel'")) {
    model = model.replace(
      "ref table 'Adoption Actions'",
      "ref table 'Adoption Actions'\nref table 'Adoption Funnel'"
    );
  }
  fs.writeFileSync(modelPath, model, "utf8");
}

function ensureCreditGovernanceMeasures(modelRoot) {
  const tablePath = path.join(
    modelRoot,
    "definition",
    "tables",
    "Consumption Weekly.tmdl"
  );
  let content = fs.readFileSync(tablePath, "utf8");
  if (!content.includes("\tmeasure 'Credits per Active User' =")) {
    const anchor = "\t/// Observed Cowork credits divided by observed Cowork sessions; descriptive consumption intensity only.";
    const measures = `\t/// Observed Cowork credits divided by privacy-safe active users in the selected period.
\tmeasure 'Credits per Active User' =
\t\t\tDIVIDE([Total Cowork Credits], [Observed Cowork Active Users])
\t\tformatString: #,##0.0
\t\tdisplayFolder: Credit governance
\t\tlineageTag: b01dc5db-262c-4ff9-9ac1-6dd4b906b0ef

\t/// Percentage of observed Cowork credits consumed by the highest-credit 10 percent of active users.
\tmeasure 'Top 10 Percent User Credit Share' =
\t\t\tVAR _users =
\t\t\t    FILTER(
\t\t\t        ALLSELECTED('Organization'[User ID]),
\t\t\t        CALCULATE(SUM('Consumption Weekly'[AI Credits])) > 0
\t\t\t    )
\t\t\tVAR _userCount = COUNTROWS(_users)
\t\t\tVAR _topCount = MAX(1, ROUNDUP(_userCount * 0.10, 0))
\t\t\tVAR _ranked =
\t\t\t    TOPN(
\t\t\t        _topCount,
\t\t\t        ADDCOLUMNS(
\t\t\t            _users,
\t\t\t            "__Credits", CALCULATE(SUM('Consumption Weekly'[AI Credits]))
\t\t\t        ),
\t\t\t        [__Credits], DESC,
\t\t\t        'Organization'[User ID], ASC
\t\t\t    )
\t\t\tVAR _topCredits = SUMX(_ranked, [__Credits])
\t\t\tVAR _totalCredits =
\t\t\t    SUMX(
\t\t\t        _users,
\t\t\t        CALCULATE(SUM('Consumption Weekly'[AI Credits]))
\t\t\t    )
\t\t\tRETURN
\t\t\tIF(
\t\t\t    [Population] >= [Privacy Floor] && _userCount >= [Privacy Floor],
\t\t\t    DIVIDE(_topCredits, _totalCredits)
\t\t\t)
\t\tformatString: 0.0%
\t\tdisplayFolder: Credit governance
\t\tlineageTag: 76a548d4-dfbe-4593-9e8e-20c650801dda

`;
    if (!content.includes(anchor)) {
      throw new Error("Credits-per-session anchor not found");
    }
    content = content.replace(anchor, `${measures}${anchor}`);
  }
  content = content.replace(
    `& FORMAT([__Reach], "0.0%") & " active, "
\t\t\t            & FORMAT([__CreditsPerUser], "#,##0") & " credits/user"`,
    `& FORMAT([__Reach], "0.0%") & " / "
\t\t\t            & FORMAT(DIVIDE([__CreditsPerUser], 1000), "0.0") & "K"`
  );
  content = content.replace(
    `& FORMAT([__Reach], "0.0%") & " active / "
\t\t\t            & FORMAT(DIVIDE([__CreditsPerUser], 1000), "0.0") & "K credits/user"`,
    `& FORMAT([__Reach], "0.0%") & " / "
\t\t\t            & FORMAT(DIVIDE([__CreditsPerUser], 1000), "0.0") & "K"`
  );
  fs.writeFileSync(tablePath, content, "utf8");
}

function ensureWorkContextFindingMeasures(modelRoot) {
  const tablePath = path.join(
    modelRoot,
    "definition",
    "tables",
    "Person Metrics.tmdl"
  );
  let content = fs.readFileSync(tablePath, "utf8");
  if (!content.includes("\tmeasure 'Selected Metric Super User Average' =")) {
    const anchor = "\tcolumn Bucket";
    const comparisonMeasures = `\t/// Privacy-safe average selected work-context metric for Cowork super users.
\tmeasure 'Selected Metric Super User Average' =
\t\t\tCALCULATE(
\t\t\t    [Selected Metric Stage Average],
\t\t\t    REMOVEFILTERS(
\t\t\t        'Usage Segment Snapshot'[Latest Segment],
\t\t\t        'Usage Segment Snapshot'[Latest Segment Sort]
\t\t\t    ),
\t\t\t    'Usage Segment Snapshot'[Latest Segment] = "Cowork super user"
\t\t\t)
\t\tformatString: #,##0.0
\t\tdisplayFolder: Adoption context
\t\tlineageTag: eac3146d-c2ba-4409-8afc-e20cc38f0892

\t/// Privacy-safe average selected work-context metric for occasional Cowork users.
\tmeasure 'Selected Metric Occasional User Average' =
\t\t\tCALCULATE(
\t\t\t    [Selected Metric Stage Average],
\t\t\t    REMOVEFILTERS(
\t\t\t        'Usage Segment Snapshot'[Latest Segment],
\t\t\t        'Usage Segment Snapshot'[Latest Segment Sort]
\t\t\t    ),
\t\t\t    'Usage Segment Snapshot'[Latest Segment] = "Occasional user"
\t\t\t)
\t\tformatString: #,##0.0
\t\tdisplayFolder: Adoption context
\t\tlineageTag: a7a16a02-da25-429b-829e-381f2d9b0c02

\t/// Percentage difference between Cowork super-user and occasional-user averages for the selected metric.
\tmeasure 'Selected Metric Super vs Occasional Difference' =
\t\t\tVAR _high = [Selected Metric Super User Average]
\t\t\tVAR _low = [Selected Metric Occasional User Average]
\t\t\tVAR _difference = DIVIDE(_high - _low, ABS(_low))
\t\t\tRETURN
\t\t\tIF(
\t\t\t    NOT ISBLANK(_high) && NOT ISBLANK(_low),
\t\t\t    IF(ABS(_difference) < 0.0005, 0, _difference)
\t\t\t)
\t\tformatString: +0.0%;-0.0%;0.0%
\t\tdisplayFolder: Adoption context
\t\tlineageTag: 7f04631a-fc12-4ed9-81b9-8334b9af48dd

\t/// Change in the selected metric's latest four-week average versus the preceding four weeks.
\tmeasure 'Selected Metric Recent 4 Week Change' =
\t\t\tVAR _weeks =
\t\t\t    CALCULATETABLE(
\t\t\t        VALUES('Calendar'[Week Start]),
\t\t\t        ALLSELECTED('Calendar'[Week Start])
\t\t\t    )
\t\t\tVAR _recentWeeks = TOPN(4, _weeks, 'Calendar'[Week Start], DESC)
\t\t\tVAR _earlierWeeks =
\t\t\t    EXCEPT(
\t\t\t        TOPN(8, _weeks, 'Calendar'[Week Start], DESC),
\t\t\t        _recentWeeks
\t\t\t    )
\t\t\tVAR _recent =
\t\t\t    AVERAGEX(
\t\t\t        _recentWeeks,
\t\t\t        CALCULATE([Selected Metric Overall Average])
\t\t\t    )
\t\t\tVAR _earlier =
\t\t\t    AVERAGEX(
\t\t\t        _earlierWeeks,
\t\t\t        CALCULATE([Selected Metric Overall Average])
\t\t\t    )
\t\t\tVAR _change = DIVIDE(_recent - _earlier, ABS(_earlier))
\t\t\tRETURN
\t\t\tIF(
\t\t\t    COUNTROWS(_recentWeeks) = 4
\t\t\t        && COUNTROWS(_earlierWeeks) = 4
\t\t\t        && NOT ISBLANK(_recent)
\t\t\t        && NOT ISBLANK(_earlier),
\t\t\t    IF(ABS(_change) < 0.0005, 0, _change)
\t\t\t)
\t\tformatString: +0.0%;-0.0%;0.0%
\t\tdisplayFolder: Adoption context
\t\tlineageTag: e623da7e-51b2-4775-bf33-397a7f1393ec

`;
    if (!content.includes(anchor)) {
      throw new Error("Person Metrics column anchor not found");
    }
    content = content.replace(anchor, `${comparisonMeasures}${anchor}`);
  }
  const groupTable = `FILTER(
\t\t\t        ADDCOLUMNS(
\t\t\t            CALCULATETABLE(
\t\t\t                VALUES('Usage Segment Snapshot'[Latest Segment]),
\t\t\t                REMOVEFILTERS(
\t\t\t                    'Usage Segment Snapshot'[Latest Segment],
\t\t\t                    'Usage Segment Snapshot'[Latest Segment Sort]
\t\t\t                )
\t\t\t            ),
\t\t\t            "__Value", CALCULATE([Selected Metric Stage Average])
\t\t\t        ),
\t\t\t        NOT ISBLANK([__Value])
\t\t\t    )`;
  if (!content.includes("\tmeasure 'Selected Metric Highest Group' =")) {
    const anchor = "\tcolumn Bucket";
    const measures = `\t/// Usage group with the highest privacy-safe average for the selected work-context metric.
\tmeasure 'Selected Metric Highest Group' =
\t\t\tVAR _groups = ${groupTable}
\t\t\tVAR _highest =
\t\t\t    TOPN(
\t\t\t        1,
\t\t\t        _groups,
\t\t\t        [__Value], DESC,
\t\t\t        'Usage Segment Snapshot'[Latest Segment], ASC
\t\t\t    )
\t\t\tRETURN
\t\t\tCONCATENATEX(
\t\t\t    _highest,
\t\t\t    'Usage Segment Snapshot'[Latest Segment] & " | " & FORMAT([__Value], "#,##0.0")
\t\t\t)
\t\tformatString: General
\t\tdisplayFolder: Adoption context
\t\tlineageTag: fdd94b55-55c7-4868-a265-dc70b0ee91a7

\t/// Usage group with the lowest privacy-safe average for the selected work-context metric.
\tmeasure 'Selected Metric Lowest Group' =
\t\t\tVAR _groups = ${groupTable}
\t\t\tVAR _lowest =
\t\t\t    TOPN(
\t\t\t        1,
\t\t\t        _groups,
\t\t\t        [__Value], ASC,
\t\t\t        'Usage Segment Snapshot'[Latest Segment], ASC
\t\t\t    )
\t\t\tRETURN
\t\t\tCONCATENATEX(
\t\t\t    _lowest,
\t\t\t    'Usage Segment Snapshot'[Latest Segment] & " | " & FORMAT([__Value], "#,##0.0")
\t\t\t)
\t\tformatString: General
\t\tdisplayFolder: Adoption context
\t\tlineageTag: 1cc4a04f-910b-4a16-84e0-ab3275257f52

\t/// Percentage change in the selected work-context metric from the prior visible week to the latest visible week.
\tmeasure 'Selected Metric Latest Week Change' =
\t\t\tVAR _weeks =
\t\t\t    CALCULATETABLE(
\t\t\t        VALUES('Calendar'[Week Start]),
\t\t\t        ALLSELECTED('Calendar'[Week Start])
\t\t\t    )
\t\t\tVAR _latestWeek = MAXX(_weeks, 'Calendar'[Week Start])
\t\t\tVAR _priorWeek =
\t\t\t    MAXX(
\t\t\t        FILTER(_weeks, 'Calendar'[Week Start] < _latestWeek),
\t\t\t        'Calendar'[Week Start]
\t\t\t    )
\t\t\tVAR _latestValue =
\t\t\t    CALCULATE(
\t\t\t        [Selected Metric Overall Average],
\t\t\t        REMOVEFILTERS('Calendar'[Week Start]),
\t\t\t        'Calendar'[Week Start] = _latestWeek
\t\t\t    )
\t\t\tVAR _priorValue =
\t\t\t    CALCULATE(
\t\t\t        [Selected Metric Overall Average],
\t\t\t        REMOVEFILTERS('Calendar'[Week Start]),
\t\t\t        'Calendar'[Week Start] = _priorWeek
\t\t\t    )
\t\t\tVAR _change = DIVIDE(_latestValue - _priorValue, ABS(_priorValue))
\t\t\tRETURN
\t\t\tIF(
\t\t\t    NOT ISBLANK(_latestValue) && NOT ISBLANK(_priorValue),
\t\t\t    IF(ABS(_change) < 0.0005, 0, _change)
\t\t\t)
\t\tformatString: +0.0%;-0.0%;0.0%
\t\tdisplayFolder: Adoption context
\t\tlineageTag: d00e005f-dccb-47ba-a081-17cb96bb78ce

`;
    if (!content.includes(anchor)) {
      throw new Error("Person Metrics column anchor not found");
    }
    content = content.replace(anchor, `${measures}${anchor}`);
  }
  const gapBlock = `\t/// Percentage difference between the highest and lowest privacy-safe usage-group averages for the selected metric.
\tmeasure 'Selected Metric Highest-Lowest Gap' =
\t\t\tVAR _groups = ${groupTable}
\t\t\tVAR _highest = MAXX(_groups, [__Value])
\t\t\tVAR _lowest = MINX(_groups, [__Value])
\t\t\tVAR _gap = DIVIDE(_highest - _lowest, ABS(_lowest))
\t\t\tRETURN
\t\t\tIF(
\t\t\t    NOT ISBLANK(_highest) && NOT ISBLANK(_lowest),
\t\t\t    IF(ABS(_gap) < 0.0005, 0, _gap)
\t\t\t)
\t\tformatString: 0.0%
\t\tdisplayFolder: Adoption context
\t\tlineageTag: 221071ef-8b17-49fd-89e0-b5e60508e716
`;
  const findingBlock = `\t/// Dynamic comparison of Cowork super users versus occasional users plus recent work-pattern direction.
\tmeasure 'Selected Metric Finding' =
\t\t\tVAR _metric = [Selected Work Pattern Metric]
\t\t\tVAR _high = [Selected Metric Super User Average]
\t\t\tVAR _low = [Selected Metric Occasional User Average]
\t\t\tVAR _gap = [Selected Metric Super vs Occasional Difference]
\t\t\tVAR _recentChange = [Selected Metric Recent 4 Week Change]
\t\t\tVAR _gapText =
\t\t\t    SWITCH(
\t\t\t        TRUE(),
\t\t\t        ABS(_gap) < 0.05, "There is no meaningful high-versus-low gap under the current filters.",
\t\t\t        _gap > 0, "Cowork super users are " & FORMAT(_gap, "0.0%") & " higher than occasional users.",
\t\t\t        "Cowork super users are " & FORMAT(ABS(_gap), "0.0%") & " lower than occasional users."
\t\t\t    )
\t\t\tVAR _trendText =
\t\t\t    SWITCH(
\t\t\t        TRUE(),
\t\t\t        ISBLANK(_recentChange), "Eight weeks of data are needed for the recent trend comparison.",
\t\t\t        ABS(_recentChange) < 0.05, "The recent four-week average is essentially flat versus the prior four weeks.",
\t\t\t        _recentChange > 0, "The recent four-week average increased " & FORMAT(_recentChange, "0.0%") & ".",
\t\t\t        "The recent four-week average decreased " & FORMAT(ABS(_recentChange), "0.0%") & "."
\t\t\t    )
\t\t\tRETURN
\t\t\tIF(
\t\t\t    ISBLANK(_high) || ISBLANK(_low),
\t\t\t    "Not enough privacy-safe data is available to compare Cowork super users with occasional users.",
\t\t\t    _metric & " | Super users average " & FORMAT(_high, "#,##0.0")
\t\t\t        & " versus " & FORMAT(_low, "#,##0.0") & " for occasional users. "
\t\t\t        & _gapText & " " & _trendText
\t\t\t        & " This is an association, not evidence that Cowork caused the work-pattern difference."
\t\t\t)
\t\tformatString: General
\t\tdisplayFolder: Narratives
\t\tlineageTag: 74ec6197-3c55-499e-b667-d3b74d0871fb
`;
  content = content.replace(
    /\t\/\/\/[^\r\n]*\r?\n\tmeasure 'Selected Metric Highest-Lowest Gap' =[\s\S]*?\t\tlineageTag: 221071ef-8b17-49fd-89e0-b5e60508e716\r?\n/,
    `${gapBlock}\n`
  );
  content = content.replace(
    /\t\/\/\/[^\r\n]*\r?\n\tmeasure 'Selected Metric Finding' =[\s\S]*?\t\tlineageTag: 74ec6197-3c55-499e-b667-d3b74d0871fb\r?\n/,
    `${findingBlock}\n`
  );
  const shortGroupLabel = `SWITCH(
\t\t\t        'Usage Segment Snapshot'[Latest Segment],
\t\t\t        "Cowork super user", "Super user",
\t\t\t        "Steady user", "Steady",
\t\t\t        "Emerging user", "Emerging",
\t\t\t        "Occasional user", "Occasional",
\t\t\t        'Usage Segment Snapshot'[Latest Segment]
\t\t\t    )`;
  content = content.replace(
    `'Usage Segment Snapshot'[Latest Segment] & " | " & FORMAT([__Value], "#,##0.0")`,
    `${shortGroupLabel} & " | " & FORMAT([__Value], "#,##0.0")`
  );
  content = content.replace(
    `'Usage Segment Snapshot'[Latest Segment] & " | " & FORMAT([__Value], "#,##0.0")`,
    `${shortGroupLabel} & " | " & FORMAT([__Value], "#,##0.0")`
  );
  fs.writeFileSync(tablePath, content, "utf8");
}

function ensureDepartmentPortfolioMeasures(modelRoot) {
  const tablePath = path.join(
    modelRoot,
    "definition",
    "tables",
    "Consumption Weekly.tmdl"
  );
  let content = fs.readFileSync(tablePath, "utf8");
  if (!content.includes("\tmeasure 'Fastest Adoption Department' =")) {
    const anchor = "\tcolumn 'Person ID'";
    const measures = `\t/// Department with the largest privacy-safe recent four-week active-rate increase.
\tmeasure 'Fastest Adoption Department' =
\t\t\tVAR _departments =
\t\t\t    FILTER(
\t\t\t        ADDCOLUMNS(
\t\t\t            ALLSELECTED('Organization'[Function]),
\t\t\t            "__Population", CALCULATE([Reportable Population]),
\t\t\t            "__Momentum", CALCULATE([Active Rate Momentum pp])
\t\t\t        ),
\t\t\t        'Organization'[Function] <> "Not provided"
\t\t\t            && [__Population] >= [Privacy Floor]
\t\t\t            && NOT ISBLANK([__Momentum])
\t\t\t    )
\t\t\tVAR _top =
\t\t\t    TOPN(
\t\t\t        1,
\t\t\t        _departments,
\t\t\t        [__Momentum], DESC,
\t\t\t        'Organization'[Function], ASC
\t\t\t    )
\t\t\tRETURN
\t\t\tIF(
\t\t\t    ISEMPTY(_top),
\t\t\t    "Not available",
\t\t\t    CONCATENATEX(
\t\t\t        _top,
\t\t\t        'Organization'[Function] & " | "
\t\t\t            & FORMAT([__Momentum], "+0.0;-0.0;0.0") & " pp"
\t\t\t    )
\t\t\t)
\t\tformatString: General
\t\tdisplayFolder: Department portfolio
\t\tlineageTag: 36a42955-956a-4e0d-a799-29b6a89b19bf

\t/// Department where the highest-credit 10 percent of active users account for the largest credit share.
\tmeasure 'Most Concentrated Department' =
\t\t\tVAR _departments =
\t\t\t    FILTER(
\t\t\t        ADDCOLUMNS(
\t\t\t            ALLSELECTED('Organization'[Function]),
\t\t\t            "__Population", CALCULATE([Reportable Population]),
\t\t\t            "__Concentration", CALCULATE([Top 10 Percent User Credit Share])
\t\t\t        ),
\t\t\t        'Organization'[Function] <> "Not provided"
\t\t\t            && [__Population] >= [Privacy Floor]
\t\t\t            && NOT ISBLANK([__Concentration])
\t\t\t    )
\t\t\tVAR _top =
\t\t\t    TOPN(
\t\t\t        1,
\t\t\t        _departments,
\t\t\t        [__Concentration], DESC,
\t\t\t        'Organization'[Function], ASC
\t\t\t    )
\t\t\tRETURN
\t\t\tIF(
\t\t\t    ISEMPTY(_top),
\t\t\t    "Not available",
\t\t\t    CONCATENATEX(
\t\t\t        _top,
\t\t\t        'Organization'[Function] & " | "
\t\t\t            & FORMAT([__Concentration], "0.0%")
\t\t\t    )
\t\t\t)
\t\tformatString: General
\t\tdisplayFolder: Department portfolio
\t\tlineageTag: 552ac1b7-f193-47b2-85ef-34410504b7bf

\t/// Department with below-company latest reach and above-company credits per active user.
\tmeasure 'High Credit Low Reach Department' =
\t\t\tVAR _companyReach =
\t\t\t    CALCULATE(
\t\t\t        [Latest Weekly Active Rate],
\t\t\t        REMOVEFILTERS('Organization'[Function])
\t\t\t    )
\t\t\tVAR _companyCreditsPerUser =
\t\t\t    CALCULATE(
\t\t\t        [Credits per Active User],
\t\t\t        REMOVEFILTERS('Organization'[Function])
\t\t\t    )
\t\t\tVAR _departments =
\t\t\t    FILTER(
\t\t\t        ADDCOLUMNS(
\t\t\t            ALLSELECTED('Organization'[Function]),
\t\t\t            "__Population", CALCULATE([Reportable Population]),
\t\t\t            "__Reach", CALCULATE([Latest Weekly Active Rate]),
\t\t\t            "__CreditsPerUser", CALCULATE([Credits per Active User])
\t\t\t        ),
\t\t\t        'Organization'[Function] <> "Not provided"
\t\t\t            && [__Population] >= [Privacy Floor]
\t\t\t            && [__Reach] < _companyReach
\t\t\t            && [__CreditsPerUser] > _companyCreditsPerUser
\t\t\t    )
\t\t\tVAR _top =
\t\t\t    TOPN(
\t\t\t        1,
\t\t\t        _departments,
\t\t\t        [__CreditsPerUser], DESC,
\t\t\t        'Organization'[Function], ASC
\t\t\t    )
\t\t\tRETURN
\t\t\tIF(
\t\t\t    ISEMPTY(_top),
\t\t\t    "No outlier",
\t\t\t    CONCATENATEX(
\t\t\t        _top,
\t\t\t        'Organization'[Function] & " | "
\t\t\t            & FORMAT([__Reach], "0.0%") & " active, "
\t\t\t            & FORMAT([__CreditsPerUser], "#,##0") & " credits/user"
\t\t\t    )
\t\t\t)
\t\tformatString: General
\t\tdisplayFolder: Department portfolio
\t\tlineageTag: d4191287-d952-4fda-8b5b-8f63d60a3e32

\t/// Department with the highest privacy-safe credits per observed Cowork session.
\tmeasure 'Highest Credit Intensity Department' =
\t\t\tVAR _departments =
\t\t\t    FILTER(
\t\t\t        ADDCOLUMNS(
\t\t\t            ALLSELECTED('Organization'[Function]),
\t\t\t            "__Population", CALCULATE([Reportable Population]),
\t\t\t            "__Intensity", CALCULATE([Credits per Session])
\t\t\t        ),
\t\t\t        'Organization'[Function] <> "Not provided"
\t\t\t            && [__Population] >= [Privacy Floor]
\t\t\t            && NOT ISBLANK([__Intensity])
\t\t\t    )
\t\t\tVAR _top =
\t\t\t    TOPN(
\t\t\t        1,
\t\t\t        _departments,
\t\t\t        [__Intensity], DESC,
\t\t\t        'Organization'[Function], ASC
\t\t\t    )
\t\t\tRETURN
\t\t\tIF(
\t\t\t    ISEMPTY(_top),
\t\t\t    "Not available",
\t\t\t    CONCATENATEX(
\t\t\t        _top,
\t\t\t        'Organization'[Function] & " | "
\t\t\t            & FORMAT([__Intensity], "#,##0.0") & " credits/session"
\t\t\t    )
\t\t\t)
\t\tformatString: General
\t\tdisplayFolder: Department portfolio
\t\tlineageTag: 03786808-d4cd-481b-b2c6-484923c08cf8

`;
    if (!content.includes(anchor)) {
      throw new Error("Consumption Weekly column anchor not found");
    }
    content = content.replace(anchor, `${measures}${anchor}`);
    fs.writeFileSync(tablePath, content, "utf8");
  }
}

function ensureCostInputMeasures(modelRoot) {
  const definitionRoot = path.join(modelRoot, "definition");
  const tablePath = path.join(
    definitionRoot,
    "tables",
    "Cost per Credit.tmdl"
  );
  const definition = `/// Customer-selected cost assumption for credit-priced consumption showback.
table 'Cost per Credit'
\tlineageTag: 5cd80ca2-20c4-4210-a06c-bef2f5ca782e

\t/// Customer-selected cost per credit; defaults to 0.010 in the customer's currency.
\tmeasure 'Selected Cost per Credit' =
\t\t\tSELECTEDVALUE('Cost per Credit'[Cost per Credit], 0.010)
\t\tformatString: #,##0.0000
\t\tdisplayFolder: Customer cost input
\t\tlineageTag: 52bff6bd-010c-473f-8f55-724f4c81ffad

\t/// Estimated consumption cost in the selected report context using the customer-selected rate.
\tmeasure 'Estimated Cost' =
\t\t\t[Total Cowork Credits] * [Selected Cost per Credit]
\t\tformatString: #,##0.00
\t\tdisplayFolder: Customer cost input
\t\tlineageTag: d98619f4-faa4-40f5-93f9-1527156351a3

\t/// Estimated selected-period consumption cost divided by privacy-safe active users.
\tmeasure 'Estimated Cost per Active User' =
\t\t\tDIVIDE([Estimated Cost], [Observed Cowork Active Users])
\t\tformatString: #,##0.00
\t\tdisplayFolder: Customer cost input
\t\tlineageTag: d23b83f2-d2f7-4527-ad23-9723515217c5

\t/// Estimated selected-period consumption cost divided by observed Cowork sessions.
\tmeasure 'Estimated Cost per Session' =
\t\t\tDIVIDE([Estimated Cost], [Total Cowork Sessions])
\t\tformatString: #,##0.00
\t\tdisplayFolder: Customer cost input
\t\tlineageTag: e4914112-2608-46c6-bdb5-c17ba3736efe

\tcolumn 'Cost per Credit'
\t\tdataType: decimal
\t\tformatString: #,##0.0000
\t\tlineageTag: fff2cadd-12bb-4656-8d5b-2d1792d399e2
\t\tsummarizeBy: none
\t\tsourceColumn: [Value]

\tpartition 'Cost per Credit' = calculated
\t\tmode: import
\t\tsource = GENERATESERIES(0.001, 0.050, 0.0005)
`;
  fs.writeFileSync(tablePath, definition, "utf8");

  const modelPath = path.join(definitionRoot, "model.tmdl");
  let model = fs.readFileSync(modelPath, "utf8");
  if (!model.includes("ref table 'Cost per Credit'")) {
    model = model.replace(
      "ref table 'Adoption Funnel'",
      "ref table 'Adoption Funnel'\nref table 'Cost per Credit'"
    );
  }
  fs.writeFileSync(modelPath, model, "utf8");
}

function updateReport(reportRoot) {
  for (const filePath of walkFiles(path.join(reportRoot, "definition"), new Set([".json"]))) {
    let content = fs.readFileSync(filePath, "utf8");
    content = applyTechnicalReplacements(content);
    content = content
      .split("'Up to 4 weeks'")
      .join("'Up to 12 weeks'");
    fs.writeFileSync(filePath, content, "utf8");
  }

  updateTheme(reportRoot);
  updateStartHere(reportRoot);
  updateExecutive(reportRoot);
  updateWeeklyJourney(reportRoot);
  updateEnablement(reportRoot);
  updateProgress(reportRoot);
  updateChampions(reportRoot);
  updateConsumption(reportRoot);
  updateWorkContext(reportRoot);
  updateGlossary(reportRoot);

  for (const filePath of walkFiles(path.join(reportRoot, "definition"), new Set([".json"]))) {
    const value = replaceUiStrings(readJson(filePath));
    writeJson(filePath, value);
  }
}

function updateModel(modelRoot) {
  const tableRoot = path.join(modelRoot, "definition");
  for (const filePath of walkFiles(tableRoot, new Set([".tmdl"]))) {
    if (path.basename(filePath) === "Metric Definitions.tmdl") {
      continue;
    }
    let content = fs.readFileSync(filePath, "utf8");
    content = applyTechnicalReplacements(content);
    for (const [before, after] of modelCopyReplacements) {
      content = content.split(before).join(after);
    }
    content = content
      .split(/\r?\n/)
      .map((line) => {
        const marker = line.indexOf("///");
        if (marker < 0) {
          return line;
        }
        return `${line.slice(0, marker + 3)}${humanize(line.slice(marker + 3))}`;
      })
      .join("\n");
    content = content.replace(
      "\tmeasure Users with No Observed Use =",
      "\tmeasure 'Users with No Observed Use' ="
    );
    content = content
      .replace(
        "SELECTEDVALUE('Adoption Window'[Window Weeks], 4)",
        "SELECTEDVALUE('Adoption Window'[Window Weeks], 12)"
      )
      .replace(
        'SELECTEDVALUE(\'Adoption Window\'[Window Label], "Up to 4 weeks")',
        'SELECTEDVALUE(\'Adoption Window\'[Window Label], "Up to 12 weeks")'
      );
    fs.writeFileSync(filePath, content, "utf8");
  }
  ensureAdoptionFunnel(modelRoot);
  ensureCreditGovernanceMeasures(modelRoot);
  ensureWorkContextFindingMeasures(modelRoot);
  ensureDepartmentPortfolioMeasures(modelRoot);
  ensureCostInputMeasures(modelRoot);
}

for (const variant of variants) {
  const variantRoot = path.join(root, "src", variant);
  updateModel(path.join(variantRoot, modelName));
  updateReport(path.join(variantRoot, reportName));
}

console.log(
  JSON.stringify(
    {
      variants,
      pages: 9,
      experience: "decision-led",
      defaultWindowWeeks: 12,
      wordDocumentChanged: false,
    },
    null,
    2
  )
);
