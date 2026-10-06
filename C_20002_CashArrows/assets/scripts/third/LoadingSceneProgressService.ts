import LoadingSceneProgressAdapter from "./LoadingSceneProgressAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class LoadingSceneProgressService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    preloadTextures() {
        LoadingSceneProgressAdapter.getImplementation().preloadTextures();
    }

    async run() {
        BusinessAnalyticsService.reportData(" page_loading_progressFinish ");
        var e = .25;
        var t = this;
        LoadingSceneProgressAdapter.getImplementation().preloadScene(" BPR_Game_Main ", function (i: number, n: number) {
            t.deps.setProgress(i / n, false, 0, e);
        }, async function () {
            try {
                var a = LoadingSceneProgressAdapter.getImplementation().getLoadingTasks();
                for (var i = 0; i < a.length; i++) {
                    e = await t.progressWithPrefabLoading(e, a, i);
                }
            } catch (o) {
                console.error(" loading progressFinish failed, the error was " + o);
                if (LoadingSceneProgressAdapter.getImplementation().isDebug()) throw new Error(" loading progressFinish failed, the error was " + o);
            } finally {
                BusinessAnalyticsService.reportData(" page_loading_progressFinish_runMainScene ");
                t.deps.onProgressFinish();
            }
        });
    }

    async progressWithPrefabLoading(e: number, t: any[], i: number) {
        var a, o = this;
        a = e + this.getPercentByIndex(t, i);
        await LoadingSceneProgressAdapter.getImplementation().loadTask(t[i], function (t: number, i: number) {
            o.deps.setProgress(t / i, false, e, a);
        });
        return a;
    }

    getPercentByIndex(e: any[], t: number, i: number = .74) {
        return i / this.getLoadingTotalCount(e) * this.getLoadingCount(e, t);
    }

    getLoadingTotalCount(e: any[]) {
        for (var t = 0, i = 0; i < e.length; i++) t += this.getLoadingCount(e, i);
        return t;
    }

    getLoadingCount(e: any[], t: number) {
        var i;
        return (null === (i = e[t]) || void 0 === i ? void 0 : i.count) || 1;
    }
}
