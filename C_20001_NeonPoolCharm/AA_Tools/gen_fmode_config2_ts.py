#!/usr/bin/env python3
"""Generate FModeConfig2.ts from decrypt index.js."""

src_path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20001_NeonPoolCharm\AA_Project_Decrypt\assets\main\index.js"
out_path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20001_NeonPoolCharm\assets\scripts\third\FModeConfig2.ts"

with open(src_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Lines 11118-14363 (1-indexed): t.exports = { ... };
export_lines = lines[11117:14363]
export_text = "".join(export_lines)
export_text = export_text.replace("    t.exports = ", "export default ", 1)

content = export_text.rstrip() + "\n"

with open(out_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print(f"Written {out_path} ({len(content.splitlines())} lines)")
