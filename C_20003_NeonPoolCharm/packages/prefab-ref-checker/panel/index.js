'use strict';

const PKG = 'prefab-ref-checker';

const LEVEL_NAME = { error: '错误', warning: '警告', info: '提示' };

function escapeHtml (s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// 面板实例引用（messages 回调中 this 绑定在不同版本可能不可靠，用闭包引用兜底）
let _panel = null;

function onScanDone (event, data) {
    const self = _panel;
    if (!self) return;
    clearTimeout(self._scanTimer);
    self.$mask.classList.add('hidden');
    self._data = data;
    self._render();
}

function onExportDone (event, filePath) {
    const self = _panel;
    if (!self) return;
    self.$summary.innerHTML += ` &nbsp;|&nbsp; 报告已导出: ${escapeHtml(filePath)}`;
}

Editor.Panel.extend({
    template: `
        <div class="root">
            <div class="toolbar">
                <ui-button id="btnScan" class="blue">扫描全部 Prefab / Scene</ui-button>
                <ui-checkbox id="ckError" checked>错误</ui-checkbox>
                <ui-checkbox id="ckWarning" checked>警告</ui-checkbox>
                <ui-checkbox id="ckInfo">提示</ui-checkbox>
                <span class="flex-space"></span>
                <ui-checkbox id="ckProps" title="检查脚本 @property 引用属性是否未绑定（提示级，可能误报运行时赋值的属性）">属性检查</ui-checkbox>
                <ui-button id="btnExport">导出报告</ui-button>
            </div>
            <div id="summary" class="summary">尚未扫描</div>
            <div id="list" class="list"></div>
            <div id="mask" class="mask hidden"><i class="fa fa-spinner fa-spin"></i> 扫描中...</div>
        </div>
    `,

    style: `
        .root { display: flex; flex-direction: column; height: 100%; padding: 8px; box-sizing: border-box; position: relative; }
        .toolbar { display: flex; align-items: center; flex-wrap: wrap; margin-bottom: 6px; }
        .toolbar > * { margin-right: 8px; margin-bottom: 2px; }
        .flex-space { flex: 1; }
        .summary { font-size: 12px; color: #999; margin-bottom: 6px; }
        .summary .e { color: #f66; font-weight: bold; }
        .summary .w { color: #fa3; font-weight: bold; }
        .summary .i { color: #6af; font-weight: bold; }
        .list { flex: 1; overflow: auto; border: 1px solid #3a3a3a; border-radius: 4px; padding: 4px; background: #232323; }
        .item { padding: 6px 8px; margin: 4px 2px; border-left: 3px solid #666; background: #2b2b2b; border-radius: 3px; font-size: 12px; line-height: 1.6; }
        .item.error { border-left-color: #f66; }
        .item.warning { border-left-color: #fa3; }
        .item.info { border-left-color: #6af; }
        .item .head { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
        .badge { font-size: 11px; padding: 0 6px; border-radius: 3px; color: #111; font-weight: bold; }
        .badge.error { background: #f66; }
        .badge.warning { background: #fa3; }
        .badge.info { background: #6af; }
        .file { color: #8cf; cursor: pointer; word-break: break-all; }
        .file:hover { text-decoration: underline; }
        .node { color: #9c8; word-break: break-all; }
        .comp { color: #c9c; }
        .msg { color: #ddd; margin-top: 2px; word-break: break-all; }
        .empty { color: #7d7; text-align: center; margin-top: 40px; font-size: 14px; }
        .mask { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; font-size: 16px; color: #eee; z-index: 10; }
        .mask.hidden { display: none; }
    `,

    $: {
        btnScan: '#btnScan',
        btnExport: '#btnExport',
        ckError: '#ckError',
        ckWarning: '#ckWarning',
        ckInfo: '#ckInfo',
        ckProps: '#ckProps',
        summary: '#summary',
        list: '#list',
        mask: '#mask',
    },

    ready () {
        _panel = this;
        this._data = null;

        this.$btnScan.addEventListener('confirm', () => this._startScan());
        this.$btnExport.addEventListener('confirm', () => {
            if (this._data) {
                Editor.Ipc.sendToMain(`${PKG}:export-report`, this._data);
            } else {
                this.$summary.textContent = '请先扫描，再导出报告';
            }
        });
        for (const ck of [this.$ckError, this.$ckWarning, this.$ckInfo]) {
            ck.addEventListener('change', () => this._render());
        }
    },

    _startScan () {
        this.$mask.classList.remove('hidden');
        this.$summary.textContent = '扫描中...';
        this.$list.innerHTML = '';
        Editor.Ipc.sendToMain(`${PKG}:scan`, { checkProps: this.$ckProps.checked });
        // 超时兜底：30 秒没收到回复则提示查看控制台，避免界面永远卡住
        clearTimeout(this._scanTimer);
        this._scanTimer = setTimeout(() => {
            if (this.$mask.classList.contains('hidden')) return;
            this.$mask.classList.add('hidden');
            this.$summary.textContent = '扫描超时：未收到主进程回复，请查看编辑器控制台（日志搜 prefab-ref-checker）';
        }, 30000);
    },

    _visibleLevels () {
        const s = new Set();
        if (this.$ckError.checked) s.add('error');
        if (this.$ckWarning.checked) s.add('warning');
        if (this.$ckInfo.checked) s.add('info');
        return s;
    },

    _render () {
        const data = this._data;
        if (!data) return;
        const st = data.stats || { files: 0, errors: 0, warnings: 0, infos: 0 };
        this.$summary.innerHTML =
            `扫描文件 <b>${st.files}</b> 个 &nbsp;|&nbsp; ` +
            `<span class="e">错误 ${st.errors}</span> &nbsp; ` +
            `<span class="w">警告 ${st.warnings}</span> &nbsp; ` +
            `<span class="i">提示 ${st.infos}</span>`;

        const visible = this._visibleLevels();
        const rows = (data.results || []).filter(r => visible.has(r.level));
        if (rows.length === 0) {
            this.$list.innerHTML = (st.errors + st.warnings + st.infos) === 0
                ? '<div class="empty">✔ 未发现问题</div>'
                : '<div class="empty">当前过滤级别下没有问题</div>';
            return;
        }
        this.$list.innerHTML = rows.map(r => `
            <div class="item ${r.level}">
                <div class="head">
                    <span class="badge ${r.level}">${LEVEL_NAME[r.level] || r.level}</span>
                    <span class="file" data-file="${escapeHtml(r.file)}" title="点击在资源管理器中定位">${escapeHtml(r.file)}</span>
                    ${r.component ? `<span class="comp">${escapeHtml(r.component)}</span>` : ''}
                </div>
                ${r.node ? `<div class="node">节点: ${escapeHtml(r.node)}</div>` : ''}
                <div class="msg">${escapeHtml(r.message)}</div>
            </div>
        `).join('');

        // 点击文件名 -> 在资源管理器中选中该资源
        this.$list.querySelectorAll('.file').forEach(el => {
            el.addEventListener('click', () => {
                const rel = el.getAttribute('data-file');
                if (rel) Editor.Ipc.sendToMain(`${PKG}:reveal-asset`, rel);
            });
        });
    },

    // 面板通过 messages 接收主进程消息。
    // 不同版本对消息名是否剥离包前缀处理不一致，两种 key 都注册。
    messages: {
        'prefab-ref-checker:scan-done': onScanDone,
        'scan-done': onScanDone,
        'prefab-ref-checker:export-done': onExportDone,
        'export-done': onExportDone,
    },
});
