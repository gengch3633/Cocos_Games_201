#!/usr/bin/env python3
"""Add parameter types for TS7006 errors reported by tsc."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PARAM_TYPES: dict[str, str] = {
    "start": "number",
    "end": "number",
    "_current": "number",
    "ratio": "number",
    "_start": "number",
    "_end": "number",
    "current": "number",
    "zone": "string",
    "index": "number",
    "sID": "string",
    "name": "string",
    "task": "any",
    "item": "any",
    "conf": "any",
    "node": "cc.Node",
    "ballID": "number",
    "cueId": "number",
    "percent": "number",
    "delta": "number",
    "total": "number",
    "bytesReceived": "number",
    "totalBytesReceived": "number",
    "totalBytesExpected": "number",
    "errorCode": "number",
    "internalCode": "number",
    "errorStr": "string",
    "versionA": "string",
    "versionB": "string",
    "ok": "boolean",
    "msg": "string",
    "success": "boolean",
    "confirmed": "boolean",
    "scene": "cc.SceneAsset",
    "conditionInfo": "any",
    "err": "any",
    "_err": "any",
    "asset": "any",
    "_target": "any",
    "e": "any",
    "t": "any",
    "o": "any",
    "n": "any",
    "i": "any",
    "a": "any",
}


def collect_errors() -> list[tuple[str, int, int, str]]:
    result = subprocess.run(
        "tsc --noEmit",
        cwd=ROOT,
        shell=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    errors: list[tuple[str, int, int, str]] = []
    pat = re.compile(
        r"^(.*?)\((\d+),(\d+)\): error TS7006: Parameter '([^']+)' implicitly has an 'any' type\."
    )
    for line in result.stdout.splitlines() + result.stderr.splitlines():
        m = pat.match(line)
        if m:
            errors.append((m.group(1).replace("\\", "/"), int(m.group(2)), int(m.group(3)), m.group(4)))
    return errors


def add_type_to_param(line: str, col: int, param: str) -> str:
    typ = PARAM_TYPES.get(param, "any")
    pattern = re.compile(rf"\b{re.escape(param)}\b")
    matches = list(pattern.finditer(line))
    if not matches:
        return line
    match = min(matches, key=lambda m: abs(m.start() - (col - 1)))
    end = match.end()
    rest = line[end:]
    if rest.lstrip().startswith(":"):
        return line
    return line[:end] + f": {typ}" + line[end:]


def main() -> None:
    errors = collect_errors()
    by_file: dict[str, list[tuple[int, int, str]]] = {}
    for path, line_no, col, param in errors:
        rel = path
        p = Path(path)
        if p.is_absolute():
            try:
                rel = str(p.relative_to(ROOT))
            except ValueError:
                rel = path
        by_file.setdefault(rel.replace("\\", "/"), []).append((line_no, col, param))

    fixed_files = 0
    for rel, items in by_file.items():
        file_path = ROOT / rel
        if not file_path.exists():
            continue
        lines = file_path.read_text(encoding="utf-8").splitlines()
        changed = False
        for line_no, col, param in sorted(items, key=lambda x: -x[0]):
            idx = line_no - 1
            if 0 <= idx < len(lines):
                new_line = add_type_to_param(lines[idx], col, param)
                if new_line != lines[idx]:
                    lines[idx] = new_line
                    changed = True
        if changed:
            file_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
            fixed_files += 1
    print(f"fixed implicit any in {fixed_files} files ({len(errors)} parameters)")


if __name__ == "__main__":
    main()
