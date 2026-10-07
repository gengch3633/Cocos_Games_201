let batchRenderer: any;
let cullingMask = 0;
let sortingDepth = 0;
let currentSortingPriority = 0;
const deferredRenderers: any[] = [];
let needsSort = false;

function flushDeferredRenderers(): void {
    if (deferredRenderers.length > 0) {
        if (needsSort) {
            deferredRenderers.sort(function (a, b) {
                return a.renderPriority - b.renderPriority;
            });
        }
        for (let i = 0; i < deferredRenderers.length; i++) {
            const comp = deferredRenderers[i];
            comp._checkBacth(batchRenderer, comp.node._cullingMask);
            comp._assembler.fillBuffers(comp, batchRenderer);
        }
        deferredRenderers.length = 0;
    }
    needsSort = false;
}

cc.RenderFlow.visitRootNode = function (node: cc.Node) {
    sortingDepth = 0;
    currentSortingPriority = 0;
    deferredRenderers.length = 0;
    needsSort = false;
    batchRenderer = cc.RenderFlow.getBachther();
    cc.RenderFlow.validateRenderers();
    const prevMask = cullingMask;
    cullingMask = node._cullingMask;
    if (node._renderFlag & cc.RenderFlow.FLAG_WORLD_TRANSFORM) {
        batchRenderer.worldMatDirty++;
        node._calculWorldMatrix();
        node._renderFlag &= ~cc.RenderFlow.FLAG_WORLD_TRANSFORM;
        cc.RenderFlow.flows[node._renderFlag]._func(node);
        flushDeferredRenderers();
        batchRenderer.worldMatDirty--;
    } else {
        cc.RenderFlow.flows[node._renderFlag]._func(node);
        flushDeferredRenderers();
    }
    cullingMask = prevMask;
};

cc.RenderFlow.prototype._render = function (node: cc.Node) {
    const comp = node._renderComponent;
    const prevPriority = currentSortingPriority;
    currentSortingPriority = node._sortingEnabled ? node._sortingPriority : currentSortingPriority;
    if (node._sortingEnabled) {
        ++sortingDepth;
    }
    if (sortingDepth > 0) {
        if (comp instanceof cc.Mask) {
            flushDeferredRenderers();
            comp._checkBacth(batchRenderer, node._cullingMask);
            comp._assembler.fillBuffers(comp, batchRenderer);
        } else {
            if (batchRenderer.worldMatDirty && comp._assembler.updateWorldVerts) {
                comp._assembler.updateWorldVerts(comp);
            }
            if (comp instanceof sp.Skeleton) {
                batchRenderer.worldMatDirty++;
                comp.attachUtil._syncAttachedNode();
            }
            deferredRenderers.push(comp);
            comp.renderPriority = node._sortingEnabled ? node._sortingPriority : currentSortingPriority;
            if (0 != currentSortingPriority) {
                needsSort = true;
            }
        }
    } else {
        comp._checkBacth(batchRenderer, node._cullingMask);
        comp._assembler.fillBuffers(comp, batchRenderer);
    }
    this._next._func(node);
    if (node._sortingEnabled && --sortingDepth <= 0) {
        flushDeferredRenderers();
    }
    currentSortingPriority = prevPriority;
};

cc.RenderFlow.prototype._postRender = function (node: cc.Node) {
    const comp = node._renderComponent;
    if (comp instanceof cc.Mask) {
        flushDeferredRenderers();
    }
    comp._checkBacth(batchRenderer, node._cullingMask);
    comp._assembler.postFillBuffers(comp, batchRenderer);
    this._next._func(node);
};

cc.RenderFlow.prototype._children = function (node: cc.Node) {
    const prevMask = cullingMask;
    const renderer = batchRenderer;
    const prevOpacity = renderer.parentOpacity;
    const inheritedOpacity = (renderer.parentOpacity *= node._opacity / 255);
    if (!node._renderComponent && node._sortingEnabled) {
        ++sortingDepth;
    }
    const childFlags = (renderer.worldMatDirty ? cc.RenderFlow.FLAG_WORLD_TRANSFORM : 0) |
        (renderer.parentOpacityDirty ? cc.RenderFlow.FLAG_OPACITY_COLOR : 0);
    const children = node._children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        child._renderFlag |= childFlags;
        if (child._activeInHierarchy && 0 !== child._opacity) {
            cullingMask = child._cullingMask = 0 === child.groupIndex ? prevMask : 1 << child.groupIndex;
            const prevColor = child._color._val;
            child._color._fastSetA(child._opacity * inheritedOpacity);
            cc.RenderFlow.flows[child._renderFlag]._func(child);
            child._color._val = prevColor;
        }
    }
    renderer.parentOpacity = prevOpacity;
    this._next._func(node);
    if (!node._renderComponent && node._sortingEnabled && --sortingDepth <= 0) {
        flushDeferredRenderers();
    }
};

export {};
