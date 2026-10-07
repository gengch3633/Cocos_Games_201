'use strict';

const Fs = require('fs');
const Path = require('path');

function patchMainJs(destDir) {
    const template = Path.join(Editor.Project.path, 'build-templates', 'shares', 'main.js');
    if (!Fs.existsSync(template)) {
        Editor.warn('[patch-web-mobile-main] template not found:', template);
        return;
    }
    if (!Fs.existsSync(destDir)) {
        return;
    }
    const files = Fs.readdirSync(destDir).filter(function (name) {
        return /^main(\.[a-f0-9]+)?\.js$/i.test(name);
    });
    if (files.length === 0) {
        Editor.warn('[patch-web-mobile-main] no main*.js in', destDir);
        return;
    }
    files.forEach(function (name) {
        const target = Path.join(destDir, name);
        Fs.copyFileSync(template, target);
        Editor.log('[patch-web-mobile-main] patched', target);
    });
}

module.exports = {
    load: function () {},
    unload: function () {},
    messages: {
        'build-finished': function (options, callback) {
            try {
                const dest = options && (options.dest || options.buildPath);
                if (dest) {
                    const webMobile = /web-mobile[\\/]?$/i.test(dest)
                        ? dest
                        : Path.join(dest, 'web-mobile');
                    if (Fs.existsSync(webMobile)) {
                        patchMainJs(webMobile);
                    }
                }
            } catch (e) {
                Editor.error('[patch-web-mobile-main]', e);
            }
            callback && callback();
        }
    }
};
