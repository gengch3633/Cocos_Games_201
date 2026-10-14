cc.director.timeScale = 1;

type CalculateDeltaTime = (this: cc.Director, dt: number) => void;

const originalCalculateDeltaTime: CalculateDeltaTime = (cc.Director.prototype as any).calculateDeltaTime;

(cc.Director.prototype as any).calculateDeltaTime = function (this: cc.Director, dt: number): void {
    originalCalculateDeltaTime.call(this, dt);
    (this as any)._deltaTime *= this.timeScale;
};
