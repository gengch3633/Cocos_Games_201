cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    cc.js.mixin(sp.Skeleton.prototype, {
        update(this: any, dt: number): void {
            if (this.paused) {
                return;
            }

            dt *= this.timeScale * sp.timeScale;

            if (!this.isAnimationCached()) {
                this._updateRealtime(dt);
                return;
            }

            if (!this._isAniComplete) {
                this._updateCache(dt);
                return;
            }

            if (this._animationQueue.length === 0 && !this._headAniInfo) {
                const frameCache = this._frameCache;
                if (frameCache && frameCache.isInvalid()) {
                    frameCache.updateToFrame();
                    const frames = frameCache.frames;
                    this._curFrame = frames[frames.length - 1];
                }
                return;
            }

            if (!this._headAniInfo) {
                this._headAniInfo = this._animationQueue.shift();
            }

            this._accTime += dt;

            if (this._accTime > this._headAniInfo.delay) {
                const aniInfo = this._headAniInfo;
                this._headAniInfo = null;
                this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
            }
        }
    } as any);
});