# -*- coding: utf-8 -*-
path = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third\gravityengine.mg.cocoscreator.min.ts"
with open(path, "r", encoding="utf-8") as f:
    s = f.read()

replacements = [
    ("/ \\ r \\ n/ g", r"/\r\n/g"),
    ("/ \\ r/ g", r"/\r/g"),
    ("/[xy]/ g", r"/[xy]/g"),
    ("/ \\ s*/ g", r"/\s*/g"),
    ("/ \\ s/ g", r"/\s/g"),
    ("/ \\+/ g", r"/\+/g"),
    ("/(.*?) = (.*)/", r"/(.*?)=(.*)/"),
    ("/ ^ mailto:([^/].+)/", r"/^mailto:([^/].+)/"),
    ("/(.*?) \\/ # !(.*)/", r"/(.*?)\/#!(.*)/"),
    ("/(.*?) #(.*)/", r"/(.*?)#(.*)/"),
    ("/ ^ #/", r"/^#/"),
    ("/ ^ \\?/", r"/^\?/"),
    ("/(.*?):? \\/ \\/(.*)/", r"/(.*?):?\/\/(.*)/"),
    ("/ ^([^/])/", r"/^([^/])/"),
    ("/ \\/ $/", r"/\/$/"),
    ("/ ^[- 0- 9]+ $/", r"/^[-0-9]+$/"),
    ("/ ^ \\//", r"/^\//"),
    ("/ ^ \\//, \"\")", r"/^\//, \"\")"),
    (
        'return/ Windows/ i.test(e)?/ Phone/.test(e)|| / WPDesktop/.test(e)? "Windows Phone": "Windows":/(iPhone| iPad| iPod)/.test(e)? "iOS":/ Android/.test(e)? "Android":/(BlackBerry| PlayBook| BB10)/ i.test(e)? "BlackBerry":/ Mac/ i.test(e)? "MacOS":/ Linux/.test(e)? "Linux":/ CrOS/.test(e)? "ChromeOS": "";',
        'return /Windows/i.test(e)?/Phone/.test(e)||/WPDesktop/.test(e)?"Windows Phone":"Windows":/(iPhone|iPad|iPod)/.test(e)?"iOS":/Android/.test(e)?"Android":/(BlackBerry|PlayBook|BB10)/i.test(e)?"BlackBerry":/Mac/i.test(e)?"MacOS":/Linux/.test(e)?"Linux":/CrOS/.test(e)?"ChromeOS":"";',
    ),
]

for old, new in replacements:
    s = s.replace(old, new)

s = s.replace(
    """x = / ^ \\ $?[a- zA- Z][a- zA- Z0- 9_] {
  0,
  49
}
$,""",
    r"x = /^\$?[a-zA-Z][a-zA-Z0-9_]{0,49}$/,",
)

s = s.replace(
    """return !(! f.isString(e)|| !/ ^.{
        1, 64
      }
      $/.test(e))""",
    r"return !(! f.isString(e)|| !/^.{1,64}$/.test(e))",
)

with open(path, "w", encoding="utf-8") as f:
    f.write(s)

print("Fixed gravityengine regex patterns")
