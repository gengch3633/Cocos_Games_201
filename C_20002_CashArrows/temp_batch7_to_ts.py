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
    "../src/sdk/LoadingAdapterRegistry": "./LoadingAdapterRegistry",
    "../business-common/loading-standard-deps": "./loading-standard-deps",
    "./loading-project-adapter-core": "./loading-project-adapter-core",
    "./BusinessCommonConfig": "./BusinessCommonConfig",
    "./core/Handler": "./Handler",
    "./core/EventSystem": "./EventSystem",
    "./data/ClientDataStore": "./ClientDataStore",
    "./data/SystemDataStore": "./SystemDataStore",
    "./data/PlayerDataStore": "./PlayerDataStore",
    "./data/GameConfigStore": "./GameConfigStore",
    "./net/LoadingHttpService": "./LoadingHttpService",
    "./platform/PlatformBridge": "./PlatformBridge",
    "./platform/HotUpdateManager": "./HotUpdateManager",
    "./platform/GlobalErrorHandler": "./GlobalErrorHandler",
    "./ui/UIHelper": "./UIHelper",
    "./language/LanguageHelper": "./LanguageHelper",
    "./middle/MiddleHelper": "./MiddleHelper",
    "./game/GameHelper": "./GameHelper",
    "./reusable/i18n/LanguageService": "./LanguageService",
    "../migration-bundle/business-common/middle/MiddleHelper": "./MiddleHelper",
    "./NetErrorPopupService": "./NetErrorPopupService",
    "unit-base": "./unit-base",
    "mem-pool": "./mem-pool",
    "index": "./index",
}

NAMED_EXPORTS = [
    "initProjectLoadingAdapters",
    "initProjectLoadingAdaptersWithDeps",
    "initProjectLoadingAdaptersWithOverrides",
    "buildStandardDeps",
    "ORDER_IN_LAYER_MAX",
    "SortingLayer",
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
        r'e\("((?:\./|\.\./)[^"]+|[A-Za-z][A-Za-z0-9_-]*)"\)',
        repl,
        body,
    )


def fix_exports_safe(body: str) -> str:
    body = re.sub(r'Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\n', "", body)
    body = re.sub(
        r"^i\.(initProjectLoadingAdaptersWithOverrides|initProjectLoadingAdaptersWithDeps|initProjectLoadingAdapters|buildStandardDeps|ORDER_IN_LAYER_MAX|SortingLayer)\s*=",
        lambda m: f"export const {m.group(1)} =",
        body,
        flags=re.MULTILINE,
    )
    for name in NAMED_EXPORTS:
        body = re.sub(rf"^i\.{name} = void 0;\n", "", body, flags=re.MULTILINE)
    body = re.sub(r"^i\.default\s*=", "export default ", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports\s*=", "export default ", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports = .*;\n", "", body, flags=re.MULTILINE)
    body = re.sub(r"^t\.exports\.default = .*;\n", "", body, flags=re.MULTILINE)
    body = body.replace("__assign", "Object.assign")
    return body


def fix_cc_helpers(body: str) -> str:
    replacements = [
        (
            r"var n = __extends, a = __decorate;\n",
            "const { __extends, __decorate } = cc;\nconst n = __extends;\nconst a = __decorate;\n",
        ),
        (
            r"var n = __decorate;\n",
            "const { __decorate } = cc;\nconst n = __decorate;\n",
        ),
        (
            r"var n = __extends, a = __awaiter, o = __generator;\n",
            "const { __extends, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __awaiter;\nconst o = __generator;\n",
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


def convert_sorting_define() -> str:
    return """export enum SortingLayer {
    DEFAULT = 0,
    Map1 = 1,
    Map2 = 2,
    Map3 = 3,
    Monster = 100,
    MonsterBoss = 200,
    MonterUpgrade = 250,
    Tower = 300,
    HP = 400,
}

export const ORDER_IN_LAYER_MAX = 100000;
"""


def convert_time() -> str:
    return """// @ts-nocheck
const { __extends, __decorate } = cc;
const n = __extends;
const a = __decorate;
const o = cc._decorator;
const r = o.ccclass;

export default class Time extends cc.Component {
    start() {
        cc.game.addPersistRootNode(this.node);
    }

    update() {}
}

a([r], Time);
"""


def convert_ts_module() -> str:
    return """// @ts-nocheck
export {};
"""


def convert_render_component() -> str:
    return """// @ts-nocheck
console.log("空文件");
"""


def convert_node() -> str:
    return """// @ts-nocheck
import { NodeMemPool } from "./index";

void NodeMemPool;

if (!("sortingPriority" in cc.Node.prototype)) {
    Object.defineProperty(cc.Node.prototype, "sortingPriority", {
        get: function () {
            return this._sortingPriority;
        },
        set: function (value) {
            this._sortingPriority = value;
        },
        enumerable: true,
    });
    Object.defineProperty(cc.Node.prototype, "sortingEnabled", {
        get: function () {
            return this._sortingEnabled;
        },
        set: function (value) {
            this._sortingEnabled = value;
        },
        enumerable: true,
    });
}
"""


def convert_loading_project_adapters(body: str) -> str:
    body = replace_e_calls_batch(body)
    body = fix_exports_safe(body)
    return """// @ts-nocheck
import { applyLoadingAdapterOverrides } from "./LoadingAdapterRegistry";
import { createLoadingProjectAdapterOverrides } from "./loading-project-adapter-core";
import * as loadingStandardDeps from "./loading-standard-deps";

""" + body.replace("n.applyLoadingAdapterOverrides", "applyLoadingAdapterOverrides").replace(
        "a.createLoadingProjectAdapterOverrides", "createLoadingProjectAdapterOverrides"
    ).replace("o.buildStandardDeps", "loadingStandardDeps.buildStandardDeps")


HAND_WRITTEN = {
    "sortingDefine": convert_sorting_define,
    "time": convert_time,
    "ts": convert_ts_module,
    "render-component": convert_render_component,
    "node": convert_node,
}

EXTRACT_STANDARD = [
    "loading-project-adapters",
    "loading-standard-deps",
    "macCopy",
    "mem-pool",
    "netErrorView",
    "noMacScript",
    "node-mem-pool",
    "node-unit",
    "render-flow",
    "resultView",
    "snake",
    "spine-assembler",
    "unit-base",
    "withMoodView",
    "ylEvent",
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

    body = load_extract("loading-project-adapters")
    write("loading-project-adapters", convert_loading_project_adapters(body))

    for name in EXTRACT_STANDARD:
        if name == "loading-project-adapters":
            continue
        write(name, convert_standard(name, load_extract(name)))


if __name__ == "__main__":
    main()
