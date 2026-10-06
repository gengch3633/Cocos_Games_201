# -*- coding: utf-8 -*-
import os
from convert_lib_js_to_ts import strip_cc_boilerplate

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "scripts", "third")
js_path = os.path.join(ROOT, "_process.js")
ts_path = os.path.join(ROOT, "_process.ts")
with open(js_path, "r", encoding="utf-8", errors="ignore") as handle:
    body = strip_cc_boilerplate(handle.read())
body = body.replace("d = t.exports = {", "const process = {").replace("d.", "process.")
with open(ts_path, "w", encoding="utf-8", newline="\n") as handle:
    handle.write("// @ts-nocheck\nexport = process;\n" + body)

print(f"Wrote {ts_path}")
