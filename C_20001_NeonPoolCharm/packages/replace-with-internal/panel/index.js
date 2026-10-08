'use strict';

Editor.Panel.extend({
    style: `
        :host {
            display: flex;
            flex-direction: column;
            padding: 10px;
            box-sizing: border-box;
            height: 100%;
        }
        h2 {
            margin: 0 0 8px 0;
            font-size: 16px;
        }
        .desc {
            color: #999;
            font-size: 12px;
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .toolbar {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        }
        .toolbar ui-button {
            flex: 0 0 auto;
        }
        .summary {
            font-size: 12px;
            margin-bottom: 8px;
            color: #ccc;
        }
        .log {
            flex: 1;
            overflow: auto;
            background: #252525;
            border: 1px solid #444;
            padding: 8px;
            font-family: monospace;
            font-size: 12px;
            white-space: pre-wrap;
            color: #ddd;
        }
    `,

    template: `
        <h2>Replace With Internal</h2>
        <div class="desc">扫描 Cocos Creator 内置 internal 资源，将项目中同名资源的 UUID 引用替换为官方 internal UUID。</div>
        <div class="toolbar">
            <ui-button id="btn-scan">扫描匹配项</ui-button>
            <ui-button id="btn-replace">执行 UUID 替换</ui-button>
        </div>
        <div class="summary" id="summary">尚未扫描</div>
        <div class="log" id="log">等待操作...</div>
    `,

    $: {
        btnScan: '#btn-scan',
        btnReplace: '#btn-replace',
        summary: '#summary',
        log: '#log',
    },

    ready: function () {
        var self = this;

        this.$btnScan.addEventListener('confirm', function () {
            self._appendLog('开始扫描...');
            Editor.Ipc.sendToMain('replace-with-internal:scan', function (error, result) {
                if (error) {
                    self._appendLog('扫描失败: ' + error.message);
                    return;
                }
                self._lastScan = result;
                self.$summary.innerText =
                    'internal 资源: ' + result.internalCount +
                    ' | 项目资源: ' + result.projectCount +
                    ' | 可替换: ' + result.pairCount +
                    ' | 来源: ' + result.internalSource +
                    (result.internalRoot ? (' | 路径: ' + result.internalRoot) : '');
                self._appendLog('扫描完成，匹配 ' + result.pairCount + ' 组 UUID');
                if (result.pairs && result.pairs.length > 0) {
                    result.pairs.forEach(function (pair) {
                        self._appendLog(
                            pair.name + ': ' + pair.fromUuid + ' -> ' + pair.toUuid
                        );
                    });
                } else {
                    self._appendLog('未发现可替换的同名 internal 资源');
                }
            });
        });

        this.$btnReplace.addEventListener('confirm', function () {
            self._appendLog('开始替换 UUID...');
            Editor.Ipc.sendToMain('replace-with-internal:replace', function (error, result) {
                if (error) {
                    self._appendLog('替换失败: ' + error.message);
                    return;
                }
                self._appendLog(
                    '替换完成: ' + result.pairCount + ' 组 UUID, 修改 ' +
                    result.changedFileCount + ' 个文件'
                );
                if (result.changedFiles && result.changedFiles.length > 0) {
                    result.changedFiles.forEach(function (filePath) {
                        self._appendLog('  修改: ' + filePath);
                    });
                }
            });
        });
    },

    _appendLog: function (text) {
        this.$log.innerText += '\n' + text;
        this.$log.scrollTop = this.$log.scrollHeight;
    },
});
