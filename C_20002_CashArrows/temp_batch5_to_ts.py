import os
import re

from temp_js_to_ts import (
    collect_paths,
    map_path,
    module_name_for_path,
    strip_bundle_wrapper,
)

EXTRACT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\temp_extracted"
OUT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third"

EXTRA_PATH_MAP = {
    "../BusinessCommonConfig": "./BusinessCommonConfig",
    "../core/EventSystem": "./EventSystem",
    "../migration-bundle/business-common/report/BusinessAnalyticsService": "./BusinessAnalyticsService",
    "../migration-bundle/business-common/net/LoadingHttpService": "./LoadingHttpService",
    "../migration-bundle/business-common/core/Handler": "./Handler",
    "../migration-bundle/business-common/data/PlayerDataStore": "./PlayerDataStore",
    "../../src/framework/Platform/NativeSdkBridgeAdapter": "./NativeSdkBridgeAdapter",
    "./reusable/i18n/LanguageService": "./LanguageService",
    "./UIMgr": "./UIMgr",
}

NAMED_EXPORTS = [
    "SMap",
    "AgentCfg",
    "SortingGroup",
    "SpinePreviewComponent",
    "PlatformType",
    "UILayer",
    "Position",
    "TypedEventTarget",
    "UIParams",
    "Direction",
    "AnimationType",
    "AnimationAppearanceType",
    "UIConfig",
    "DestroyStrategy",
    "nonSerialized",
]


def map_path_batch(path: str) -> str:
    if path in EXTRA_PATH_MAP:
        return EXTRA_PATH_MAP[path]
    mapped = map_path(path)
    if not mapped.startswith("."):
        mapped = "./" + mapped.split("/")[-1]
    return mapped


def build_imports_batch(paths: list[str]) -> str:
    lines: list[str] = []
    seen: set[str] = set()
    for path in paths:
        mapped = map_path_batch(path)
        name = module_name_for_path(path)
        if mapped in seen:
            continue
        seen.add(mapped)
        if name in ("LanguageService", "CurrencyFormatService", "BusinessCommonConfig"):
            lines.append(f'import * as {name} from "{mapped}";')
        else:
            lines.append(f'import {name} from "{mapped}";')
    return "\n".join(lines)


def replace_e_calls_batch(body: str) -> str:
    def repl(match: re.Match[str]) -> str:
        return module_name_for_path(match.group(1))

    return re.sub(
        r'e\("((?:\./|\.\./)[^"]+|[A-Za-z][A-Za-z0-9_]*)"\)',
        repl,
        body,
    )


def fix_exports_safe(body: str) -> str:
    body = re.sub(r'Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\n', "", body)
    for name in NAMED_EXPORTS:
        body = re.sub(rf"^i\.{name} = void 0;\n", "", body, flags=re.MULTILINE)
        body = re.sub(rf"^i\.{name}\s*=", f"export const {name} =", body, flags=re.MULTILINE)
    body = re.sub(r"^i\.default\s*=", "export default ", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports = .*;\n", "", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports\.default = .*;\n", "", body, flags=re.MULTILINE)
    return body


def fix_cc_helpers(body: str) -> str:
    replacements = [
        (
            r"var n = __spreadArrays;\n",
            "const { __spreadArrays } = cc;\nconst n = __spreadArrays;\n",
        ),
        (
            r"var n = __decorate, a = __spreadArrays;\n",
            "const { __decorate, __spreadArrays } = cc;\nconst n = __decorate;\nconst a = __spreadArrays;\n",
        ),
        (
            r"var n = __extends, a = __decorate;\n",
            "const { __extends, __decorate } = cc;\nconst n = __extends;\nconst a = __decorate;\n",
        ),
        (
            r"var n = __extends, a = __awaiter, o = __generator;\n",
            "const { __extends, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __awaiter;\nconst o = __generator;\n",
        ),
        (
            r"var n, a = __extends, o = __awaiter, r = __generator;\n",
            "const { __extends, __awaiter, __generator } = cc;\nlet n;\nconst a = __extends;\nconst o = __awaiter;\nconst r = __generator;\n",
        ),
        (
            r"var n = __extends, a = __decorate, o = __awaiter, r = __generator;\n",
            "const { __extends, __decorate, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __decorate;\nconst o = __awaiter;\nconst r = __generator;\n",
        ),
        (
            r"var n, a, o, r = __extends, s = __decorate;\n",
            "const { __extends, __decorate } = cc;\nconst r = __extends;\nconst s = __decorate;\nlet n, a, o;\n",
        ),
        (
            r"var n = __extends;\n",
            "const { __extends } = cc;\nconst n = __extends;\n",
        ),
    ]
    for pattern, replacement in replacements:
        body = re.sub(pattern, replacement, body)
    return body


def convert_standard(name: str, body: str) -> str:
    paths = collect_paths(body)
    body = replace_e_calls_batch(body)
    body = fix_exports_safe(body)
    body = fix_cc_helpers(body)
    imports = build_imports_batch(paths)
    header = f"// @ts-nocheck\n{imports}\n\n" if imports else "// @ts-nocheck\n\n"
    return header + body


def convert_time_scale() -> str:
    return """// @ts-nocheck

cc.director.timeScale = 1;
const originalCalculateDeltaTime = cc.Director.prototype.calculateDeltaTime;
cc.Director.prototype.calculateDeltaTime = function (now) {
    originalCalculateDeltaTime.call(this, now);
    this._deltaTime *= this.timeScale;
};
"""


def convert_toggle_event() -> str:
    return """// @ts-nocheck

cc.js.mixin(cc.Toggle, {
    EventType: {
        TOGGLE: "toggle",
    },
});
"""


def convert_url() -> str:
    return """export default class URL {
    static parse(base: string, ...parts: Array<string | null | undefined>): string {
        const segments = [base, ...parts]
            .filter((part) => part != null)
            .map((part) => {
                let value = String(part);
                if (value.startsWith("/")) {
                    value = value.substring(1);
                }
                if (value.endsWith("/")) {
                    value = value.substring(0, value.length - 1);
                }
                return value;
            });
        return segments.join("/");
    }

    static isHttpUrl(value: string): boolean {
        return !!value && (value.indexOf("http://") === 0 || value.indexOf("https://") === 0);
    }
}
"""


HAND_WRITTEN = {
    "TimeScale": convert_time_scale,
    "ToggleEvent": convert_toggle_event,
    "URL": convert_url,
}

STANDARD = [
    "TemplateListView",
    "Tips",
    "TweenScale",
    "TypeWriter",
    "TypedEvent",
    "UIAnimation",
    "UIDefine",
    "UIHelper",
    "UIMgr",
    "UIParams",
    "UMengManger",
    "UiPageAnalyticsService",
    "UserArchive",
    "UserAudioData",
    "UserData",
    "UserInfoService",
    "UserWatch",
]


def write(name: str, content: str) -> None:
    out_path = os.path.join(OUT_DIR, f"{name}.ts")
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content.rstrip() + "\n")
    print(f"Wrote {out_path} ({len(content)} chars)")


def load_extract(name: str) -> str:
    path = os.path.join(EXTRACT_DIR, f"{name}.extract.js")
    with open(path, "r", encoding="utf-8") as f:
        return strip_bundle_wrapper(f.read())


def main() -> None:
    for name, builder in HAND_WRITTEN.items():
        write(name, builder())

    for name in STANDARD:
        write(name, convert_standard(name, load_extract(name)))


if __name__ == "__main__":
    main()
