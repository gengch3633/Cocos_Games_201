from pathlib import Path

src = Path(r"assets/scripts/third/I18nPreviewTables.js").read_text(encoding="utf-8")
start = src.index("var i = ")
body = src[start + len("var i = "):]
end = body.rindex(";")
body = body[:end].rstrip()
# body ends with the object; drop trailing assignment leftovers if any
# file shape: var i = { ... };\nt.exports = i;
if body.endswith(";"):
    body = body[:-1].rstrip()
out = "const I18nPreviewTables = " + body + ";\n\nexport default I18nPreviewTables;\n"
Path(r"assets/scripts/third/I18nPreviewTables.ts").write_text(out, encoding="utf-8", newline="\n")
print("wrote", len(out))
