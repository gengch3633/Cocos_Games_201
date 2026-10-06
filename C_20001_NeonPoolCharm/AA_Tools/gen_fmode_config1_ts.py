#!/usr/bin/env python3
"""Generate FModeConfig1.ts from decrypt index.js."""

src_path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20001_NeonPoolCharm\AA_Project_Decrypt\assets\main\index.js"
out_path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20001_NeonPoolCharm\assets\scripts\third\FModeConfig1.ts"

with open(src_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Lines 9754-11111 (1-indexed): t.exports = { ... };
export_lines = lines[9753:11111]
export_text = "".join(export_lines)
export_text = export_text.replace("    t.exports = ", "export default ", 1)

content = export_text.rstrip() + "\n"

with open(out_path, "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print(f"Written {out_path} ({len(content.splitlines())} lines)")
