#!/usr/bin/env python3
"""Fix syntax errors that break Cocos Creator web-mobile build."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "assets" / "scripts"

OPERATOR_FIXES = [
    ("| =", "|="),
    ("& =", "&="),
    ("^ =", "^="),
]

REGEX_FIXES = [
    ("/, / g", "/,/g"),
    ("/ \\ r \\ n/ g", "/\\r\\n/g"),
    ("/ \\ r/ g", "/\\r/g"),
    ("/ \\ s*/ g", "/\\s*/g"),
    ("/ \\ s/ g", "/\\s/g"),
    ("/ \\+/ g", "/\\+/g"),
    ("/[xy]/ g", "/[xy]/g"),
    ("/ \\^ mailto:([^/].+)/", "/^mailto:([^/].+)/"),
    ("/ \\^#/", "/^#/"),
    ("/ \\^\\?/", "/^\\?/"),
    ("/ \\^([^/])/", "/^([^/])/"),
    ("/ \\/ \\$/", "/\\/$/"),
    ("/ \\^ \\//", "/^\\//"),
    ("/ \\^ \\$/", "/^\\$/"),
    ("/ \\^\\[- 0- 9\\]+ \\$/", "/^[-0-9]+$/"),
    ("/(.*?) = (.*)/", "/(.*?)=(.*)/"),
    ("/(.*?) \\?(.*)/", "/(.*?)\\?(.*)/"),
    ("/(.*?):? \\/ \\/ (.*)/", "/(.*?):?\\/\\/(.*)/"),
    ("/(.*?) \\/ # !(.*)/", "/(.*?)\\/#!(.*)/"),
    ("/(.*?) \\.(.*)/", "/(.*?)\\.(.*)/"),
    ("return/ Windows/ i", "return/Windows/i"),
    ("/ Phone/", "/Phone/"),
    ("/ WPDesktop/", "/WPDesktop/"),
    ("/(iPhone| iPad| iPod)/", "/(iPhone|iPad|iPod)/"),
    ("/ Android/", "/Android/"),
    ("/(BlackBerry| PlayBook| BB10)/ i", "/(BlackBerry|PlayBook|BB10)/i"),
    ("/ Mac/ i", "/Mac/i"),
    ("/ Linux/", "/Linux/"),
    ("/ CrOS/", "/CrOS/"),
]

MULTILINE_FIXES = [
    (
        """.replace(/ \\ B(? = (\\ d {
      3
    }
)+(? ! \\ d))/ g, ",")""",
        """.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")""",
    ),
    (
        """.replace(/ \\ B(? = (\\ d {
      3
    }
)+(? ! \\ d))/ g, ".")""",
        """.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".")""",
    ),
    (
        """.replace(/ \\ B(? = (\\ d {
      3
    }
)+(? ! \\ d))/ g, i)""",
        """.replace(/\\B(?=(\\d{3})+(?!\\d))/g, i)""",
    ),
    (
        """.replace(/ \\ B(? = (\\ d {
      3
    }
)+(? ! \\ d))/ g, i.group)""",
        """.replace(/\\B(?=(\\d{3})+(?!\\d))/g, i.group)""",
    ),
    (
        """.replace(/ \\ B(? = (\\ d {
      3
    }
)+(? ! \\ d))/ g, r)""",
        """.replace(/\\B(?=(\\d{3})+(?!\\d))/g, r)""",
    ),
    (
        """x = / ^ \\$?\\[a- zA- Z\\]\\[a- zA- Z0- 9_\\] {
  0,
  49
}
$/,""",
        """x = /^\\$?[a-zA-Z][a-zA-Z0-9_]{0,49}$/,""",
    ),
    (
        """return !(! f.isString(e)|| !/ \\^.{
        1, 64
      }
      $/.test(e))||""",
        """return !(!f.isString(e)||!/^.{1,64}$/.test(e))||""",
    ),
]


def fix_text(text: str) -> str:
    for old, new in OPERATOR_FIXES + REGEX_FIXES:
        text = text.replace(old, new)
    for old, new in MULTILINE_FIXES:
        text = text.replace(old, new)
    return text


def main():
    changed = []
    for path in sorted(SCRIPTS.rglob("*.ts")):
        original = path.read_text(encoding="utf-8")
        updated = fix_text(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))
    print(f"fixed {len(changed)} ts files")
    for item in changed:
        print(f"  {item}")


if __name__ == "__main__":
    main()
