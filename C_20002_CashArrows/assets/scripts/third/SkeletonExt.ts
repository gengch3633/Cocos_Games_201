// @ts-nocheck

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    cc.js.mixin(sp.Skeleton.prototype, {
        update: function (dt) {
            if (!this.paused) {
                dt *= this.timeScale * sp.timeScale;
                if (this.isAnimationCached()) {
                    if (this._isAniComplete) {
                        if (this._animationQueue.length === 0 && !this._headAniInfo) {
                            const frameCache = this._frameCache;
                            if (frameCache && frameCache.isInvalid()) {
                                frameCache.updateToFrame();
                                const frames = frameCache.frames;
                                this._curFrame = frames[frames.length - 1];
                            }
                            return;
                        }
                        this._headAniInfo || (this._headAniInfo = this._animationQueue.shift());
                        this._accTime += dt;
                        if (this._accTime > this._headAniInfo.delay) {
                            const headAniInfo = this._headAniInfo;
                            this._headAniInfo = null;
                            this.setAnimation(0, headAniInfo.animationName, headAniInfo.loop);
                        }
                        return;
                    }
                    this._updateCache(dt);
                } else {
                    this._updateRealtime(dt);
                }
            }
        },
    });
});
