cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    cc.js.mixin(sp.Skeleton.prototype, {
        update: function (e) {
            if (!this.paused) {
                e *= this.timeScale * sp.timeScale;
                if (this.isAnimationCached()) {
                    if (this._isAniComplete) {
                        if (0 === this._animationQueue.length && !this._headAniInfo) {
                            var t = this._frameCache;
                            if (t && t.isInvalid()) {
                                t.updateToFrame();
                                var i = t.frames;
                                this._curFrame = i[i.length - 1];
                            }
                            return;
                        }
                        this._headAniInfo || (this._headAniInfo = this._animationQueue.shift());
                        this._accTime += e;
                        if (this._accTime > this._headAniInfo.delay) {
                            var n = this._headAniInfo;
                            this._headAniInfo = null;
                            this.setAnimation(0, n.animationName, n.loop);
                        }
                        return;
                    }
                    this._updateCache(e);
                } else this._updateRealtime(e);
            }
        }
    });
});
