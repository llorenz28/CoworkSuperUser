from __future__ import annotations

import argparse
import csv
import json
import re
import uuid
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VARIANTS = ("direct-query", "optimized-export")
MODEL_NAME = "CoworkVivaV3.SemanticModel"
REPORT_NAME = "CoworkVivaV3.Report"
NAMESPACE = uuid.UUID("b0799560-a1a2-4d41-b935-ce94c6cc51dc")


def tmdl_name(value: str) -> str:
    if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", value):
        return value
    return "'" + value.replace("'", "''") + "'"


def m_string(value: str) -> str:
    return '"' + value.replace('"', '""').replace("\r", " ").replace("\n", " ") + '"'


def lineage(name: str) -> str:
    return str(uuid.uuid5(NAMESPACE, name))


def parse_measures(table_root: Path) -> list[dict[str, object]]:
    measures: list[dict[str, object]] = []
    for path in sorted(table_root.glob("*.tmdl")):
        table = ""
        comments: list[str] = []
        lines = path.read_text(encoding="utf-8-sig").splitlines()
        for index, line in enumerate(lines):
            table_match = re.match(r"^table (?:'((?:''|[^'])+)'|(.*))$", line)
            if table_match:
                table = (table_match.group(1) or table_match.group(2)).replace(
                    "''", "'"
                ).strip()
            comment_match = re.match(r"^\s*///\s?(.*)", line)
            if comment_match:
                comments.append(comment_match.group(1).strip())
                continue
            measure_match = re.match(
                r"^\s*measure\s+(?:'((?:''|[^'])+)'|([^=]+?))\s*=", line
            )
            if not measure_match:
                if line and not line.startswith((" ", "\t")):
                    comments = []
                continue
            name = (measure_match.group(1) or measure_match.group(2)).replace(
                "''", "'"
            ).strip()
            hidden = False
            folder = ""
            next_index = index + 1
            while next_index < len(lines) and not re.match(
                r"^\s*(?:measure|column|partition|table)\s", lines[next_index]
            ):
                if lines[next_index].strip() == "isHidden":
                    hidden = True
                folder_match = re.match(
                    r"^\s*displayFolder:\s*(.*)", lines[next_index]
                )
                if folder_match:
                    folder = folder_match.group(1).strip()
                next_index += 1
            measures.append(
                {
                    "table": table,
                    "name": name,
                    "description": " ".join(comments).strip(),
                    "hidden": hidden,
                    "folder": folder,
                }
            )
            comments = []
    return measures


def parse_existing_rows(path: Path) -> dict[str, dict[str, str]]:
    rows: dict[str, dict[str, str]] = {}
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        stripped = line.strip()
        if not re.match(r"^\{\d+,", stripped):
            continue
        value = stripped.rstrip(",")
        if value.startswith("{") and value.endswith("}"):
            value = value[1:-1]
        parsed = next(csv.reader([value], skipinitialspace=True))
        if len(parsed) == 14:
            (
                sort,
                category,
                metric,
                _model_table,
                _display_folder,
                _visibility,
                _report_use,
                source,
                calculation,
                _definition,
                grain,
                direction,
                caveat,
                evidence,
            ) = parsed
        elif len(parsed) == 13:
            (
                sort,
                category,
                metric,
                _model_table,
                _display_folder,
                _visibility,
                _report_use,
                source,
                calculation,
                grain,
                direction,
                caveat,
                evidence,
            ) = parsed
        elif len(parsed) == 9:
            (
                sort,
                category,
                metric,
                source,
                calculation,
                grain,
                direction,
                caveat,
                evidence,
            ) = parsed
        else:
            continue
        rows[metric] = {
            "sort": sort,
            "category": category,
            "source": source,
            "calculation": calculation,
            "grain": grain,
            "direction": direction,
            "caveat": caveat,
            "evidence": evidence,
        }
    return rows


def report_usage(report_root: Path) -> dict[str, set[str]]:
    usage: dict[str, set[str]] = {}
    pages_metadata = json.loads(
        (report_root / "definition" / "pages" / "pages.json").read_text(
            encoding="utf-8"
        )
    )
    for page_id in pages_metadata["pageOrder"]:
        page_root = report_root / "definition" / "pages" / page_id
        page_name = json.loads(
            (page_root / "page.json").read_text(encoding="utf-8")
        )["displayName"]
        for visual_path in page_root.glob("visuals/*/visual.json"):
            data = json.loads(visual_path.read_text(encoding="utf-8"))
            collect_measure_fields(data, page_name, usage)
    for bookmark_path in (report_root / "definition" / "bookmarks").glob(
        "*.bookmark.json"
    ):
        data = json.loads(bookmark_path.read_text(encoding="utf-8"))
        active_section = (
            data.get("explorationState", {}).get("activeSection") or ""
        )
        page_name = active_section
        page_path = report_root / "definition" / "pages" / active_section / "page.json"
        if page_path.exists():
            page_name = json.loads(page_path.read_text(encoding="utf-8"))[
                "displayName"
            ]
        collect_measure_fields(data, page_name or "Bookmark state", usage)
    return usage


def collect_measure_fields(
    value: object, page_name: str, usage: dict[str, set[str]]
) -> None:
    if isinstance(value, dict):
        measure = value.get("Measure")
        if isinstance(measure, dict):
            table = (
                measure.get("Expression", {})
                .get("SourceRef", {})
                .get("Entity")
            )
            name = measure.get("Property")
            if table and name:
                usage.setdefault(f"{table}[{name}]", set()).add(page_name)
        for child in value.values():
            collect_measure_fields(child, page_name, usage)
    elif isinstance(value, list):
        for child in value:
            collect_measure_fields(child, page_name, usage)


def category_for(measure: dict[str, object]) -> str:
    table = str(measure["table"])
    folder = str(measure["folder"])
    if table == "Adoption Window":
        return "Window selection"
    if table == "Adoption Stage Axis":
        return "Stage comparison"
    if table == "Organization":
        return "Population"
    if table == "Person Metrics":
        return "Work pattern context"
    if table == "Usage Segments Weekly":
        return "Weekly stage"
    if table == "Usage Segment Snapshot":
        if "Champion" in folder:
            return "Champion identification"
        if "Movement" in folder:
            return "Stage movement"
        return "Usage stage"
    if folder:
        return folder.split("\\")[0].replace("_", " ").strip().title()
    return table


def source_for(measure: dict[str, object]) -> str:
    table = str(measure["table"])
    if table in {"Adoption Window", "Adoption Stage Axis"}:
        return "Model setting"
    if table == "Organization":
        return "Person Query"
    if table == "Person Metrics":
        return "Person Query + Cowork stage"
    if table == "Consumption Weekly":
        return "Person Query + consumption query"
    if table in {
        "Usage Segments Weekly",
        "Usage Segment Snapshot",
        "Adoption Measures",
    }:
        return "Person Query + consumption query"
    return table


def grain_for(name: str, folder: str) -> str:
    lower = name.lower()
    if "narrative" in lower or "status" in lower or "selected" in lower:
        return "Selected report context"
    if "weekly" in lower or "prior week" in lower:
        return "Person-week"
    if "candidate" in lower or "window" in lower:
        return "Person-window"
    if "stage" in lower or "segment" in lower or "movement" in lower:
        return "Stage-window"
    if "function" in lower or "company" in lower:
        return "Function"
    if "population" in lower or "users" in lower or "people" in lower:
        return "Person"
    if folder:
        return folder.replace("\\", " / ")
    return "Selected population-period"


def direction_for(name: str) -> str:
    lower = name.lower()
    if any(word in lower for word in ("status", "narrative", "label", "selected")):
        return "Informational"
    if "rank" in lower:
        return "Lower means higher placement"
    if any(word in lower for word in ("gap", "difference", "momentum", "change")):
        return "Positive means above the reference or prior period"
    if any(word in lower for word in ("share", "rate", "reach", "coverage")):
        return "Higher means a larger share or rate"
    if any(word in lower for word in ("threshold", "floor", "window weeks")):
        return "Model setting"
    if any(word in lower for word in ("average", "per session", "per person")):
        return "Higher means a larger average"
    if any(word in lower for word in ("people", "users", "sessions", "credits", "population")):
        return "Higher means a larger observed or derived count"
    return "Interpret with the metric definition"


def caveat_for(measure: dict[str, object], pages: list[str]) -> str:
    name = str(measure["name"])
    lower = name.lower()
    if bool(measure["hidden"]):
        return (
            "Internal helper measure. Included for completeness; it is not "
            "displayed directly and supports other report calculations."
        )
    if "credit" in lower:
        return "Credits describe resource consumption, not productivity, quality, complexity, time saved, or business value."
    if "session" in lower:
        return "Sessions describe usage frequency, not tasks, task completion, productivity, quality, or business value."
    if str(measure["table"]) == "Person Metrics" or "work pattern" in lower:
        return "Descriptive and non-causal; both compared populations must satisfy the privacy floor."
    if any(word in lower for word in ("people", "users", "population", "share", "rate")):
        return "Person-derived results are subject to the 10-person privacy floor and the current filter context."
    if not pages:
        return "Model helper referenced by other calculations; not bound directly to a report visual."
    return "Interpret with the displayed period, population, filters, source coverage, and evidence class."


def evidence_for(measure: dict[str, object]) -> str:
    name = str(measure["name"])
    table = str(measure["table"])
    if name in {"Total Cowork Sessions", "Total Cowork Credits"}:
        return "Observed"
    if table == "Person Metrics":
        return "Context"
    if table in {"Adoption Window", "Adoption Stage Axis"}:
        return "Reference"
    return "Derived"


def customer_text(value: str) -> str:
    return value.replace("Novice users", "Developing users").replace(
        "Novice user", "Developing user"
    )


def build_rows(
    measures: list[dict[str, object]],
    existing: dict[str, dict[str, str]],
    usage: dict[str, set[str]],
) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for index, measure in enumerate(
        sorted(measures, key=lambda item: (str(item["table"]), str(item["folder"]), str(item["name"]))),
        start=1,
    ):
        name = str(measure["name"])
        curated = existing.get(name, {})
        pages = sorted(
            usage.get(f"{measure['table']}[{name}]", set()),
            key=str.casefold,
        )
        visibility = "Hidden helper" if measure["hidden"] else "Visible measure"
        report_use = (
            f"{visibility}; " + ", ".join(pages)
            if pages
            else f"{visibility}; Model helper (not directly displayed)"
        )
        description = customer_text(str(measure["description"]).strip())
        rows.append(
            {
                "sort": str(index),
                "category": customer_text(
                    curated.get("category") or category_for(measure)
                ),
                "metric": name,
                "model_table": str(measure["table"]),
                "display_folder": str(measure["folder"]) or "General",
                "visibility": visibility,
                "report_use": report_use,
                "source": customer_text(
                    curated.get("source") or source_for(measure)
                ),
                "calculation": customer_text(
                    curated.get("calculation") or description
                ),
                "grain": customer_text(
                    curated.get("grain")
                    or grain_for(name, str(measure["folder"]))
                ),
                "direction": customer_text(
                    curated.get("direction") or direction_for(name)
                ),
                "caveat": customer_text(
                    curated.get("caveat") or caveat_for(measure, pages)
                ),
                "evidence": customer_text(
                    curated.get("evidence") or evidence_for(measure)
                ),
            }
        )
        rows[-1]["definition"] = (
            f"{rows[-1]['calculation']} "
            f"Source: {rows[-1]['source']}. "
            f"Grain: {rows[-1]['grain']}. "
            f"Evidence: {rows[-1]['evidence']}."
        )
    return rows


COLUMNS = [
    ("Metric Sort", "int64", True),
    ("Category", "string", False),
    ("Metric", "string", False),
    ("Model Table", "string", False),
    ("Display Folder", "string", False),
    ("Visibility", "string", False),
    ("Report Use", "string", False),
    ("Source Family", "string", False),
    ("Calculation", "string", False),
    ("Definition", "string", False),
    ("Grain", "string", False),
    ("Direction", "string", False),
    ("Caveat", "string", False),
    ("Evidence Class", "string", False),
]


def render_tmdl(rows: list[dict[str, str]]) -> str:
    lines = [
        "/// Complete current-measure glossary generated from the semantic model and report bindings.",
        "table 'Metric Definitions'",
        "\tlineageTag: 5df1d5f5-183a-454c-9c2d-d0e9070f078a",
        "",
    ]
    for name, data_type, hidden in COLUMNS:
        lines.extend(
            [
                f"\tcolumn {tmdl_name(name)}",
                f"\t\tdataType: {data_type}",
            ]
        )
        if hidden:
            lines.append("\t\tisHidden")
        lines.extend(
            [
                f"\t\tlineageTag: {lineage('Metric Definitions.' + name)}",
                "\t\tsummarizeBy: none",
                f"\t\tsourceColumn: {name}",
            ]
        )
        if name == "Metric":
            lines.append("\t\tsortByColumn: 'Metric Sort'")
        lines.append("")

    lines.extend(
        [
            "\tpartition 'Metric Definitions' = m",
            "\t\tmode: import",
            "\t\tsource =",
            "\t\t\t\tlet",
            (
                "\t\t\t\t\tData = #table({"
                + ", ".join(m_string(name) for name, _, _ in COLUMNS)
                + "}, {"
            ),
        ]
    )
    for index, row in enumerate(rows):
        values = [
            row["sort"],
            m_string(row["category"]),
            m_string(row["metric"]),
            m_string(row["model_table"]),
            m_string(row["display_folder"]),
            m_string(row["visibility"]),
            m_string(row["report_use"]),
            m_string(row["source"]),
            m_string(row["calculation"]),
            m_string(row["definition"]),
            m_string(row["grain"]),
            m_string(row["direction"]),
            m_string(row["caveat"]),
            m_string(row["evidence"]),
        ]
        suffix = "," if index < len(rows) - 1 else ""
        lines.append("\t\t\t\t\t\t{" + ", ".join(values) + "}" + suffix)
    lines.extend(
        [
            "\t\t\t\t\t})",
            "\t\t\t\tin",
            "\t\t\t\t\tData",
            "",
        ]
    )
    return "\n".join(lines)


def update_glossary_visuals(report_root: Path) -> None:
    visual_root = (
        report_root
        / "definition"
        / "pages"
        / "100_glossary"
        / "visuals"
    )
    table_path = visual_root / "glossary_table" / "visual.json"
    table = json.loads(table_path.read_text(encoding="utf-8"))
    table["position"].update({"x": 315, "width": 992})
    fields = [
        ("Metric", "Metric"),
        ("Definition", "Definition"),
        ("Report Use", "Report use"),
        ("Caveat", "Caveat"),
    ]
    projections = []
    for property_name, display_name in fields:
        projections.append(
            {
                "field": {
                    "Column": {
                        "Expression": {
                            "SourceRef": {"Entity": "Metric Definitions"}
                        },
                        "Property": property_name,
                    }
                },
                "queryRef": f"Metric Definitions.{property_name}",
                "nativeQueryRef": property_name,
                "displayName": display_name,
            }
        )
    table["visual"]["query"]["queryState"]["Values"]["projections"] = projections
    headers = table["visual"]["objects"]["columnHeaders"][0]["properties"]
    headers["autoSizeColumnWidth"] = {
        "expr": {"Literal": {"Value": "false"}}
    }
    table["visual"]["objects"]["columnWidth"] = [
        {
            "properties": {
                "value": {"expr": {"Literal": {"Value": f"{width}D"}}}
            },
            "selector": {"metadata": f"Metric Definitions.{property_name}"},
        }
        for property_name, width in (
            ("Metric", 150),
            ("Definition", 330),
            ("Report Use", 190),
            ("Caveat", 260),
        )
    ]
    table["visual"]["objects"]["values"][0]["properties"]["fontSize"] = {
        "expr": {"Literal": {"Value": "9D"}}
    }
    table["visual"]["objects"]["columnHeaders"][0]["properties"]["fontSize"] = {
        "expr": {"Literal": {"Value": "9D"}}
    }
    table["visual"]["objects"]["grid"][0]["properties"]["rowPadding"] = {
        "expr": {"Literal": {"Value": "3D"}}
    }
    table["visual"]["visualContainerObjects"]["title"][0]["properties"][
        "text"
    ] = {
        "expr": {
            "Literal": {
                "Value": "'Complete measure definitions | 117 current measures'"
            }
        }
    }
    table["visual"]["visualContainerObjects"]["general"][0]["properties"][
        "altText"
    ] = {
        "expr": {
            "Literal": {
                "Value": (
                    "'Complete glossary table with one row for every current "
                    "semantic-model measure, including hidden helpers and "
                    "bookmark-only report use.'"
                )
            }
        }
    }
    table_path.write_text(json.dumps(table, indent=2) + "\n", encoding="utf-8")

    info_path = visual_root / "glossary_info" / "visual.json"
    info = json.loads(info_path.read_text(encoding="utf-8"))
    info["position"].update({"x": 59, "width": 240})
    info["visual"]["objects"]["general"][0]["properties"]["paragraphs"][0][
        "textRuns"
    ][0]["value"] = (
        "Complete model contract\n"
        "All 117 current measures are documented, including hidden helpers and "
        "alternate bookmark states. Use Category and Source family to narrow "
        "the table.\n\n"
        "Interpretation boundary\n"
        "Read each result with its displayed period, population, filters, "
        "source coverage, evidence class, and privacy state."
    )
    info_path.write_text(json.dumps(info, indent=2) + "\n", encoding="utf-8")

    for slicer_name in ("glossary_slicer", "glossary_source_slicer"):
        slicer_path = visual_root / slicer_name / "visual.json"
        slicer = json.loads(slicer_path.read_text(encoding="utf-8"))
        slicer["position"].update({"x": 59, "width": 240})
        slicer_path.write_text(
            json.dumps(slicer, indent=2) + "\n", encoding="utf-8"
        )


def validate_required_schema(expressions_path: Path, variant: str) -> None:
    text = expressions_path.read_text(encoding="utf-8-sig")
    required = [
        "Person ID",
        "Organization",
        "Function",
        "Level",
        "Manager Source",
        "Collaboration Hours",
        "Active Connected Hours",
        "Email Hours",
        "Chat Hours",
        "Meeting Hours",
        "Unscheduled Call Hours",
        "After Hours Collaboration",
        "Weekend Collaboration Hours",
        "Collaboration Span",
        "Internal Network Size",
        "External Network Size",
        "Strong Ties",
        "Diverse Ties",
        "Network Outside Organization",
    ]
    missing = [field for field in required if field not in text]
    if missing:
        raise ValueError(f"{variant}: required fields missing: {missing}")
    if not re.search(r'\[(?:Service Name|ServiceName)\]\s*=\s*"Cowork"', text):
        raise ValueError(f"{variant}: exact Cowork service filter is missing")


def synchronize(check: bool) -> None:
    reference_root = ROOT / "src" / "direct-query"
    reference_table_root = (
        reference_root / MODEL_NAME / "definition" / "tables"
    )
    measures = parse_measures(reference_table_root)
    if len(measures) != 117:
        raise ValueError(f"Expected 117 measures, found {len(measures)}")
    if any(not item["description"] for item in measures):
        raise ValueError("Every measure must have a /// description")
    existing = parse_existing_rows(reference_table_root / "Metric Definitions.tmdl")
    usage = report_usage(reference_root / REPORT_NAME)
    rows = build_rows(measures, existing, usage)
    if {row["metric"] for row in rows} != {
        str(item["name"]) for item in measures
    }:
        raise ValueError("Glossary names do not exactly match current measures")
    output = render_tmdl(rows)

    differences: list[str] = []
    for variant in VARIANTS:
        variant_root = ROOT / "src" / variant
        table_root = variant_root / MODEL_NAME / "definition" / "tables"
        variant_measures = parse_measures(table_root)
        if {
            (item["table"], item["name"]) for item in variant_measures
        } != {(item["table"], item["name"]) for item in measures}:
            raise ValueError(f"{variant}: measure contract differs")
        validate_required_schema(
            variant_root / MODEL_NAME / "definition" / "expressions.tmdl",
            variant,
        )
        destination = table_root / "Metric Definitions.tmdl"
        if check:
            if destination.read_text(encoding="utf-8-sig") != output:
                differences.append(str(destination))
        else:
            destination.write_text(output, encoding="utf-8")
            update_glossary_visuals(variant_root / REPORT_NAME)

    if differences:
        raise ValueError(
            "Glossary outputs are not synchronized:\n" + "\n".join(differences)
        )
    print(
        json.dumps(
            {
                "measures": len(measures),
                "rows": len(rows),
                "hiddenMeasures": sum(bool(item["hidden"]) for item in measures),
                "directlyBoundMeasures": len(usage),
                "staleRows": 0,
                "variants": list(VARIANTS),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    arguments = parser.parse_args()
    synchronize(arguments.check)
