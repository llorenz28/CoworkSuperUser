from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "images" / "report-pages"

FILES = [
    ("Start Here.png", "01-start-here.png"),
    ("Executive Adoption.png", "02-executive-adoption.png"),
    ("Weekly Adoption & Usage.png", "03-weekly-adoption.png"),
    ("Adoption by Attributes.png", "04-adoption-by-attributes.png"),
    ("Habit Movement.png", "05-habit-movement.png"),
    ("Champion Identification.png", "06-champion-identification.png"),
    ("Sessions and Credits.png", "07-sessions-and-credits.png"),
    ("Work Pattern Context.png", "08-work-pattern-context.png"),
    ("Methods and Metric Guide.png", "09-methods-and-metric-guide.png"),
]


def clean_capture(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGB")
    # Remove the Desktop auto-recovery banner and collapsed filter strip.
    cropped = image.crop((0, 29, 1264, 797))
    canvas = Image.new("RGB", (1366, 768), "white")
    canvas.paste(cropped, ((1366 - cropped.width) // 2, 0))
    return canvas


def main(source: Path) -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    frames: list[Image.Image] = []
    for source_name, output_name in FILES:
        image = clean_capture(source / source_name)
        destination = OUTPUT / output_name
        image.save(destination, optimize=True)
        frames.append(image.resize((1024, 576), Image.Resampling.LANCZOS))
        print(destination)

    preview = ROOT / "images" / "CoworkSuperUser.gif"
    frames[0].save(
        preview,
        save_all=True,
        append_images=frames[1:],
        duration=[2200] * len(frames),
        loop=0,
        optimize=True,
    )
    print(preview)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--source",
        type=Path,
        default=ROOT / "validation" / "screenshots",
        help="Directory containing the nine Power BI page screenshots.",
    )
    args = parser.parse_args()
    main(args.source)
