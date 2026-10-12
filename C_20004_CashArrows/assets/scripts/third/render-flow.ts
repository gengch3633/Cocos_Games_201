const RenderFlow: any = (cc as any).RenderFlow;

let batcher: any = null;
let cullingMask: number = 0;
let sortingCount: number = 0;
let sortingPriority: number = 0;
const pendingRenderers: any[] = [];
let needsSort: boolean = false;

function flushPendingRenderers(): void {
    if (pendingRenderers.length > 0) {
        if (needsSort) {
            pendingRenderers.sort((a: any, b: any): number => a.renderPriority - b.renderPriority);
        }
        for (const renderer of pendingRenderers) {
            renderer._checkBacth(batcher, renderer.node._cullingMask);
            renderer._assembler.fillBuffers(renderer, batcher);
        }
        pendingRenderers.length = 0;
    }
    needsSort = false;
}

RenderFlow.visitRootNode = function (root: any): void {
    sortingCount = 0;
    sortingPriority = 0;
    pendingRenderers.length = 0;
    needsSort = false;

    batcher = RenderFlow.getBachther();
    RenderFlow.validateRenderers();

    const prevCullingMask: number = cullingMask;
    cullingMask = root._cullingMask;

    if (root._renderFlag & RenderFlow.FLAG_WORLD_TRANSFORM) {
        batcher.worldMatDirty++;
        root._calculWorldMatrix();
        root._renderFlag &= ~RenderFlow.FLAG_WORLD_TRANSFORM;
        RenderFlow.flows[root._renderFlag]._func(root);
        flushPendingRenderers();
        batcher.worldMatDirty--;
    } else {
        RenderFlow.flows[root._renderFlag]._func(root);
        flushPendingRenderers();
    }

    cullingMask = prevCullingMask;
};

RenderFlow.prototype._render = function (this: any, node: any): void {
    const comp: any = node._renderComponent;
    const prevSortingPriority: number = sortingPriority;
    sortingPriority = node._sortingEnabled ? node._sortingPriority : sortingPriority;

    if (node._sortingEnabled) {
        ++sortingCount;
    }

    if (sortingCount > 0) {
        if (comp instanceof cc.Mask) {
            flushPendingRenderers();
            comp._checkBacth(batcher, node._cullingMask);
            comp._assembler.fillBuffers(comp, batcher);
        } else {
            if (batcher.worldMatDirty && comp._assembler.updateWorldVerts) {
                comp._assembler.updateWorldVerts(comp);
            }
            if (comp instanceof sp.Skeleton) {
                batcher.worldMatDirty++;
                comp.attachUtil._syncAttachedNode();
            }
            pendingRenderers.push(comp);
            comp.renderPriority = node._sortingEnabled ? node._sortingPriority : sortingPriority;
            if (sortingPriority !== 0) {
                needsSort = true;
            }
        }
    } else {
        comp._checkBacth(batcher, node._cullingMask);
        comp._assembler.fillBuffers(comp, batcher);
    }

    this._next._func(node);

    if (node._sortingEnabled && --sortingCount <= 0) {
        flushPendingRenderers();
    }

    sortingPriority = prevSortingPriority;
};

RenderFlow.prototype._postRender = function (this: any, node: any): void {
    const comp: any = node._renderComponent;

    if (comp instanceof cc.Mask) {
        flushPendingRenderers();
    }

    comp._checkBacth(batcher, node._cullingMask);
    comp._assembler.postFillBuffers(comp, batcher);
    this._next._func(node);
};

RenderFlow.prototype._children = function (this: any, node: any): void {
    const prevCullingMask: number = cullingMask;
    const curBatcher: any = batcher;
    const prevParentOpacity: number = curBatcher.parentOpacity;
    const scaledParentOpacity: number = (curBatcher.parentOpacity *= node._opacity / 255);

    if (!node._renderComponent && node._sortingEnabled) {
        ++sortingCount;
    }

    const renderFlags: number =
        (curBatcher.worldMatDirty ? RenderFlow.FLAG_WORLD_TRANSFORM : 0) |
        (curBatcher.parentOpacityDirty ? RenderFlow.FLAG_OPACITY_COLOR : 0);

    const children: any[] = node._children;
    for (let i = 0, len = children.length; i < len; i++) {
        const child: any = children[i];
        child._renderFlag |= renderFlags;
        if (child._activeInHierarchy && child._opacity !== 0) {
            cullingMask = child._cullingMask = child.groupIndex === 0 ? prevCullingMask : 1 << child.groupIndex;
            const savedColorVal: number = child._color._val;
            child._color._fastSetA(child._opacity * scaledParentOpacity);
            RenderFlow.flows[child._renderFlag]._func(child);
            child._color._val = savedColorVal;
        }
    }

    curBatcher.parentOpacity = prevParentOpacity;

    this._next._func(node);

    if (!node._renderComponent && node._sortingEnabled && --sortingCount <= 0) {
        flushPendingRenderers();
    }
};

export {};