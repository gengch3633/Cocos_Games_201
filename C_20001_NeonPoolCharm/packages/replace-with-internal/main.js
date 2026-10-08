'use strict';

const Replacer = require('./lib/uuid-replacer');

module.exports = {
    load() {
        Editor.log('[replace-with-internal] plugin loaded');
    },

    unload() {
        Editor.log('[replace-with-internal] plugin unloaded');
    },

    messages: {
        openPanel() {
            Editor.Panel.open('replace-with-internal');
        },

        scan(event, options) {
            Replacer.scanReplacementPlan(options || {})
                .then((plan) => {
                    if (event.reply) {
                        event.reply(null, plan);
                    }
                })
                .catch((err) => {
                    Editor.error('[replace-with-internal] scan failed:', err);
                    if (event.reply) {
                        event.reply(err.message || String(err));
                    }
                });
        },

        apply(event, payload) {
            const plan = payload && payload.plan;
            if (!plan || !plan.uuidMap) {
                if (event.reply) {
                    event.reply('Invalid replacement plan');
                }
                return;
            }
            const uuidMap = new Map(Object.entries(plan.uuidMap));
            Replacer.applyReplacementPlan(
                {
                    pairs: plan.pairs || [],
                    uuidMap,
                },
                payload.options || {}
            )
                .then((result) => {
                    if (event.reply) {
                        event.reply(null, result);
                    }
                })
                .catch((err) => {
                    Editor.error('[replace-with-internal] apply failed:', err);
                    if (event.reply) {
                        event.reply(err.message || String(err));
                    }
                });
        },
    },
};
