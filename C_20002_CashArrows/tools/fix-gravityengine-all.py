#!/usr/bin/env python3
from pathlib import Path

path = Path(__file__).resolve().parent.parent / "assets/scripts/third/gravityengine.mg.cocoscreator.min.ts"
text = path.read_text(encoding="utf-8")
replacements = [
    ("/(.*) \\[([0- 9]+) \\]/", r"/(.*)\[([0-9]+)\]/"),
    ("/ \\^ mailto:([^/].+)/", r"/^mailto:([^/].+)/"),
    ("/ \\^#/", r"/^#/"),
    ("/ \\^\\?/", r"/^\?/"),
    ("/(.*?):? \\/ \\/ (.*)/", r"/(.*?):?\/\/(.*)/"),
    ("/ \\^([^/])/", r"/^([^/])/"),
    ("/ \\/ \\$/", r"/\/$/"),
    ("/ \\^\\[- 0- 9\\]+ \\$/", r"/^[-0-9]+$/"),
    ("/ \\^ \\//", r"/^\//"),
    ("/(.*):([0- 9]+) \\$/", r"/(.*):([0-9]+)$/"),
    ("/ \\^ \\//", r"/^\//"),
    ("/ \\ r \\ n/ g", r"/\\r\\n/g"),
    ("/ \\ r/ g", r"/\\r/g"),
    ("/ \\ s*/ g", r"/\\s*/g"),
    ("/ \\ s/ g", r"/\\s/g"),
    ("/ \\+/ g", r"/\\+/g"),
    ("/[xy]/ g", r"/[xy]/g"),
]
for old, new in replacements:
    text = text.replace(old, new)
path.write_text(text, encoding="utf-8")
print("fixed", path.name)
