#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cocos Creator 2.4.x 资源解密工具

还原自 libcocos2djs.so 中 cocos2d::FileUtils::getStringFromFile /
getDataFromFile 的解密逻辑。

算法概要:
  1. 读取文件原始字节
  2. 若文件头匹配加密标记 (tag)，则去掉 tag 前缀
  3. 对剩余数据逐字节 XOR，密钥循环使用 (key[i % len(key)])

本项目中 tag/key 来自 project.json:
  "4046241495": "394d66b3329717c61cfcc3fb22799f00"

对应 native 中的两套全局变量 (通常配置为相同值):
  - cocos2d::png_encrypt_flag  + cocos2d::FILE_ENCRYPT_KEY  (优先匹配)
  - cocos2d::_crypto_tag       + cocos2d::_crypto_key       (次优先匹配)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass
class CryptoConfig:
    """一组 tag + key 配置，对应 native 中的一对全局变量。"""

    tag: bytes
    key: bytes
    name: str = ""

    @classmethod
    def from_strings(cls, tag: str, key: str, name: str = "") -> "CryptoConfig":
        return cls(tag=tag.encode("ascii"), key=key.encode("ascii"), name=name)


def xor_decrypt(data: bytes, key: bytes) -> bytes:
    """
    循环 XOR 解密，与 ARM64 汇编 loc_AC00A0 / loc_AC0148 逻辑一致:

        key_index = 0
        for each byte in data:
            if key_index >= len(key):
                key_index = 0
            data[i] ^= key[key_index]
            key_index += 1
    """
    if not data or not key:
        return data

    out = bytearray(data)
    key_len = len(key)
    key_index = 0

    for i in range(len(out)):
        if key_index >= key_len:
            key_index = 0
        out[i] ^= key[key_index]
        key_index += 1

    return bytes(out)


def decrypt_with_config(data: bytes, config: CryptoConfig) -> Optional[bytes]:
    """
    使用指定 tag/key 尝试解密。

    对应 getDataFromFile 中的 memcmp 分支:
      - 文件必须以 tag 开头
      - 去掉 tag 后对 payload 做 XOR
    """
    tag_len = len(config.tag)
    if tag_len == 0 or len(data) <= tag_len:
        return None
    if not data.startswith(config.tag):
        return None

    payload = data[tag_len:]
    return xor_decrypt(payload, config.key)


def decrypt_file_data(
    data: bytes,
    png_config: Optional[CryptoConfig] = None,
    crypto_config: Optional[CryptoConfig] = None,
) -> bytes:
    """
    完整解密流程，对应 FileUtils::getDataFromFile / getStringFromFile。

    按 native 顺序依次尝试:
      1. png_encrypt_flag + FILE_ENCRYPT_KEY
      2. _crypto_tag + _crypto_key

    若均不匹配则原样返回。
    """
    if png_config is not None:
        result = decrypt_with_config(data, png_config)
        if result is not None:
            return result

    if crypto_config is not None:
        result = decrypt_with_config(data, crypto_config)
        if result is not None:
            return result

    return data


def is_encrypted(data: bytes, config: CryptoConfig) -> bool:
    return len(config.tag) > 0 and data.startswith(config.tag)


def load_crypto_from_project(project_path: Path) -> tuple[CryptoConfig, CryptoConfig]:
    """
    从 project.json 读取 tag/key。

    Cocos 构建时会把加密参数写入 project.json，键名为 tag，值为 key。
    """
    with project_path.open("r", encoding="utf-8") as f:
        project = json.load(f)

    tag_key_pairs = [
        (k, v)
        for k, v in project.items()
        if isinstance(k, str) and isinstance(v, str) and k.isdigit() and len(k) >= 8
    ]

    if not tag_key_pairs:
        raise ValueError(f"未在 {project_path} 中找到加密 tag/key 配置")

    tag, key = tag_key_pairs[0]
    png_cfg = CryptoConfig.from_strings(tag, key, name="png_encrypt_flag")
    crypto_cfg = CryptoConfig.from_strings(tag, key, name="_crypto_tag")
    return png_cfg, crypto_cfg


def decrypt_file(
    input_path: Path,
    output_path: Optional[Path] = None,
    png_config: Optional[CryptoConfig] = None,
    crypto_config: Optional[CryptoConfig] = None,
) -> tuple[bytes, bool]:
    """
    解密单个文件。

    Returns:
        (解密后数据, 是否进行了解密)
    """
    raw = input_path.read_bytes()
    original_len = len(raw)
    decrypted = decrypt_file_data(raw, png_config, crypto_config)
    was_encrypted = len(decrypted) != original_len or (
        (png_config and is_encrypted(raw, png_config))
        or (crypto_config and is_encrypted(raw, crypto_config))
    )

    if output_path is not None:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(decrypted)

    return decrypted, was_encrypted


def decrypt_directory(
    src_dir: Path,
    dst_dir: Path,
    png_config: CryptoConfig,
    crypto_config: CryptoConfig,
    extensions: Optional[set[str]] = None,
) -> tuple[int, int, int]:
    """
    批量解密目录。

    Returns:
        (解密文件数, 跳过文件数, 总文件数)
    """
    decrypted_count = 0
    skipped_count = 0
    total_count = 0

    for root, _, files in os.walk(src_dir):
        for filename in files:
            if extensions and Path(filename).suffix.lower() not in extensions:
                continue

            src_path = Path(root) / filename
            if dst_dir == src_dir:
                dst_path = src_path
            else:
                rel_path = src_path.relative_to(src_dir)
                dst_path = dst_dir / rel_path

            total_count += 1
            _, was_encrypted = decrypt_file(
                src_path, dst_path, png_config, crypto_config
            )

            if was_encrypted:
                decrypted_count += 1
            else:
                skipped_count += 1

    return decrypted_count, skipped_count, total_count


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Cocos Creator 2.4.x @assets 资源 XOR 解密工具"
    )
    parser.add_argument(
        "input",
        nargs="?",
        default="assets",
        help="输入文件或目录 (默认: assets)",
    )
    parser.add_argument(
        "-o",
        "--output",
        help="输出文件或目录 (不指定则原地覆盖源文件)",
    )
    parser.add_argument(
        "-p",
        "--project",
        default="project.json",
        help="project.json 路径 (默认: project.json)",
    )
    parser.add_argument(
        "--tag",
        help="手动指定 tag (覆盖 project.json)",
    )
    parser.add_argument(
        "--key",
        help="手动指定 key (覆盖 project.json)",
    )
    parser.add_argument(
        "--ext",
        nargs="*",
        default=[".json", ".png", ".jpg", ".jsc", ".plist", ".txt"],
        help="批量解密时的文件扩展名过滤",
    )
    return parser


def main(argv: Optional[list[str]] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    if args.tag and args.key:
        png_cfg = CryptoConfig.from_strings(args.tag, args.key, "manual_png")
        crypto_cfg = CryptoConfig.from_strings(args.tag, args.key, "manual_crypto")
    else:
        project_path = Path(args.project)
        if not project_path.is_file():
            parser.error(f"找不到 project.json: {project_path}")
        png_cfg, crypto_cfg = load_crypto_from_project(project_path)

    input_path = Path(args.input)

    if input_path.is_file():
        output_path = Path(args.output) if args.output else None
        data, encrypted = decrypt_file(input_path, output_path, png_cfg, crypto_cfg)
        if output_path:
            status = "已解密" if encrypted else "未加密，已复制"
            print(f"{status}: {input_path} -> {output_path}")
        else:
            sys.stdout.buffer.write(data)
        return 0

    if not input_path.is_dir():
        parser.error(f"输入路径不存在: {input_path}")

    dst_dir = Path(args.output) if args.output else input_path
    exts = {e if e.startswith(".") else f".{e}" for e in args.ext}
    dec, skip, total = decrypt_directory(
        input_path, dst_dir, png_cfg, crypto_cfg, exts
    )
    if dst_dir == input_path:
        print(f"完成: 共 {total} 个文件, 解密 {dec} 个, 跳过 {skip} 个 (已覆盖源文件)")
    else:
        print(f"完成: 共 {total} 个文件, 解密 {dec} 个, 跳过 {skip} 个 -> {dst_dir}")
    return 0


# ---------------------------------------------------------------------------
# 本项目的默认配置 (也可通过 project.json 自动加载)
# ---------------------------------------------------------------------------
DEFAULT_TAG = "4046241495"
DEFAULT_KEY = "394d66b3329717c61cfcc3fb22799f00"

DEFAULT_PNG_CONFIG = CryptoConfig.from_strings(
    DEFAULT_TAG, DEFAULT_KEY, name="png_encrypt_flag"
)
DEFAULT_CRYPTO_CONFIG = CryptoConfig.from_strings(
    DEFAULT_TAG, DEFAULT_KEY, name="_crypto_tag"
)


if __name__ == "__main__":
    raise SystemExit(main())
