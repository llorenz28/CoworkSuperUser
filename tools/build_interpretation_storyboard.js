const pptxgen = require("pptxgenjs");
const path = require("path");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Microsoft";
pptx.company = "Microsoft";
pptx.subject = "CoworkSuperUser interpretation guide";
pptx.title = "CoworkSuperUser Interpretation Storyboard";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Segoe UI Semibold",
  bodyFontFace: "Segoe UI",
  lang: "en-US",
};
pptx.defineSlideMaster({
  title: "CONTENT",
  background: { color: "F8F7FB" },
  objects: [
    { rect: { x: 0, y: 0, w: 13.333, h: 0.08, fill: { color: "6B4EA2" }, line: { color: "6B4EA2" } } },
  ],
});

const C = {
  purple: "311F5E",
  purple2: "6B4EA2",
  purple3: "8E77B5",
  lavender: "EDE8F7",
  blue: "4F80C1",
  teal: "168B82",
  green: "3A8F5B",
  amber: "D9872D",
  red: "B34A4A",
  ink: "172033",
  muted: "647084",
  border: "D9D3E6",
  white: "FFFFFF",
};

const ROOT = path.resolve(__dirname, "..");
const img = (name) => path.join(ROOT, "images", "report-pages", name);
const output = path.join(ROOT, "CoworkSuperUser Interpretation Storyboard.pptx");

function addFooter(slide, section, number) {
  slide.addText("microsoft/CoworkSuperUser", {
    x: 0.55, y: 7.12, w: 3.3, h: 0.18, fontFace: "Segoe UI", fontSize: 8,
    color: C.muted, margin: 0,
  });
  slide.addText(`Version 1.0.1 | Public | ${section}`, {
    x: 8.5, y: 7.12, w: 3.9, h: 0.18, fontFace: "Segoe UI", fontSize: 8,
    color: C.muted, align: "right", margin: 0,
  });
  slide.addText(String(number), {
    x: 12.45, y: 7.12, w: 0.35, h: 0.18, fontFace: "Segoe UI", fontSize: 8,
    color: C.muted, align: "right", margin: 0,
  });
}

function addHeader(slide, title, subtitle, section, number) {
  slide.addText(title, {
    x: 0.55, y: 0.35, w: 8.8, h: 0.48, fontFace: "Segoe UI Semibold",
    fontSize: 26, bold: true, color: C.ink, margin: 0,
  });
  slide.addText(subtitle, {
    x: 0.55, y: 0.87, w: 11.9, h: 0.34, fontFace: "Segoe UI",
    fontSize: 12, color: C.muted, margin: 0,
  });
  addFooter(slide, section, number);
}

function addPill(slide, text, x, y, w, color = C.purple2) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.34, rectRadius: 0.08,
    fill: { color }, line: { color },
  });
  slide.addText(text, {
    x: x + 0.08, y: y + 0.06, w: w - 0.16, h: 0.17,
    color: C.white, fontFace: "Segoe UI Semibold", fontSize: 9, bold: true,
    align: "center", margin: 0,
  });
}

function addCard(slide, x, y, w, h, title, body, accent = C.purple2) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: C.white }, line: { color: C.border, width: 1 },
    shadow: { type: "outer", color: "B5AEC3", blur: 1.5, angle: 45, distance: 1, opacity: 0.15 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.07, h, fill: { color: accent }, line: { color: accent },
  });
  slide.addText(title, {
    x: x + 0.22, y: y + 0.14, w: w - 0.36, h: 0.28,
    fontFace: "Segoe UI Semibold", fontSize: 13, bold: true, color: C.ink, margin: 0,
  });
  slide.addText(body, {
    x: x + 0.22, y: y + 0.48, w: w - 0.36, h: h - 0.6,
    fontFace: "Segoe UI", fontSize: 10.5, color: C.muted, margin: 0.02,
    valign: "top",
  });
}

function addNumberedRow(slide, number, title, body, x, y, w, accent = C.purple2) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: 0.34, h: 0.34, fill: { color: accent }, line: { color: accent },
  });
  slide.addText(String(number), {
    x, y: y + 0.055, w: 0.34, h: 0.16, color: C.white, bold: true,
    fontFace: "Segoe UI Semibold", fontSize: 9, align: "center", margin: 0,
  });
  slide.addText(title, {
    x: x + 0.48, y: y - 0.01, w: w - 0.48, h: 0.24,
    fontFace: "Segoe UI Semibold", fontSize: 11.5, bold: true, color: C.ink, margin: 0,
  });
  slide.addText(body, {
    x: x + 0.48, y: y + 0.25, w: w - 0.48, h: 0.47,
    fontFace: "Segoe UI", fontSize: 9.4, color: C.muted, margin: 0,
    valign: "top",
  });
}

function addGuardrail(slide, text) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.65, y: 6.48, w: 12.05, h: 0.48, rectRadius: 0.06,
    fill: { color: "F7EEE4" }, line: { color: "E4C49A", width: 1 },
  });
  slide.addText("GUARDRAIL", {
    x: 0.82, y: 6.62, w: 0.88, h: 0.16, fontFace: "Segoe UI Semibold",
    fontSize: 8.5, bold: true, color: C.amber, margin: 0,
  });
  slide.addText(text, {
    x: 1.75, y: 6.57, w: 10.7, h: 0.23, fontFace: "Segoe UI",
    fontSize: 9.3, color: C.ink, margin: 0,
  });
}

function screenshotSlide(title, subtitle, image, steps, guardrail, number) {
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, title, subtitle, "Page walkthrough", number);
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55, y: 1.38, w: 7.18, h: 4.05, rectRadius: 0.08,
    fill: { color: C.white }, line: { color: C.border, width: 1.1 },
    shadow: { type: "outer", color: "9D95AD", blur: 2, angle: 45, distance: 1.2, opacity: 0.18 },
  });
  slide.addImage({ path: img(image), x: 0.64, y: 1.47, w: 7.0, h: 3.94 });
  slide.addText(`${number - 7} of 9 report pages`, {
    x: 0.75, y: 5.57, w: 2.1, h: 0.2, fontFace: "Segoe UI Semibold",
    fontSize: 9, color: C.purple2, margin: 0,
  });
  steps.forEach((step, i) => {
    addNumberedRow(slide, i + 1, step[0], step[1], 8.0, 1.38 + i * 0.95, 4.65, [C.purple2, C.blue, C.teal, C.green, C.amber][i]);
  });
  addGuardrail(slide, guardrail);
}

function sectionSlide(kicker, title, subtitle, number) {
  const slide = pptx.addSlide();
  slide.background = { color: C.purple };
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.0, y: -1.2, w: 5.7, h: 5.7,
    fill: { color: C.purple2, transparency: 35 },
    line: { color: C.purple2, transparency: 100 },
  });
  addPill(slide, kicker, 0.72, 0.7, 1.55, C.teal);
  slide.addText(title, {
    x: 0.72, y: 1.45, w: 8.7, h: 1.0, fontFace: "Segoe UI Semibold",
    fontSize: 34, bold: true, color: C.white, margin: 0,
  });
  slide.addText(subtitle, {
    x: 0.72, y: 2.65, w: 7.9, h: 1.0, fontFace: "Segoe UI",
    fontSize: 18, color: "DCD3EC", margin: 0,
  });
  slide.addText("Purpose  |  Read  |  Diagnose  |  Act  |  Guardrail", {
    x: 0.72, y: 5.72, w: 6.8, h: 0.35, fontFace: "Segoe UI Semibold",
    fontSize: 13, color: "BBA9D8", margin: 0,
  });
  slide.addText("CoworkSuperUser | Version 1.0.1 | Public", {
    x: 0.72, y: 6.75, w: 4.5, h: 0.2, fontFace: "Segoe UI",
    fontSize: 9, color: "BBA9D8", margin: 0,
  });
  slide.addText(String(number), {
    x: 12.35, y: 6.75, w: 0.35, h: 0.2, fontFace: "Segoe UI",
    fontSize: 9, color: "BBA9D8", align: "right", margin: 0,
  });
}

{
  const slide = pptx.addSlide();
  slide.background = { color: C.purple };
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 8.8, y: -1.7, w: 6.2, h: 6.2, fill: { color: C.purple2, transparency: 18 },
    line: { color: C.purple2, transparency: 100 },
  });
  addPill(slide, "VERSION 1.0.1 | PUBLIC", 0.65, 0.52, 1.85, C.teal);
  slide.addText("CoworkSuperUser", {
    x: 0.65, y: 1.42, w: 5.35, h: 0.72, fontFace: "Segoe UI Semibold",
    fontSize: 35, bold: true, color: C.white, margin: 0,
  });
  slide.addText("Interpretation Storyboard", {
    x: 0.65, y: 2.2, w: 5.5, h: 0.45, fontFace: "Segoe UI",
    fontSize: 21, color: "D8CCE9", margin: 0,
  });
  slide.addText("A practical operating guide for Cowork reach, return, usage stages, consumption, potential champions, work-pattern context, and defensible action.", {
    x: 0.65, y: 3.0, w: 5.2, h: 1.1, fontFace: "Segoe UI",
    fontSize: 16, color: C.white, margin: 0,
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.15, y: 0.75, w: 6.5, h: 5.75, rectRadius: 0.08,
    fill: { color: C.white }, line: { color: "A997C8", width: 1.4 },
    shadow: { type: "outer", color: "160E2C", blur: 3, angle: 45, distance: 2, opacity: 0.34 },
  });
  slide.addImage({ path: img("02-executive-adoption.png"), x: 6.32, y: 0.94, w: 6.16, h: 3.47 });
  slide.addImage({ path: img("08-work-pattern-context.png"), x: 6.32, y: 4.58, w: 3.0, h: 1.69 });
  slide.addImage({ path: img("06-champion-identification.png"), x: 9.47, y: 4.58, w: 3.0, h: 1.69 });
  slide.addText("Deterministic fabricated data | 1,200 fictional people | 26 weeks", {
    x: 0.65, y: 6.52, w: 5.5, h: 0.24, fontFace: "Segoe UI",
    fontSize: 9.5, color: "C7B9DB", margin: 0,
  });
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Agenda", "Orientation, page walkthroughs, methodology, query setup, and defensible language", "Interpretation Guide", 2);
  const items = [
    ["1", "Release orientation", "Two connection choices and a five-minute reading path"],
    ["2", "Evidence model", "Sources, grains, privacy, available-history logic, and wording"],
    ["3", "Page walkthrough", "All nine report pages in order"],
    ["4", "Methodology", "Stages, movement, champions, work-pattern context, and consumption"],
    ["5", "Query pipeline", "Person Query, Cowork consumption query, identifiers, and validation"],
    ["6", "Decision language", "Safe claims, boundaries, and presenter checklist"],
  ];
  items.forEach((item, i) => {
    const x = i % 2 === 0 ? 0.65 : 6.85;
    const y = 1.55 + Math.floor(i / 2) * 1.55;
    addCard(slide, x, y, 5.85, 1.2, `${item[0]}  ${item[1]}`, item[2], [C.purple2, C.blue, C.teal][Math.floor(i / 2)]);
  });
  addGuardrail(slide, "Carry the exact period, population, filters, source status, evidence class, and privacy state with every quoted result.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "What's in version 1.0.1", "A customer-ready Viva Insights release with two setup paths and one interpretation contract", "Interpretation Guide", 3);
  const cards = [
    ["Two published templates", "Direct Query for script-free saved-query setup and Optimized Export for the fastest validated refresh."],
    ["Available-history stages", "Up to 4- and 12-week windows load early histories and clearly identify provisional results."],
    ["Current visual QA", "Nine pages, 39 bookmark states, 117 measures, and grid-aligned headers."],
    ["Employee drill paths", "Department-to-pseudonymous-User-ID expansion is available but collapsed by default."],
    ["Public-safe assets", "PBIT files contain no customer data, tenant IDs, local QA paths, or cached model data."],
    ["Reproducible release", "Sanitized PBIP sources, validation tooling, interpretation guide, and narrated walkthrough."],
  ];
  cards.forEach((c, i) => {
    const x = 0.65 + (i % 3) * 4.12;
    const y = 1.55 + Math.floor(i / 3) * 2.15;
    addCard(slide, x, y, 3.75, 1.72, c[0], c[1], [C.purple2, C.blue, C.teal, C.green, C.amber, C.purple3][i]);
  });
  addGuardrail(slide, "Both templates share the same report design and logic; only the source connection path differs.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Five-minute orientation", "If time is limited, read these four pages in order", "Interpretation Guide", 4);
  const sequence = [
    ["Executive Adoption", "Establish observed reach, sustained use, and latest weekly activity."],
    ["Weekly Adoption & Usage", "Decide whether the latest result is sustained, returning, or concentrated."],
    ["Habit Movement", "See whether people moved to stronger stages or slipped."],
    ["Work Pattern Context", "Frame descriptive pattern differences and department enablement prompts."],
  ];
  sequence.forEach((s, i) => {
    const x = 0.85 + i * 3.05;
    slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.98, y: 1.45, w: 0.72, h: 0.72, fill: { color: [C.purple2, C.blue, C.teal, C.green][i] }, line: { color: C.white, width: 2 } });
    slide.addText(String(i + 1), { x: x + 0.98, y: 1.62, w: 0.72, h: 0.25, align: "center", fontSize: 15, bold: true, color: C.white, margin: 0 });
    addCard(slide, x, 2.42, 2.7, 2.0, s[0], s[1], [C.purple2, C.blue, C.teal, C.green][i]);
    if (i < 3) slide.addShape(pptx.ShapeType.chevron, { x: x + 2.75, y: 1.62, w: 0.35, h: 0.35, fill: { color: "B9AEC8" }, line: { color: "B9AEC8" } });
  });
  addCard(slide, 2.2, 4.8, 8.95, 1.0, "Before sharing", "Confirm the exact metric definition and evidence class on Methods and Metric Guide. Use Champion Identification only for enablement outreach and Adoption by Attributes only after population and field coverage are checked.", C.amber);
  addGuardrail(slide, "One page answers the question; a second page supplies context. More pages do not automatically create a stronger conclusion.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Evidence model at a glance", "Two observed query results become one privacy-aware person-week model", "Interpretation Guide", 5);
  addCard(slide, 0.65, 1.45, 3.25, 1.45, "Viva Insights Person Query", "Person + week\nPopulation spine, organization attributes, and work-pattern context.", C.blue);
  addCard(slide, 0.65, 3.15, 3.25, 1.45, "Cowork consumption result", "Person + service + policy + date\nSessions, credits, coverage, and policy context.", C.teal);
  slide.addShape(pptx.ShapeType.chevron, { x: 4.18, y: 2.55, w: 0.6, h: 0.9, fill: { color: C.purple3 }, line: { color: C.purple3 } });
  addCard(slide, 5.05, 2.0, 3.35, 2.1, "Integrated person-week model", "Sunday-start weeks\nValidated uniqueness\nCowork-only aggregation\nCoverage-aware zeros\nAvailable-history stages", C.purple2);
  slide.addShape(pptx.ShapeType.chevron, { x: 8.65, y: 2.55, w: 0.6, h: 0.9, fill: { color: C.purple3 }, line: { color: C.purple3 } });
  addCard(slide, 9.5, 1.45, 3.15, 1.45, "Decision pages", "Reach, return, movement, champions, consumption, attributes, and work patterns.", C.green);
  addCard(slide, 9.5, 3.15, 3.15, 1.45, "Interpretation controls", "10-person privacy floor, definitions, evidence classes, and provisional history.", C.amber);
  addGuardrail(slide, "A missing fact becomes zero only when that week is covered. Missing optional fields and uncovered periods remain unavailable.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Different evidence requires different wording", "Match the claim to the calculation's actual evidence condition", "Interpretation Guide", 6);
  const labels = [
    ["OBSERVED", "Direct source aggregation", "The connected result contains...", C.blue],
    ["DERIVED", "Arithmetic over observed fields", "The report calculates...", C.purple2],
    ["CONTEXT", "Descriptive non-causal comparison", "The selected groups differ descriptively...", C.teal],
    ["REFERENCE", "Template definition or rule", "The template defines...", C.green],
    ["UNAVAILABLE", "Dependency, population, or history absent", "This cannot be calculated from the current inputs...", C.amber],
  ];
  labels.forEach((l, i) => addCard(slide, 0.65 + (i % 3) * 4.12, 1.45 + Math.floor(i / 3) * 2.15, 3.75, 1.72, l[0], `${l[1]}\n\n"${l[2]}"`, l[3]));
  addCard(slide, 8.9, 3.6, 3.6, 1.72, "Carry the context", "Period | Population | Filters | Source status | Evidence class | Privacy state", C.red);
  addGuardrail(slide, "Numerically correct results can still be unsuitable when their denominator, time grain, privacy state, or evidence class is omitted.");
}

sectionSlide("SECTION 1", "Page-by-page walkthrough", "Read every page in five layers: purpose, reading order, diagnostic questions, action, and guardrail.", 7);

screenshotSlide("Start Here", "Route each business question to the right evidence and boundary", "01-start-here.png", [
  ["Purpose", "Choose momentum, cohorts, maturity, work patterns, consumption, or organizational comparison."],
  ["Select the decision", "Open one primary page instead of treating every card as one scorecard."],
  ["Check the window", "Confirm Up to 4 or Up to 12 weeks and the available-history message."],
  ["Use one corroborating page", "Support the headline with trend, denominator, or source context."],
  ["Record context", "Carry period, population, filters, evidence class, and privacy state forward."],
], "Start Here is a decision router, not an automatic narrative or composite score.", 8);

screenshotSlide("Executive Adoption", "Observed reach, sustained use, latest weekly activity, and function distribution", "02-executive-adoption.png", [
  ["Purpose", "Summarize the current adoption state for the selected population."],
  ["Read population first", "The analytical denominator comes from the coverage-qualified Person Query."],
  ["Separate reach and habit", "Observed active users and sustained-use share answer different questions."],
  ["Read the latest week", "Use latest weekly active rate with the trend - not in isolation."],
  ["Corroborate", "Open Weekly Adoption & Usage and the function benchmark before acting."],
], "Observed user share is not an entitlement-based adoption rate without an approved Cowork eligibility roster.", 9);

screenshotSlide("Weekly Adoption & Usage", "Reach, return, cohorts, sessions, and credits over time", "03-weekly-adoption.png", [
  ["Purpose", "Explain whether use is growing, recurring, and distributed."],
  ["Select one view", "Bookmark controls preserve filters while changing the question."],
  ["Read exact values", "Color is relative; table and heatmap numbers carry precision."],
  ["Diagnose the cohort", "Separate new, retained, resurrected, and churned people."],
  ["Choose the response", "Map reach, return, or intensity gaps to different enablement actions."],
], "Sessions and credits describe usage and consumption - not task completion, productivity, quality, or business value.", 10);

screenshotSlide("Adoption by Attributes", "Compare observed reach and sustained use across organization attributes", "04-adoption-by-attributes.png", [
  ["Purpose", "Locate organization groups with different adoption and habit patterns."],
  ["Check population", "Confirm the comparison meets the 10-person privacy floor."],
  ["Choose a lens", "Compare reach, sustained use, weekly activity, or recommended focus."],
  ["Read the benchmark", "Company comparison removes only the selected Function filter."],
  ["Validate locally", "Role mix, rollout timing, and work type can explain differences."],
], "Organizational differences are program signals, not employee-performance comparisons.", 11);

screenshotSlide("Habit Movement", "Compare previous and latest adjacent usage-stage windows", "05-habit-movement.png", [
  ["Purpose", "See whether people improved, remained stable, or declined."],
  ["Read the totals", "Improved, stable, declined, and sustained retention establish the movement."],
  ["Read stage shares", "A positive change is interpreted with the stage label."],
  ["Check the trend", "The stack shows how the mix changes across available weeks."],
  ["Open department view", "Locate where movement differs before selecting an intervention."],
], "Movement is descriptive and can reflect new history, organizational changes, or temporary behavior.", 12);

screenshotSlide("Champion Identification", "Potential peer-enablement partners and department coverage", "06-champion-identification.png", [
  ["Purpose", "Find a small, transparent outreach starting point."],
  ["Check the window", "Candidate evidence is provisional before the selected cap is populated."],
  ["Read consistency", "Active weeks appear before session intensity in the global ranking."],
  ["Check coverage", "Department coverage reveals enablement gaps."],
  ["Validate people", "Confirm role fit, willingness, manager support, and appropriate data use."],
], "Potential champion status is not expertise, aptitude, performance, promotion, or compensation evidence.", 13);

screenshotSlide("Sessions and Credits", "Observed Cowork frequency and resource consumption", "07-sessions-and-credits.png", [
  ["Purpose", "Describe usage volume without converting it into value."],
  ["Read totals", "Sessions and credits answer separate consumption questions."],
  ["Read intensity", "Sessions per active person and credits per session are descriptive ratios."],
  ["Switch the view", "Overall and By department use the same filter context."],
  ["Drill carefully", "User IDs are available under departments but remain collapsed by default."],
], "Sessions are not tasks. Credits are not productivity, quality, complexity, time saved, or business value.", 14);

screenshotSlide("Work Pattern Context", "Descriptive collaboration and network patterns by Cowork stage", "08-work-pattern-context.png", [
  ["Purpose", "Frame local questions about collaboration network and beyond-hours work."],
  ["Select one pattern", "Only metrics supplied by the Person Query are selectable."],
  ["Compare stages", "The Non-user group is a descriptive reference, not a control group."],
  ["Read separate axes", "Pattern averages and Cowork sessions use independent scales."],
  ["Open priorities", "Department enablement prompts explain what to investigate next."],
], "Differences are descriptive and non-causal. Cowork use can coexist with a pattern without causing it.", 15);

screenshotSlide("Methods and Metric Guide", "Definitions, sources, calculations, grains, directions, and caveats", "09-methods-and-metric-guide.png", [
  ["Purpose", "Settle the definition before the metric enters a decision record."],
  ["Filter to the page", "Find the exact metric name and source family."],
  ["Read the calculation", "Confirm grain, denominator, and window behavior."],
  ["Read the caveat", "Check privacy, optional fields, and evidence status."],
  ["Copy the context", "Record the definition, filters, version, and source state."],
], "Missing evidence means unavailable, not zero; a correct measure can still be unsuitable without context.", 16);

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Two connection options. One report experience.", "Choose the implementation path without changing the visuals or interpretation", "Operations", 17);
  addCard(slide, 0.75, 1.55, 5.75, 3.65, "Direct Query template", "Customer inputs\n- Partition Identifier\n- Person Query Identifier\n- Consumption Query Identifier\n\nBest for\n- Script-free setup\n- Connector-only deployment\n- Scheduled Power BI refresh\n\nValidated end-to-end load: about 1.9 minutes for the QA source.", C.purple2);
  addCard(slide, 6.83, 1.55, 5.75, 3.65, "Optimized Export template", "Customer inputs\n- Partition Identifier\n- Person Query Identifier\n- Cowork consumption export folder\n\nBest for\n- Fastest refresh\n- Support fallback\n- Controlled CSV handoff\n\nValidated end-to-end load: about 1.1 minutes for the QA source.", C.teal);
  slide.addText("Both files contain the same 9 pages | 39 bookmarks | 117 measures | Start Here experience", {
    x: 1.2, y: 5.55, w: 10.9, h: 0.35, align: "center", fontFace: "Segoe UI Semibold",
    fontSize: 15, color: C.purple, margin: 0,
  });
  addGuardrail(slide, "The connector template imports saved-query results during refresh; it is not Tabular DirectQuery storage mode.");
}

sectionSlide("SECTION 2", "Methodology and operating controls", "Understand the windows, thresholds, populations, privacy rules, source checks, and deployment sequence behind the visuals.", 18);

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Methodology | Available-history usage stages", "Stages use covered Cowork weeks up to the selected 4- or 12-week cap", "Methodology", 19);
  const stages = [
    ["Power User", "At least 75% active weeks\nand at least 6 average sessions/week", C.purple],
    ["Habitual User", "At least 75% active weeks\nbelow the Power threshold", C.purple2],
    ["Developing User", "25%-74% active weeks", C.blue],
    ["Low-user", "<25% active weeks\nbut at least one session", C.teal],
    ["Non-user", "No positive Cowork session", "8A8F9A"],
  ];
  stages.forEach((s, i) => addCard(slide, 0.55 + i * 2.52, 1.55, 2.22, 1.7, s[0], s[1], s[2]));
  addCard(slide, 0.75, 3.75, 3.7, 1.45, "Up to 4 weeks", "Default. Loads from the first covered week and becomes fully populated at four weeks.", C.blue);
  addCard(slide, 4.82, 3.75, 3.7, 1.45, "Up to 12 weeks", "Longer habit lens. Results remain provisional until twelve covered weeks are available.", C.purple2);
  addCard(slide, 8.9, 3.75, 3.7, 1.45, "Adjacent movement", "Previous and latest windows use the available history and require at least two covered weeks.", C.teal);
  addGuardrail(slide, "Stage labels describe observed Cowork usage under template rules. They are not capability, value, quality, or performance ratings.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Methodology | Habit movement", "Compare adjacent windows without treating every movement as inherently good or bad", "Methodology", 20);
  const items = [
    ["Improved", "Latest stage ranks above the previous stage.", C.green],
    ["Stable", "Latest and previous stages match.", C.blue],
    ["Declined", "Latest stage ranks below the previous stage.", C.amber],
    ["Sustained retention", "Previously sustained users who remain Power or Habitual.", C.purple2],
  ];
  items.forEach((c, i) => addCard(slide, 0.75 + (i % 2) * 6.1, 1.45 + Math.floor(i / 2) * 2.05, 5.75, 1.55, c[0], c[1], c[2]));
  slide.addText("Interpret the direction with the starting and ending stage", {
    x: 2.25, y: 5.55, w: 8.8, h: 0.35, align: "center", fontFace: "Segoe UI Semibold",
    fontSize: 16, color: C.purple, margin: 0,
  });
  addGuardrail(slide, "Counts and transitions below the 10-person privacy floor are suppressed; source changes can move classifications.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Methodology | Potential champions", "A transparent filter-sensitive ranking that always ends with human validation", "Methodology", 21);
  const stages = [
    ["1", "SUSTAINED", "Power or Habitual in the latest window"],
    ["2", "RANK", "Active weeks, then average weekly sessions"],
    ["3", "SELECT", "Fixed top 10% with deterministic tie-breaking"],
    ["4", "VALIDATE", "Role fit, willingness, manager support, data use"],
  ];
  stages.forEach((s, i) => {
    const x = 0.7 + i * 3.1;
    slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.95, y: 1.45, w: 0.7, h: 0.7, fill: { color: [C.purple2, C.blue, C.teal, C.green][i] }, line: { color: C.white, width: 2 } });
    slide.addText(s[0], { x: x + 0.95, y: 1.61, w: 0.7, h: 0.25, align: "center", fontSize: 15, bold: true, color: C.white, margin: 0 });
    addCard(slide, x, 2.4, 2.6, 1.7, s[1], s[2], [C.purple2, C.blue, C.teal, C.green][i]);
  });
  addCard(slide, 1.2, 4.65, 10.9, 1.1, "Stability checks", "Organization filters narrow the displayed list but do not rerank global candidates. Department coverage excludes missing department names. Before four covered weeks, the report labels the evidence provisional.", C.amber);
  addGuardrail(slide, "The candidate list is an outreach starting point - never an automatic action or a personnel decision.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Methodology | Work-pattern context", "Use one selected pattern and one explicit non-causal question", "Methodology", 22);
  addCard(slide, 0.75, 1.45, 5.75, 2.0, "Collaboration network", "Internal network size\nExternal network size\nNetwork outside organization\n\nQuestion: do stages differ descriptively in the size or mix of reciprocal connections?", C.blue);
  addCard(slide, 6.83, 1.45, 5.75, 2.0, "Beyond-hours work", "After-hours collaboration\nWeekend collaboration\nCollaboration span\n\nQuestion: do stages differ descriptively in when collaboration occurs?", C.teal);
  addCard(slide, 0.75, 3.85, 5.75, 1.45, "Stage comparison", "Selected stage average minus the Non-user average, divided by the Non-user average. Both groups must meet the privacy floor.", C.purple2);
  addCard(slide, 6.83, 3.85, 5.75, 1.45, "Weekly trend", "The selected pattern and Cowork session intensity use separate axes. Compare direction and timing - not absolute magnitudes.", C.green);
  addGuardrail(slide, "No work-pattern measure establishes Cowork impact. Treat every difference as a prompt for local investigation.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Data pipeline | Build, connect, validate", "One shared partition, two completed analyses, and a repeatable refresh gate", "Operations", 23);
  const steps = [
    ["1", "Person Query", "Week grouping, active population, organization attributes, and complete work-pattern metrics.", C.blue],
    ["2", "Consumption query", "Day grouping, Service Name = Cowork, sessions, credits, and policy limits.", C.teal],
    ["3", "Wait for Success", "Never connect or export a result that is still processing.", C.green],
    ["4", "Connect", "Enter raw GUIDs in Direct Query or export Cowork CSV for Optimized Export.", C.purple2],
    ["5", "Validate", "Population, weeks, sessions, organization coverage, work patterns, privacy, and no errors.", C.amber],
  ];
  steps.forEach((s, i) => {
    const x = 0.45 + i * 2.55;
    slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.82, y: 1.4, w: 0.62, h: 0.62, fill: { color: s[3] }, line: { color: C.white, width: 2 } });
    slide.addText(s[0], { x: x + 0.82, y: 1.54, w: 0.62, h: 0.22, align: "center", fontSize: 13, bold: true, color: C.white, margin: 0 });
    addCard(slide, x, 2.28, 2.3, 2.3, s[1], s[2], s[3]);
    if (i < 4) slide.addShape(pptx.ShapeType.chevron, { x: x + 2.28, y: 1.55, w: 0.35, h: 0.35, fill: { color: "B9AEC8" }, line: { color: "B9AEC8" } });
  });
  addCard(slide, 1.15, 5.15, 11.0, 0.85, "Recommended query period", "Use all available Cowork history beginning with the first available week. Aim for at least 12 covered weeks when available; do not add pre-Cowork weeks.", C.purple);
  addGuardrail(slide, "Both analyses must use the same partition and overlapping dates. Do not remove required columns after export.");
}

{
  const slide = pptx.addSlide("CONTENT");
  addHeader(slide, "Defensible decision language", "End with the evidence, the boundary, and an owned next step", "Interpretation Guide", 24);
  const rows = [
    ["Reach broadening", "Observed Cowork reach increased in the selected population and period."],
    ["Sustained use", "The report calculates a larger Power or Habitual share under the selected window rules."],
    ["Department difference", "The displayed group differs from the company benchmark; role and rollout context should be checked."],
    ["Champion outreach", "These users meet the sustained-use evidence rule; role fit and willingness still require confirmation."],
    ["Consumption change", "Observed sessions or credits changed; this describes usage, not value or productivity."],
    ["Work-pattern difference", "The stages differ descriptively on this pattern; no causal claim is supported."],
  ];
  rows.forEach((r, i) => {
    const y = 1.35 + i * 0.78;
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.65, y, w: 2.45, h: 0.58, rectRadius: 0.05, fill: { color: i % 2 ? C.lavender : "EAF4F3" }, line: { color: C.border } });
    slide.addText(r[0], { x: 0.85, y: y + 0.17, w: 2.05, h: 0.18, fontFace: "Segoe UI Semibold", fontSize: 10.5, bold: true, color: C.ink, margin: 0 });
    slide.addShape(pptx.ShapeType.roundRect, { x: 3.28, y, w: 9.38, h: 0.58, rectRadius: 0.05, fill: { color: C.white }, line: { color: C.border } });
    slide.addText(`"${r[1]}"`, { x: 3.5, y: y + 0.14, w: 8.95, h: 0.24, fontFace: "Segoe UI", fontSize: 10.3, color: C.ink, margin: 0 });
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 0.65, y: 6.05, w: 12.0, h: 0.65, rectRadius: 0.06, fill: { color: C.purple }, line: { color: C.purple } });
  slide.addText("Do not claim causality, realized savings, employee performance, or a cross-tenant benchmark.", { x: 1.0, y: 6.25, w: 11.3, h: 0.22, align: "center", fontFace: "Segoe UI Semibold", fontSize: 13, bold: true, color: C.white, margin: 0 });
}

(async () => {
  await pptx.writeFile({ fileName: output });
  console.log(output);
})();
