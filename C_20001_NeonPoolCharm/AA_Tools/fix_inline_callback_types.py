#!/usr/bin/env python3
"""Fix common inline arrow callback parameter patterns."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "assets" / "scripts"

REPLACEMENTS = [
    (
        r"progress:\s*\(start,\s*end,\s*_current,\s*ratio\)\s*=>",
        "progress: (start: number, end: number, _current: number, ratio: number) =>",
    ),
    (
        r"onUpdate:\s*\(_target,\s*ratio\)\s*=>",
        "onUpdate: (_target: any, ratio: number) =>",
    ),
    (
        r"\.findIndex\(\(zone\)\s*=>\s*zone\.toUpperCase\(\)",
        ".findIndex((zone: string) => zone.toUpperCase()",
    ),
    (
        r"\.filter\(\s*\(task\)\s*=>",
        ".filter((task: any) =>",
    ),
    (
        r"\.forEach\(\(conf,\s*index\)\s*=>",
        ".forEach((conf: any, index: number) =>",
    ),
    (
        r"\.find\(\(item\)\s*=>",
        ".find((item: any) =>",
    ),
    (
        r"onUpdate:\s*\(_start,\s*current,\s*_end,\s*ratio\)\s*=>",
        "onUpdate: (_start: number, current: number, _end: number, ratio: number) =>",
    ),
]


def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    new = text
    for pat, rep in REPLACEMENTS:
        new = re.sub(pat, rep, new)
    if new != text:
        path.write_text(new, encoding="utf-8")
        return True
    return False


def main() -> None:
    count = sum(1 for p in ROOT.rglob("*.ts") if fix_file(p))
    print(f"fixed inline callback patterns in {count} files")


if __name__ == "__main__":
    main()
