import re
import os

EXTRACT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\temp_extracted"
OUT_DIR = r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third"

PATH_MAP = {
    "./LoadingAgreementAdapter": "./LoadingAgreementAdapter",
    "./LoadingBaseFlowAdapter": "./LoadingBaseFlowAdapter",
    "./LoadingBootstrapAdapter": "./LoadingBootstrapAdapter",
    "./LoadingHotUpdateAdapter": "./LoadingHotUpdateAdapter",
    "./LoadingMiddleLifecycleAdapter": "./LoadingMiddleLifecycleAdapter",
    "./LoadingSceneProgressAdapter": "./LoadingSceneProgressAdapter",
    "./LoadingSdkAdapter": "./LoadingSdkAdapter",
    "./LoadingAdapterRegistry": "./LoadingAdapterRegistry",
    "../Scene/LoadingAgreementService": "./LoadingAgreementService",
    "../sdk/LoadingAgreementAdapter": "./LoadingAgreementAdapter",
    "../sdk/LoadingBaseFlowAdapter": "./LoadingBaseFlowAdapter",
    "../sdk/LoadingBootstrapAdapter": "./LoadingBootstrapAdapter",
    "../sdk/LoadingHotUpdateAdapter": "./LoadingHotUpdateAdapter",
    "../sdk/LoadingMiddleLifecycleAdapter": "./LoadingMiddleLifecycleAdapter",
    "../sdk/LoadingSceneProgressAdapter": "./LoadingSceneProgressAdapter",
    "../../business-common/report/BusinessAnalyticsService": "./BusinessAnalyticsService",
    "../report/BusinessAnalyticsService": "./BusinessAnalyticsService",
    "../migration-bundle/project-adapter-pack/loading-project-adapters": "./loading-project-adapters",
    "../migration-bundle/business-common/platform/PlatformBridge": "./PlatformBridge",
    "../migration-bundle/business-common/data/ClientDataStore": "./ClientDataStore",
    "../migration-bundle/business-common/data/PlayerDataStore": "./PlayerDataStore",
    "../migration-bundle/business-common/data/SystemDataStore": "./SystemDataStore",
    "../migration-bundle/business-common/data/GameConfigStore": "./GameConfigStore",
    "../migration-bundle/business-common/net/LoadingHttpService": "./LoadingHttpService",
    "../migration-bundle/business-common/language/LanguageHelper": "./LanguageHelper",
    "../migration-bundle/business-common/core/Handler": "./Handler",
    "../migration-bundle/business-common/middle/MiddleHelper": "./MiddleHelper",
    "../migration-bundle/business-common/middle/MiddleManager": "./MiddleManager",
    "../migration-bundle/business-common/report/BusinessAnalyticsService": "./BusinessAnalyticsService",
    "./reusable/i18n/LanguageService": "./LanguageService",
    "./NetErrorPopupService": "./NetErrorPopupService",
    "../../src/framework/Net/RequestQueueEngine": "./RequestQueueEngine",
    "../../src/framework/Net/descriptors/BusinessRequestDescriptors": "./BusinessRequestDescriptors",
    "../../src/framework/Net/RequestDescriptor": "./RequestDescriptor",
    "../core/CryptoHelper": "./CryptoHelper",
    "../data/ClientDataStore": "./ClientDataStore",
    "../data/SystemDataStore": "./SystemDataStore",
    "UserInfoService": "./UserInfoService",
}


def strip_bundle_wrapper(content: str) -> str:
    content = re.sub(r"^[^:]+: \[ function\(e, t(?:, i)?\) \{\n", "", content)
    content = re.sub(r'^"use strict";\n', "", content)
    content = re.sub(r'cc\._RF\.push\([^;]+\);\n', "", content)
    content = re.sub(r"\ncc\._RF\.pop\(\);\n?\}?\s*$", "", content)
    return content


def map_path(path: str) -> str:
    return PATH_MAP.get(path, "./" + path.split("/")[-1])


def module_name(path: str) -> str:
    return map_path(path).split("/")[-1]


def collect_paths(body: str) -> list[str]:
    return sorted(set(re.findall(r'e\("((?:\./|\.\./)[^"]+|[A-Z][A-Za-z0-9_]*)"\)', body)))


def build_imports(paths: list[str]) -> str:
    lines: list[str] = []
    seen: set[str] = set()
    for path in paths:
        mapped = map_path(path)
        if mapped in seen:
            continue
        seen.add(mapped)
        name = module_name(path)
        if name in ("LanguageService",):
            lines.append(f'import * as {name} from "{mapped}";')
        else:
            lines.append(f'import {name} from "{mapped}";')
    return "\n".join(lines)


def replace_e_calls(body: str) -> str:
    def repl(match: re.Match[str]) -> str:
        return module_name(match.group(1))

    return re.sub(r'e\("((?:\./|\.\./)[^"]+|[A-Z][A-Za-z0-9_]*)"\)', repl, body)


def fix_exports(body: str) -> str:
    body = re.sub(r'Object\.defineProperty\(i, "__esModule", \{[\s\S]*?\}\);\n', "", body)
    body = re.sub(r"i\.(\w+)\s*=\s*void 0;\n", "", body)
    body = re.sub(r"export const default\s*=", "export default ", body)
    body = re.sub(r"i\.default\s*=", "export default ", body)
    body = re.sub(r"i\.(\w+)\s*=", r"export const \1 = ", body)
    return body


def fix_cc_helpers(body: str) -> str:
    if "var n = __extends, a = __decorate, o = __awaiter, r = __generator;" in body:
        body = body.replace(
            "var n = __extends, a = __decorate, o = __awaiter, r = __generator;\n",
            "const { __extends, __decorate, __awaiter, __generator } = cc;\nconst n = __extends;\nconst a = __decorate;\nconst o = __awaiter;\nconst r = __generator;\n",
        )
    return body


def replace_module_defaults(body: str, paths: list[str]) -> str:
    for path in paths:
        name = module_name(path)
        body = re.sub(rf"\b{name}\.default\b", name, body)
    return body


def convert(name: str):
    extract_path = os.path.join(EXTRACT_DIR, f"{name}.extract.js")
    with open(extract_path, "r", encoding="utf-8") as f:
        body = strip_bundle_wrapper(f.read())
    paths = collect_paths(body)
    body = replace_e_calls(body)
    body = replace_module_defaults(body, paths)
    body = fix_exports(body)
    body = fix_cc_helpers(body)
    imports = build_imports(paths)
    content = f"// @ts-nocheck\n{imports}\n\n{body}"
    out_path = os.path.join(OUT_DIR, f"{name}.ts")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Wrote {out_path} ({len(content)} chars)")


if __name__ == "__main__":
    for module in ["LoadingHttpService", "LoadingProjectAdaptersBridge"]:
        convert(module)
