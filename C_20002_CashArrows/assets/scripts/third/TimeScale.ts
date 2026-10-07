cc.director.timeScale = 1;
const originalCalculateDeltaTime = cc.Director.prototype.calculateDeltaTime;
cc.Director.prototype.calculateDeltaTime = function (now: number): void {
    originalCalculateDeltaTime.call(this, now);
    this._deltaTime *= this.timeScale;
};
