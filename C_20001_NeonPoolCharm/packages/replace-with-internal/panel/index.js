'use strict';

const Fs = require('fire-fs');
const Path = require('fire-path');

Editor.Panel.extend({
    style: Fs.readFileSync(Editor.url('packages://replace-with-internal/panel/index.css'), 'utf8'),
    template: Fs.readFileSync(Editor.url('packages://replace-with-internal/panel/index.html'), 'utf8'),

    $: {
        matchMode: '#matchMode',
        btnScan: '#btnScan',
        btnApply: '#btnApply',
        summary: '#summary',
        resultBody: '#resultBody',
    },

    ready() {
        this._plan = null;
        this.$btnScan.addEventListener('click', () => this._scan());
        this.$btnApply.addEventListener('click', () => this._apply());
    },

    messages: {},

    _setSummary(text) {
        this.$summary.textContent = text;
    },

    _renderPlan(plan) {
        this._plan = plan;
        this.$resultBody.innerHTML = '';
        (plan.pairs || []).forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML =
                `<td>${item.name || ''}</td>` +
                `<td>${item.type || ''}</td>` +
                `<td title="${item.projectUrl || ''}">${item.projectUuid}</td>` +
                `<td title="${item.internalUrl || ''}">${item.internalUuid}</td>`;
            this.$resultBody.appendChild(row);
        });
        this.$btnApply.disabled = !(plan.pairs && plan.pairs.length > 0);
        this._setSummary(
            `Internal: ${plan.internalCount}, Project: ${plan.projectCount}, ` +
                `Matched: ${plan.pairs.length}, No match: ${plan.skippedNoMatch.length}, ` +
                `Same UUID: ${plan.skippedSameUuid.length}`
        );
    },

    _scan() {
        this._setSummary('Scanning...');
        this.$btnScan.disabled = true;
        Editor.Ipc.sendToMain(
            'replace-with-internal:scan',
            {
                matchMode: this.$matchMode.value,
            },
            (err, plan) => {
                this.$btnScan.disabled = false;
                if (err) {
                    this._setSummary(`Scan failed: ${err}`);
                    Editor.error('[replace-with-internal]', err);
                    return;
                }
                plan.uuidMap = {};
                (plan.pairs || []).forEach((item) => {
                    plan.uuidMap[item.projectUuid] = item.internalUuid;
                });
                this._renderPlan(plan);
            }
        );
    },

    _apply() {
        if (!this._plan || !this._plan.pairs || this._plan.pairs.length === 0) {
            return;
        }
        const confirmed = confirm(
            `Replace UUID references for ${this._plan.pairs.length} matched assets?\n\n` +
                'Project files under assets/ will be modified. Please commit or back up first.'
        );
        if (!confirmed) {
            return;
        }

        this._setSummary('Applying...');
        this.$btnApply.disabled = true;
        Editor.Ipc.sendToMain(
            'replace-with-internal:apply',
            {
                plan: this._plan,
                options: {
                    refreshAssetDb: true,
                },
            },
            (err, result) => {
                this.$btnApply.disabled = false;
                if (err) {
                    this._setSummary(`Apply failed: ${err}`);
                    Editor.error('[replace-with-internal]', err);
                    return;
                }
                this._setSummary(
                    `Done. Modified ${result.touchedFileCount} files, ${result.replacementCount} UUID replacements.`
                );
                Editor.success('[replace-with-internal] UUID replacement completed');
            }
        );
    },
});
