'use strict';

Editor.Panel.extend({
    style: `
        :host {
            display: flex;
            flex-direction: column;
            padding: 10px;
            box-sizing: border-box;
            height: 100%;
            overflow: hidden;
        }
        h2 {
            margin: 0 0 6px 0;
            font-size: 16px;
        }
        .desc {
            color: #999;
            font-size: 12px;
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .toolbar {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
            flex-shrink: 0;
        }
        .summary {
            font-size: 12px;
            margin-bottom: 8px;
            color: #ccc;
            flex-shrink: 0;
        }
        .list-wrap {
            flex: 1;
            overflow: auto;
            border: 1px solid #444;
            background: #252525;
            padding: 6px;
        }
        .category-block {
            margin-bottom: 10px;
        }
        .category-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 2px;
            border-bottom: 1px solid #444;
            margin-bottom: 4px;
            font-size: 13px;
            font-weight: bold;
            color: #eee;
        }
        .category-header label {
            cursor: pointer;
            user-select: none;
        }
        .pair-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 4px 2px 4px 18px;
            font-size: 12px;
            color: #ccc;
            line-height: 1.4;
        }
        .pair-item:hover {
            background: #2f2f2f;
        }
        .pair-item input {
            margin-top: 2px;
            flex-shrink: 0;
        }
        .pair-main {
            flex: 1;
            min-width: 0;
        }
        .pair-name {
            color: #fff;
            font-weight: bold;
        }
        .pair-meta {
            color: #888;
            font-size: 11px;
            word-break: break-all;
        }
        .log {
            height: 80px;
            overflow: auto;
            background: #1e1e1e;
            border: 1px solid #444;
            padding: 6px;
            font-family: monospace;
            font-size: 11px;
            white-space: pre-wrap;
            color: #aaa;
            margin-top: 8px;
            flex-shrink: 0;
        }
        .empty-tip {
            color: #777;
            font-size: 12px;
            padding: 20px;
            text-align: center;
        }
    `,

    template: `
        <h2>Replace With Internal</h2>
        <div class="desc">扫描 Cocos Creator 内置 internal 同名资源，勾选后将预制体/场景/动画中的 UUID 引用替换为官方 internal UUID（不修改资源 meta 中的 UUID）。</div>
        <div class="toolbar">
            <ui-button id="btn-scan">扫描同名资源</ui-button>
            <ui-button id="btn-select-all">全选</ui-button>
            <ui-button id="btn-select-none">全不选</ui-button>
            <ui-button id="btn-replace">替换选中项引用</ui-button>
        </div>
        <div class="summary" id="summary">尚未扫描</div>
        <div class="list-wrap" id="list-wrap">
            <div class="empty-tip">点击「扫描同名资源」开始</div>
        </div>
        <div class="log" id="log"></div>
    `,

    $: {
        btnScan: '#btn-scan',
        btnSelectAll: '#btn-select-all',
        btnSelectNone: '#btn-select-none',
        btnReplace: '#btn-replace',
        summary: '#summary',
        listWrap: '#list-wrap',
        log: '#log',
    },

    ready: function () {
        var self = this;
        this._categories = [];
        this._selectedIds = {};

        this.$btnScan.addEventListener('confirm', function () {
            self._appendLog('开始扫描...');
            Editor.Ipc.sendToMain('replace-with-internal:scan', function (error, result) {
                if (error) {
                    self._appendLog('扫描失败: ' + error.message);
                    return;
                }
                self._categories = result.categories || [];
                self._selectedIds = {};
                self._categories.forEach(function (cat) {
                    cat.pairs.forEach(function (pair) {
                        self._selectedIds[pair.id] = true;
                    });
                });
                self.$summary.innerText =
                    'internal 资源: ' + result.internalCount +
                    ' | 项目同名: ' + result.pairCount +
                    ' | 分类: ' + self._categories.length +
                    ' | 来源: ' + result.internalSource;
                self._renderList();
                self._appendLog('扫描完成，共 ' + result.pairCount + ' 项可替换引用');
            });
        });

        this.$btnSelectAll.addEventListener('confirm', function () {
            self._setAllChecked(true);
        });

        this.$btnSelectNone.addEventListener('confirm', function () {
            self._setAllChecked(false);
        });

        this.$btnReplace.addEventListener('confirm', function () {
            var selectedIds = self._getSelectedIds();
            if (selectedIds.length === 0) {
                self._appendLog('请先勾选需要替换的同名资源');
                return;
            }
            self._appendLog('开始替换引用，已选 ' + selectedIds.length + ' 项...');
            Editor.Ipc.sendToMain('replace-with-internal:replace', selectedIds, function (error, result) {
                if (error) {
                    self._appendLog('替换失败: ' + error.message);
                    return;
                }
                if (result.message) {
                    self._appendLog(result.message);
                    return;
                }
                self._appendLog(
                    '替换完成: ' + result.pairCount + ' 项引用, 修改 ' +
                    result.changedFileCount + ' 个预制体/场景/动画文件'
                );
                if (result.changedFiles && result.changedFiles.length > 0) {
                    result.changedFiles.forEach(function (filePath) {
                        self._appendLog('  ' + filePath);
                    });
                }
            });
        });
    },

    _setAllChecked: function (checked) {
        var self = this;
        this._categories.forEach(function (cat) {
            cat.pairs.forEach(function (pair) {
                self._selectedIds[pair.id] = checked;
            });
        });
        this._renderList();
    },

    _getSelectedIds: function () {
        var ids = [];
        for (var id in this._selectedIds) {
            if (this._selectedIds.hasOwnProperty(id) && this._selectedIds[id]) {
                ids.push(id);
            }
        }
        return ids;
    },

    _renderList: function () {
        var self = this;
        this.$listWrap.innerHTML = '';

        if (!this._categories || this._categories.length === 0) {
            this.$listWrap.innerHTML = '<div class="empty-tip">未发现可替换的同名 internal 资源</div>';
            return;
        }

        this._categories.forEach(function (cat) {
            var block = document.createElement('div');
            block.className = 'category-block';

            var header = document.createElement('div');
            header.className = 'category-header';

            var catCheckbox = document.createElement('input');
            catCheckbox.type = 'checkbox';
            catCheckbox.checked = cat.pairs.every(function (pair) {
                return self._selectedIds[pair.id];
            });
            catCheckbox.addEventListener('change', function () {
                cat.pairs.forEach(function (pair) {
                    self._selectedIds[pair.id] = catCheckbox.checked;
                });
                self._renderList();
            });

            var catLabel = document.createElement('label');
            catLabel.appendChild(catCheckbox);
            catLabel.appendChild(document.createTextNode(
                ' ' + cat.label + ' (' + cat.pairs.length + ')'
            ));
            header.appendChild(catLabel);
            block.appendChild(header);

            cat.pairs.forEach(function (pair) {
                var item = document.createElement('div');
                item.className = 'pair-item';

                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = !!self._selectedIds[pair.id];
                checkbox.addEventListener('change', function () {
                    self._selectedIds[pair.id] = checkbox.checked;
                });

                var main = document.createElement('div');
                main.className = 'pair-main';
                main.innerHTML =
                    '<div class="pair-name">' + pair.name + ' [' + pair.kindLabel + ']</div>' +
                    '<div class="pair-meta">项目 UUID: ' + pair.fromUuid + '</div>' +
                    '<div class="pair-meta">internal UUID: ' + pair.toUuid + '</div>' +
                    '<div class="pair-meta">项目路径: ' + pair.projectPath + '</div>';

                item.appendChild(checkbox);
                item.appendChild(main);
                block.appendChild(item);
            });

            self.$listWrap.appendChild(block);
        });
    },

    _appendLog: function (text) {
        if (!this.$log.innerText) {
            this.$log.innerText = text;
        } else {
            this.$log.innerText += '\n' + text;
        }
        this.$log.scrollTop = this.$log.scrollHeight;
    },
});
