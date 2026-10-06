import re
from pathlib import Path

ROOT = Path("assets/scripts/third")

REPLACEMENTS = [
    ("/ \\ r \\ n/ g", "/\\r\\n/g"),
    ("/ \\ r/ g", "/\\r/g"),
    ("/ \\ s+/ g", "/\\s+/g"),
    ("/ \\ s\\*/ g", "/\\s*/g"),
    ("/ \\ s/ g", "/\\s/g"),
    ("/, / g", "/,/g"),
    ("/\\[xy\\]/ g", "/[xy]/g"),
    ("/ \\+/ g", "/\\+/g"),
    ("/\\^\\$/ g", "/^\\$/g"),
    ("/ \\^([^/])/", "/^([^/])/"),
    ("/ \\/ \\$/", "/\\$/"),
    ("/ \\^ \\//", "/^\\//"),
    ("/ \\^[- 0-9]+ \\$/", "/^[-0-9]+$/"),
    ("/ \\^([^/])/", "/^([^/])/"),
    ('/ \\ B(? = (\\ d {\\n      3\\n    }\\n)+(? ! \\ d))/ g, ","',
     '/\\B(?=(\\d{3})+(?!\\d))/g, ","'),
    ('x = / ^ \\ $?[a- zA- Z][a- zA- Z0- 9_] {\\n  0,\\n  49\\n}\\n$/',
     'x = /^\\$?[a-zA-Z][a-zA-Z0-9_]{0,49}$/'),
    ('!/ ^.{\\n        1, 64\\n      }\\n      $/.test(e)',
     '!/^.{1,64}$/.test(e)'),
    ('!/ ^.{\\n        1, 64\\n      }\\n      $/.test(e)',
     '!/^.{1,64}$/.test(e)'),
]

def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    text = re.sub(
        r'return Math\.max\(0, Math\.floor\(e\)\)\.toString\(\)\.replace\(\/ \\ B\(\? = \(\\ d \{\s*3\s*\}\s*\)\+\(\? ! \\ d\)\)\/ g, ","\);',
        'return Math.max(0, Math.floor(e)).toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");',
        text,
        flags=re.MULTILINE,
    )
    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False

if __name__ == "__main__":
    changed = []
    for p in ROOT.glob("*.ts"):
        if fix_file(p):
            changed.append(p.name)
    print("fixed", len(changed), "files")
    for name in changed:
        print(" ", name)
