TimeScale: [ function(e, t) {
"use strict";
cc._RF.push(t, "2bb87knD6xGXpJ6uoSOaixj", "TimeScale");
cc.director.timeScale = 1;
var i = cc.Director.prototype.calculateDeltaTime;
cc.Director.prototype.calculateDeltaTime = function(e) {
i.call(this, e);
this._deltaTime *= this.timeScale;
};
cc._RF.pop();
}