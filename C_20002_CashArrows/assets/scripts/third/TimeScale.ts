cc.director.timeScale = 1;
var i = cc.Director.prototype.calculateDeltaTime;
cc.Director.prototype.calculateDeltaTime = function (e) {
    i.call(this, e);
    this._deltaTime *= this.timeScale;
};
