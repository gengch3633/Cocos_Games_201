import re
import os

EXTRACT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\temp_extracted"
OUT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third"

PATH_MAP = {
    "../BusinessCommonConfig": "./BusinessCommonConfig",
    "../data/ClientDataStore": "./ClientDataStore",
    "../data/PlayerDataStore": "./PlayerDataStore",
    "../data/SystemDataStore": "./SystemDataStore",
    "../core/CryptoHelper": "./CryptoHelper",
    "./HotUpdateManager": "./HotUpdateManager",
    "./ConfigMgr": "./ConfigMgr",
    "./Launch": "./Launch",
    "./SceneMgr": "./SceneMgr",
    "./UIMgr": "./UIMgr",
    "./Utils": "./Utils",
    "./UserData": "./UserData",
    "./UIDefine": "./UIDefine",
    "./LoadingProjectAdaptersBridge": "./LoadingProjectAdaptersBridge",
    "./UiPageAnalyticsService": "./UiPageAnalyticsService",
    "./AppReviewManager": "./AppReviewManager",
    "./reusable/i18n/LanguageService": "./LanguageService",
    "./reusable/i18n/CurrencyFormatService": "./CurrencyFormatService",
    "./LanguageService": "./LanguageService",
    "./CurrencyFormatService": "./CurrencyFormatService",
    "./I18nPreviewTables": "./I18nPreviewTables",
    "./CountryAssetService": "./CountryAssetService",
    "../migration-bundle/src/Scene/LoadingUmpDialogService": "./LoadingUmpDialogService",
    "../migration-bundle/business-common/net/LoadingHttpService": "./LoadingHttpService",
    "../migration-bundle/business-common/data/PlayerDataStore": "./PlayerDataStore",
    "../migration-bundle/business-common/core/Handler": "./Handler",
    "../migration-bundle/business-common/platform/PlatformBridge": "./PlatformBridge",
    "../migration-bundle/business-common/data/ClientDataStore": "./ClientDataStore",
    "../migration-bundle/business-common/report/BusinessAnalyticsService": "./BusinessAnalyticsService",
    "../migration-bundle/business-common/middle/MiddleHelper": "./MiddleHelper",
    "../../GlobalEventMgr": "./GlobalEventMgr",
    "../../InterfaceMgr": "./InterfaceMgr",
    "../../ConfigMgr": "./ConfigMgr",
    "../ArchiveMgr": "./ArchiveMgr",
    "../ConfigMgr": "./ConfigMgr",
    "../MultiPlatform": "./MultiPlatform",
    "../UMengManger": "./UMengManger",
    "../ResMgr": "./ResMgr",
    "../Singleton": "./Singleton",
    "../ClickAudio": "./ClickAudio",
    "../Tips": "./Tips",
    "ArchiveMgr": "./ArchiveMgr",
    "ConfigMgr": "./ConfigMgr",
    "MultiPlatform": "./MultiPlatform",
    "UMengManger": "./UMengManger",
    "ResMgr": "./ResMgr",
    "Singleton": "./Singleton",
    "ClickAudio": "./ClickAudio",
    "Tips": "./Tips",
    "GlobalEventMgr": "./GlobalEventMgr",
    "InterfaceMgr": "./InterfaceMgr",
    "ListItem": "./ListItem",
    "Obstacle": "./Obstacle",
    "RVOMath": "./RVOMath",
    "Simulator": "./Simulator",
    "Vector2": "./Vector2",
    "GEMgr": "./GEMgr",
    "./GEMgr": "./GEMgr",
}

LOADING_VAR_MAP = {
    "l": "ConfigMgr",
    "c": "Launch",
    "u": "SceneMgr",
    "d": "UIMgr",
    "h": "Utils",
    "p": "UserData",
    "_": "UIDefine",
    "f": "LoadingProjectAdaptersBridge",
    "g": "UiPageAnalyticsService",
    "m": "AppReviewManager",
    "y": "LanguageService",
    "v": "CurrencyFormatService",
    "b": "LoadingUmpDialogService",
    "w": "LoadingHttpService",
    "k": "PlayerDataStore",
    "S": "Handler",
    "C": "PlatformBridge",
    "T": "ClientDataStore",
}


def strip_bundle_wrapper(content: str) -> str:
    content = re.sub(r"^[^:]+: \[ function\(e, t(?:, i)?\) \{\n", "", content)
    content = re.sub(r'^"use strict";\n', "", content)
    content = re.sub(r'cc\._RF\.push\([^;]+\);\n', "", content)
    content = re.sub(r"\ncc\._RF\.pop\(\);\n?\}?\s*$", "", content)
    return content


def map_path(path: str) -> str:
    mapped = PATH_MAP.get(path, path)
    if not mapped.startswith("."):
        mapped = "./" + mapped.split("/")[-1]
    return mapped


def module_name_for_path(path: str) -> str:
    return map_path(path).split("/")[-1]


def collect_paths(body: str) -> list[str]:
    return sorted(
        set(
            re.findall(
                r'e\("((?:\./|\.\./)[^"]+|[A-Z][A-Za-z0-9_]*)"\)',
                body,
            )
        )
    )


def build_imports(paths: list[str]) -> str:
    lines: list[str] = []
    seen: set[str] = set()
    for path in paths:
        mapped = map_path(path)
        name = module_name_for_path(path)
        if mapped in seen:
            continue
        seen.add(mapped)
        if name in ("LanguageService", "CurrencyFormatService"):
            lines.append(f'import * as {name} from "{mapped}";')
        else:
            lines.append(f'import {name} from "{mapped}";')
    return "\n".join(lines)


def replace_e_calls(body: str) -> str:
    def repl(match: re.Match[str]) -> str:
        return module_name_for_path(match.group(1))

    return re.sub(
        r'e\("((?:\./|\.\./)[^"]+|[A-Z][A-Za-z0-9_]*)"\)',
        repl,
        body,
    )


def fix_exports(body: str) -> str:
    body = re.sub(r'Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\n', "", body)
    body = re.sub(r"i\.AbsAdapter = i\.Pager = void 0;\n", "", body)
    body = re.sub(r"export const default\s*=", "export default ", body)
    body = re.sub(r"i\.default\s*=", "export default ", body)
    body = re.sub(r"i\.(\w+)\s*=", r"export const \1 = ", body)
    return body


def fix_cc_helpers(body: str) -> str:
    body = re.sub(
        r"var n, a, o, r = __extends, s = __decorate;\n",
        "const { __extends, __decorate } = cc;\nconst r = __extends;\nconst s = __decorate;\nlet n, a, o;\n",
        body,
    )
    body = re.sub(
        r"var n = __extends, a = __decorate, o = __awaiter, r = __generator;\n",
        "const { __extends, __decorate, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __decorate;\nconst o = __awaiter;\nconst r = __generator;\n",
        body,
    )
    return body


def fix_listview_aliases(body: str) -> str:
    for short, module in {"s": "ResMgr", "l": "ClickAudio"}.items():
        body = re.sub(rf"\b{short}\.default\b", module, body)
        body = re.sub(rf"\b{short}\.", f"{module}.", body)
    return body


def remove_require_declarations(body: str) -> str:
    body = re.sub(
        r"var s = ResMgr, l = ClickAudio, c = cc\.Component, u = cc\._decorator, d = u\.ccclass, h = u\.property, p = u\.menu, _ = function\(e\) \{\n",
        "const c = cc.Component;\nconst u = cc._decorator;\nconst d = u.ccclass;\nconst h = u.property;\nconst p = u.menu;\nvar _ = function(e) {\n",
        body,
    )
    body = re.sub(
        r"var l = cc\._decorator, c = l\.ccclass, u = l\.property, d = l\.disallowMultiple, h = l\.menu, p = l\.executionOrder, _ = l\.requireComponent, f = ListItem;\n",
        "const l = cc._decorator;\nconst c = l.ccclass;\nconst u = l.property;\nconst d = l.disallowMultiple;\nconst h = l.menu;\nconst p = l.executionOrder;\nconst _ = l.requireComponent;\n",
        body,
    )
    return body


def fix_loading_for_loop(body: str) -> str:
    body = re.sub(
        r"for \(var l = ConfigMgr, c = Launch, u = SceneMgr, d = UIMgr, h = Utils, p = \(GEMgr,\s*UserData\), _ = UIDefine, f = LoadingProjectAdaptersBridge, g = UiPageAnalyticsService, m = AppReviewManager, y = LanguageService, v = CurrencyFormatService, b = LoadingUmpDialogService, w = LoadingHttpService, k = PlayerDataStore, S = Handler, C = PlatformBridge, T = ClientDataStore, N = \[",
        "const N = [",
        body,
        count=1,
    )
    body = re.sub(
        r"\], I = 0, A = 0; A < N\.length; A\+\+\) I \+= N\[A\]\.weight;",
        "];\nlet I = 0;\nfor (let A = 0; A < N.length; A++) I += N[A].weight;",
        body,
        count=1,
    )
    module_default_patterns = {
        "l.default": "ConfigMgr",
        "c.default": "Launch",
        "u.default": "SceneMgr",
        "d.default": "UIMgr",
        "h.default": "Utils",
        "p.default": "UserData",
        "m.default": "AppReviewManager",
        "g.default": "UiPageAnalyticsService",
        "w.default": "LoadingHttpService",
        "S.default": "Handler",
        "k.default": "PlayerDataStore",
    }
    for source, target in module_default_patterns.items():
        body = body.replace(source, target)
    body = body.replace("f.initProjectLoadingAdapters", "LoadingProjectAdaptersBridge.initProjectLoadingAdapters")
    body = body.replace("y.init()", "LanguageService.init()")
    body = body.replace("y.setByCountryCode", "LanguageService.setByCountryCode")
    body = body.replace("g.init()", "UiPageAnalyticsService.init()")
    body = body.replace("g.trackEnter", "UiPageAnalyticsService.trackEnter")
    body = body.replace("g.trackLeave", "UiPageAnalyticsService.trackLeave")
    body = body.replace("_.UILayer", "UIDefine.UILayer")
    body = re.sub(r"\bb && b\.default\b", "LoadingUmpDialogService", body)
    body = re.sub(r"\bC && C\.default \? C\.default : C\b", "PlatformBridge", body)
    body = re.sub(r"\bT && T\.default \? T\.default : T\b", "ClientDataStore", body)
    return body


def convert_i18n_preview(body: str) -> str:
    match = re.search(r"var i = (\{[\s\S]*\});\s*\nt\.exports", body)
    if not match:
        raise ValueError("Could not find I18nPreviewTables data object")
    return f"const I18nPreviewTables = {match.group(1)};\n\nexport default I18nPreviewTables;\n"


def convert_component(name: str, body: str) -> str:
    paths = collect_paths(body)
    body = replace_e_calls(body)
    body = fix_exports(body)
    body = fix_cc_helpers(body)
    body = remove_require_declarations(body)
    if name == "Loading":
        body = fix_loading_for_loop(body)
    if name == "ListView":
        body = fix_listview_aliases(body)
    imports = build_imports(paths)
    return f"// @ts-nocheck\n{imports}\n\n{body}"


def convert(name: str):
    extract_path = os.path.join(EXTRACT_DIR, f"{name}.extract.js")
    if not os.path.exists(extract_path):
        print(f"SKIP missing {name}")
        return
    with open(extract_path, "r", encoding="utf-8") as f:
        body = strip_bundle_wrapper(f.read())

    if name == "I18nPreviewTables":
        content = convert_i18n_preview(body)
    else:
        content = convert_component(name, body)

    out_path = os.path.join(OUT_DIR, f"{name}.ts")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Wrote {out_path} ({len(content)} chars)")


if __name__ == "__main__":
    for module in ["List", "ListView", "Loading", "I18nPreviewTables"]:
        convert(module)
