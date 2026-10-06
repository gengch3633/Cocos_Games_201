// @ts-nocheck
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
