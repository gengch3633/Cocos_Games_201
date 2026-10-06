#!/usr/bin/env python3
"""Extended arrow/object/array callback type fixes."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "assets" / "scripts"

# deprecated: no longer add | undefined
CALLBACK_NULL = re.compile(
    r"(\(\([^)]*\)\s*=>\s*[\w.?]+\))\s*\|\s*null(\s*=\s*null\s*;)"
)

# Array<(args) => Ret> = null
ARRAY_ARROW = re.compile(
    r"^(\s+[\w]+:\s*Array<(\([^)]*\)\s*=>\s*[\w.?]+)>)\s*=\s*null\s*;(\s*(?://.*)?)$"
)

# typeof ... = null
TYPEOF_FIELD = re.compile(
    r"^(\s+[\w]+:\s*(typeof\s+[\w.]+))\s*=\s*null\s*;(\s*(?://.*)?)$"
)

# { method: (args) => Ret } = null  (single-line object type)
OBJ_CALLBACK = re.compile(
    r"^(\s+[\w]+:\s*(\{[^}]+\}))\s*=\s*null\s*;(\s*(?://.*)?)$"
)


def fix_content(text: str) -> str:
    lines = text.splitlines()
    out = []
    for line in lines:
        # skip adding | undefined (removed per project convention)
        m = ARRAY_ARROW.match(line)
        if m and "| null" not in m.group(1):
            line = f"{m.group(1)} | null = null;{m.group(3)}"
        m = TYPEOF_FIELD.match(line)
        if m and "| null" not in m.group(1):
            line = f"{m.group(1)} | null = null;{m.group(3)}"
        m = OBJ_CALLBACK.match(line)
        if m and "| null" not in m.group(1) and "=>" in m.group(2):
            line = f"{m.group(1)} | null = null;{m.group(3)}"
        out.append(line)
    return "\n".join(out) + ("\n" if text.endswith("\n") else "")


def main() -> None:
    count = 0
    for p in ROOT.rglob("*.ts"):
        text = p.read_text(encoding="utf-8")
        new = fix_content(text)
        if new != text:
            p.write_text(new, encoding="utf-8")
            count += 1
    print(f"extended callback fixes in {count} files")


if __name__ == "__main__":
    main()
