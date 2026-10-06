#!/usr/bin/env python3
"""Wrap arrow-function field types in parentheses and add | null for = null init."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "assets" / "scripts"

# callback: (args) => Ret = null  ->  callback: ((args) => Ret) | null = null
FIELD_ARROW = re.compile(
    r"^(\s+(?:static\s+|private\s+|public\s+|protected\s+)*)([\w]+):\s*"
    r"(\([^)]*\)\s*=>\s*[\w.?]+(?:\[\])?)\s*=\s*null\s*;(\s*(?://.*)?)$"
)

# Already fixed form should be skipped
ALREADY_FIXED = re.compile(r"\(\([^)]*\)\s*=>\s*")


def fix_line(line: str) -> str:
    if ALREADY_FIXED.search(line):
        return line
    m = FIELD_ARROW.match(line)
    if not m:
        return line
    prefix, name, fn_type, suffix = m.group(1), m.group(2), m.group(3), m.group(4)
    return f"{prefix}{name}: ({fn_type}) = null;{suffix}"


def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    out = [fix_line(l) for l in lines]
    new_text = "\n".join(out) + ("\n" if text.endswith("\n") else "")
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main() -> None:
    count = sum(1 for p in ROOT.rglob("*.ts") if fix_file(p))
    print(f"fixed arrow callback fields in {count} files")


if __name__ == "__main__":
    main()
