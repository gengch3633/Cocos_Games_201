const gfx: any = cc.gfx;
const spine: any = sp.spine;

const vfmtPosUvColor: number = gfx.VertexFormat.vfmtPosUvColor;
const vfmtPosUvTwoColor: number = gfx.VertexFormat.vfmtPosUvTwoColor;

const REGION_INDICES: number[] = [0, 1, 2, 2, 3, 0];

const DEBUG_COLOR_BLUE = cc.color(0, 0, 255, 255);
const DEBUG_COLOR_RED = cc.color(255, 0, 0, 255);
const DEBUG_COLOR_GREEN = cc.color(0, 255, 0, 255);
const DEBUG_COLOR_YELLOW = cc.color(255, 255, 0, 255);

const tempLightColor = new spine.Color(1, 1, 1, 1);
const tempDarkColor = new spine.Color(1, 1, 1, 1);
const Vector2Ctor: any = spine.Vector2 || function (this: any) {
    this.x = 0;
    this.y = 0;
};
const tempPosA = new Vector2Ctor();
const tempPosB = new Vector2Ctor();

let premultipliedAlpha = false;
let colorScale = 1;
let startSlotIndex = -1;
let endSlotIndex = -1;
let useTint = false;
let debugSlots = false;
let debugBones = false;
let debugMesh = false;
let nodeColorR = 1;
let nodeColorG = 1;
let nodeColorB = 1;
let nodeColorA = 1;

let lightColorUint = 0;
let darkColorUint = 0;
let vertexFormat = 0;
let vertexStep = 0;
let clippedVertexStep = 0;

let lightR = 1;
let lightG = 1;
let lightB = 1;

let tempR = 1;
let tempG = 1;
let tempB = 1;

let red8 = 0;
let green8 = 0;
let blue8 = 0;

let darkRed8 = 0;
let darkGreen8 = 0;
let darkBlue8 = 0;

let alphaLevel = 0;

let bakeFlags = 0;
let needFlushMaterial = true;
let rendering = false;

let vertexDataCount = 0;
let indexCount = 0;
let vertexDataOffset = 0;
let vertexOffset = 0;
let indexOffset = 0;
let cachedByteOffset = 0;

let component: any = null;
let buffer: any = null;
let batcher: any = null;
let renderNode: any = null;
let needTintColor = false;
let vertexEffect: any = null;

let matA = 1;
let matB = 0;
let matC = 0;
let matD = 1;
let matTx = 0;
let matTy = 0;

let tempX = 0;
let tempY = 0;

function packColor(color: any): number {
    return ((color.a << 24) >>> 0) + (color.b << 16) + (color.g << 8) + color.r;
}

function getSpineMaterial(texture: any, blendMode: number): any {
    let src: number;
    let dst: number;

    switch (blendMode) {
        case spine.BlendMode.Additive:
            src = premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE;
            break;
        case spine.BlendMode.Multiply:
            src = cc.macro.DST_COLOR;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
        case spine.BlendMode.Screen:
            src = cc.macro.ONE;
            dst = cc.macro.ONE_MINUS_SRC_COLOR;
            break;
        case spine.BlendMode.Normal:
        default:
            src = premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
    }

    const useModel = !component.enableBatch;
    const baseMaterial = component._materials[0];
    if (!baseMaterial) {
        return null;
    }

    const key = texture.getId() + src + dst + useTint + useModel;
    const cache = component._materialCache;
    let material = cache[key];

    if (!material) {
        if (cache.baseMaterial) {
            material = cc.MaterialVariant.create(baseMaterial, null);
        } else {
            material = baseMaterial;
            cache.baseMaterial = baseMaterial;
        }

        material.define("CC_USE_MODEL", useModel);
        material.define("USE_TINT", useTint);
        material.setProperty("texture", texture);
        material.setBlend(true, gfx.BLEND_FUNC_ADD, src, dst, gfx.BLEND_FUNC_ADD, src, dst);
        cache[key] = material;
    }

    return material;
}

function updateTintColors(color: any): void {
    alphaLevel = color.fa * nodeColorA;
    colorScale = premultipliedAlpha ? alphaLevel / 255 : 1;

    tempR = nodeColorR * colorScale;
    tempG = nodeColorG * colorScale;
    tempB = nodeColorB * colorScale;

    red8 = color.fr * tempR;
    green8 = color.fg * tempG;
    blue8 = color.fb * tempB;
    lightColorUint = ((alphaLevel << 24) >>> 0) + (blue8 << 16) + (green8 << 8) + red8;

    darkRed8 = color.dr * tempR;
    darkGreen8 = color.dg * tempG;
    darkBlue8 = color.db * tempB;
    darkColorUint = (((premultipliedAlpha ? 255 : 0) << 24) >>> 0) + (darkBlue8 << 16) + (darkGreen8 << 8) + darkRed8;
}

const SpineAssembler: any = (sp.Skeleton as any).__assembler__;

SpineAssembler.fillVertices = function (
    skeletonColor: any,
    slotColor: any,
    boneColor: any,
    clipper: any,
    slot: any
): void {
    let floatData: Float32Array = buffer._vData;
    let indexData: Uint16Array = buffer._iData;
    let uintData: Uint32Array = buffer._uintVData;

    tempLightColor.a = boneColor.a * slotColor.a * skeletonColor.a * nodeColorA * 255;
    colorScale = premultipliedAlpha ? tempLightColor.a : 255;

    lightR = nodeColorR * slotColor.r * skeletonColor.r * colorScale;
    lightG = nodeColorG * slotColor.g * skeletonColor.g * colorScale;
    lightB = nodeColorB * slotColor.b * skeletonColor.b * colorScale;

    tempLightColor.r = lightR * boneColor.r;
    tempLightColor.g = lightG * boneColor.g;
    tempLightColor.b = lightB * boneColor.b;

    if (slot.darkColor == null) {
        tempDarkColor.set(0, 0, 0, 1);
    } else {
        tempDarkColor.r = slot.darkColor.r * lightR;
        tempDarkColor.g = slot.darkColor.g * lightG;
        tempDarkColor.b = slot.darkColor.b * lightB;
    }
    tempDarkColor.a = premultipliedAlpha ? 255 : 0;

    if (clipper.isClipping()) {
        const clipData = floatData.subarray(vertexDataOffset + 2);

        clipper.clipTriangles(
            floatData.subarray(vertexDataOffset),
            vertexDataCount,
            indexData.subarray(indexOffset),
            indexCount,
            clipData,
            tempLightColor,
            tempDarkColor,
            useTint,
            vertexStep
        );

        const clippedVertices = new Float32Array(clipper.clippedVertices);
        const clippedTriangles = clipper.clippedTriangles;

        indexCount = clippedTriangles.length;
        vertexDataCount = clippedVertices.length / clippedVertexStep * vertexStep;

        const vb = buffer.request(vertexDataCount / vertexStep, indexCount);
        indexOffset = vb.indiceOffset;
        vertexOffset = vb.vertexOffset;
        vertexDataOffset = vb.byteOffset >> 2;

        floatData = buffer._vData;
        indexData = buffer._iData;
        uintData = buffer._uintVData;
        indexData.set(clippedTriangles, indexOffset);

        if (vertexEffect) {
            let src = 0;
            const total = clippedVertices.length;

            for (let dst = vertexDataOffset; src < total; src += clippedVertexStep, dst += vertexStep) {
                tempPosA.x = clippedVertices[src];
                tempPosA.y = clippedVertices[src + 1];
                tempLightColor.set(clippedVertices[src + 2], clippedVertices[src + 3], clippedVertices[src + 4], clippedVertices[src + 5]);
                tempPosB.x = clippedVertices[src + 6];
                tempPosB.y = clippedVertices[src + 7];

                if (useTint) {
                    tempDarkColor.set(clippedVertices[src + 8], clippedVertices[src + 9], clippedVertices[src + 10], clippedVertices[src + 11]);
                } else {
                    tempDarkColor.set(0, 0, 0, 0);
                }

                vertexEffect.transform(tempPosA, tempPosB, tempLightColor, tempDarkColor);

                floatData[dst] = tempPosA.x;
                floatData[dst + 1] = tempPosA.y;
                floatData[dst + 2] = tempPosB.x;
                floatData[dst + 3] = tempPosB.y;
                uintData[dst + 4] = packColor(tempLightColor);
                if (useTint) {
                    uintData[dst + 5] = packColor(tempDarkColor);
                }
            }
        } else {
            let src = 0;
            const total = clippedVertices.length;

            for (let dst = vertexDataOffset; src < total; src += clippedVertexStep, dst += vertexStep) {
                floatData[dst] = clippedVertices[src];
                floatData[dst + 1] = clippedVertices[src + 1];
                floatData[dst + 2] = clippedVertices[src + 6];
                floatData[dst + 3] = clippedVertices[src + 7];

                lightColorUint = ((clippedVertices[src + 5] << 24) >>> 0) + (clippedVertices[src + 4] << 16) + (clippedVertices[src + 3] << 8) + clippedVertices[src + 2];
                uintData[dst + 4] = lightColorUint;

                if (useTint) {
                    darkColorUint = ((clippedVertices[src + 11] << 24) >>> 0) + (clippedVertices[src + 10] << 16) + (clippedVertices[src + 9] << 8) + clippedVertices[src + 8];
                    uintData[dst + 5] = darkColorUint;
                }
            }
        }
    } else if (vertexEffect) {
        for (let i = vertexDataOffset, end = vertexDataOffset + vertexDataCount; i < end; i += vertexStep) {
            tempPosA.x = floatData[i];
            tempPosA.y = floatData[i + 1];
            tempPosB.x = floatData[i + 2];
            tempPosB.y = floatData[i + 3];

            vertexEffect.transform(tempPosA, tempPosB, tempLightColor, tempDarkColor);

            floatData[i] = tempPosA.x;
            floatData[i + 1] = tempPosA.y;
            floatData[i + 2] = tempPosB.x;
            floatData[i + 3] = tempPosB.y;
            uintData[i + 4] = packColor(tempLightColor);
            if (useTint) {
                uintData[i + 5] = packColor(tempDarkColor);
            }
        }
    } else {
        lightColorUint = packColor(tempLightColor);
        darkColorUint = packColor(tempDarkColor);

        for (let i = vertexDataOffset, end = vertexDataOffset + vertexDataCount; i < end; i += vertexStep) {
            uintData[i + 4] = lightColorUint;
            if (useTint) {
                uintData[i + 5] = darkColorUint;
            }
        }
    }
};

SpineAssembler.realTimeTraverse = function (batchMatrix: any): void {
    const skeleton: any = component._skeleton;
    const skeletonColor = skeleton.color;
    const debugRenderer = component._debugRenderer;
    const clipper = component._clipper;

    startSlotIndex = component._startSlotIndex;
    endSlotIndex = component._endSlotIndex;
    rendering = false;
    if (startSlotIndex === -1) {
        rendering = true;
    }

    debugSlots = component.debugSlots;
    debugBones = component.debugBones;
    debugMesh = component.debugMesh;

    if (debugRenderer && (debugBones || debugSlots || debugMesh)) {
        debugRenderer.clear();
        debugRenderer.lineWidth = 2;
    }

    clippedVertexStep = useTint ? 12 : 8;
    vertexDataCount = 0;
    vertexDataOffset = 0;
    vertexOffset = 0;
    indexCount = 0;
    indexOffset = 0;

    for (let i = 0, len = skeleton.drawOrder.length; i < len; i++) {
        const slot: any = skeleton.drawOrder[i];
        if (slot == null || !slot.bone.active) {
            continue;
        }

        if (startSlotIndex >= 0 && startSlotIndex === slot.data.index) {
            rendering = true;
        }

        if (rendering) {
            if (endSlotIndex >= 0 && endSlotIndex === slot.data.index) {
                rendering = false;
            }

            vertexDataCount = 0;
            indexCount = 0;

            const attachment: any = slot.getAttachment();
            if (attachment) {
                const isRegion = attachment instanceof spine.RegionAttachment;
                const isMesh = attachment instanceof spine.MeshAttachment;

                if (attachment instanceof spine.ClippingAttachment) {
                    clipper.clipStart(slot, attachment);
                } else if (isRegion || isMesh) {
                    const material = getSpineMaterial(attachment.region.texture._texture, slot.data.blendMode);

                    if (material) {
                        if (needFlushMaterial || material.getHash() !== batcher.material.getHash()) {
                            needFlushMaterial = false;
                            batcher._flush();
                            batcher.node = renderNode;
                            batcher.material = material;
                        }

                        let vertexFloats: Float32Array;
                        let indices: number[];

                        if (isRegion) {
                            indices = REGION_INDICES;
                            vertexDataCount = 4 * vertexStep;
                            indexCount = 6;

                            const vb = buffer.request(4, 6);
                            indexOffset = vb.indiceOffset;
                            vertexOffset = vb.vertexOffset;
                            vertexDataOffset = vb.byteOffset >> 2;

                            vertexFloats = buffer._vData;
                            attachment.computeWorldVertices(slot.bone, vertexFloats, vertexDataOffset, vertexStep);

                            if (debugRenderer && debugSlots) {
                                debugRenderer.strokeColor = DEBUG_COLOR_BLUE;
                                debugRenderer.moveTo(vertexFloats[vertexDataOffset], vertexFloats[vertexDataOffset + 1]);
                                for (let d = vertexDataOffset + vertexStep, end = vertexDataOffset + vertexDataCount; d < end; d += vertexStep) {
                                    debugRenderer.lineTo(vertexFloats[d], vertexFloats[d + 1]);
                                }
                                debugRenderer.close();
                                debugRenderer.stroke();
                            }
                        } else {
                            indices = attachment.triangles;
                            vertexDataCount = (attachment.worldVerticesLength >> 1) * vertexStep;
                            indexCount = indices.length;

                            const vb = buffer.request(vertexDataCount / vertexStep, indexCount);
                            indexOffset = vb.indiceOffset;
                            vertexOffset = vb.vertexOffset;
                            vertexDataOffset = vb.byteOffset >> 2;

                            vertexFloats = buffer._vData;
                            attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vertexFloats, vertexDataOffset, vertexStep);

                            if (debugRenderer && debugMesh) {
                                debugRenderer.strokeColor = DEBUG_COLOR_YELLOW;
                                for (let d = 0, end = indices.length; d < end; d += 3) {
                                    const i0 = indices[d] * vertexStep + vertexDataOffset;
                                    const i1 = indices[d + 1] * vertexStep + vertexDataOffset;
                                    const i2 = indices[d + 2] * vertexStep + vertexDataOffset;
                                    debugRenderer.moveTo(vertexFloats[i0], vertexFloats[i0 + 1]);
                                    debugRenderer.lineTo(vertexFloats[i1], vertexFloats[i1 + 1]);
                                    debugRenderer.lineTo(vertexFloats[i2], vertexFloats[i2 + 1]);
                                    debugRenderer.close();
                                    debugRenderer.stroke();
                                }
                            }
                        }

                        if (vertexDataCount !== 0 && indexCount !== 0) {
                            const indexData: Uint16Array = buffer._iData;
                            indexData.set(indices, indexOffset);

                            const uvs = attachment.uvs;
                            for (let v = vertexDataOffset, end = vertexDataOffset + vertexDataCount, uv = 0; v < end; v += vertexStep, uv += 2) {
                                vertexFloats[v + 2] = uvs[uv];
                                vertexFloats[v + 3] = uvs[uv + 1];
                            }

                            const attachmentColor = attachment.color;
                            const boneColor = slot.color;

                            this.fillVertices(skeletonColor, attachmentColor, boneColor, clipper, slot);

                            vertexFloats = buffer._vData;

                            if (indexCount > 0) {
                                for (let d = indexOffset, end = indexOffset + indexCount; d < end; d++) {
                                    buffer._iData[d] += vertexOffset;
                                }

                                if (batchMatrix) {
                                    const m = batchMatrix.m;
                                    matA = m[0];
                                    matC = m[4];
                                    matTx = m[12];
                                    matB = m[1];
                                    matD = m[5];
                                    matTy = m[13];

                                    for (let d = vertexDataOffset, end = vertexDataOffset + vertexDataCount; d < end; d += vertexStep) {
                                        tempX = vertexFloats[d];
                                        tempY = vertexFloats[d + 1];
                                        vertexFloats[d] = tempX * matA + tempY * matC + matTx;
                                        vertexFloats[d + 1] = tempX * matB + tempY * matD + matTy;
                                    }
                                }

                                buffer.adjust(vertexDataCount / vertexStep, indexCount);
                            }
                        }

                        clipper.clipEndWithSlot(slot);
                    } else {
                        clipper.clipEndWithSlot(slot);
                    }
                } else {
                    clipper.clipEndWithSlot(slot);
                }
            } else {
                clipper.clipEndWithSlot(slot);
            }
        } else {
            clipper.clipEndWithSlot(slot);
        }
    }

    clipper.clipEnd();

    if (debugRenderer && debugBones) {
        debugRenderer.strokeColor = DEBUG_COLOR_RED;
        debugRenderer.fillColor = DEBUG_COLOR_BLUE;

        for (let i = 0, len = skeleton.bones.length; i < len; i++) {
            const bone: any = skeleton.bones[i];
            const endX = bone.data.length * bone.a + bone.worldX;
            const endY = bone.data.length * bone.c + bone.worldY;

            debugRenderer.moveTo(bone.worldX, bone.worldY);
            debugRenderer.lineTo(endX, endY);
            debugRenderer.stroke();
            debugRenderer.circle(bone.worldX, bone.worldY, 1.5 * Math.PI);
            debugRenderer.fill();

            if (i === 0) {
                debugRenderer.fillColor = DEBUG_COLOR_GREEN;
            }
        }
    }
};

SpineAssembler.cacheTraverse = function (batchMatrix: any): void {
    const frame: any = component._curFrame;
    if (!frame) {
        return;
    }

    const segments = frame.segments;
    if (segments.length === 0) {
        return;
    }

    const frameVertices = frame.vertices;
    const frameIndices = frame.indices;
    let vertexReadOffset = 0;
    let indexReadOffset = 0;

    if (batchMatrix) {
        const m = batchMatrix.m;
        matA = m[0];
        matB = m[1];
        matC = m[4];
        matD = m[5];
        matTx = m[12];
        matTy = m[13];
    }

    const bakedMaterial = 16 & bakeFlags;
    const isTranslateOnly = bakedMaterial && matA === 1 && matB === 0 && matC === 0 && matD === 1;

    let colorIndex = 0;
    const colors = frame.colors;
    let currentColor = colors[colorIndex++];
    let vfOffset = currentColor.vfOffset;

    updateTintColors(currentColor);

    for (let i = 0, len = segments.length; i < len; i++) {
        const segment = segments[i];
        const material = getSpineMaterial(segment.tex, segment.blendMode);

        if (material) {
            if (needFlushMaterial || material.getHash() !== batcher.material.getHash()) {
                needFlushMaterial = false;
                batcher._flush();
                batcher.node = renderNode;
                batcher.material = material;
            }

            const vertexCount = segment.vertexCount;
            const segmentIndexCount = segment.indexCount;

            const vb = buffer.request(vertexCount, segmentIndexCount);
            indexOffset = vb.indiceOffset;
            vertexOffset = vb.vertexOffset;
            cachedByteOffset = vb.byteOffset >> 2;

            const vertexFloats: Float32Array = buffer._vData;
            const indexData: Uint16Array = buffer._iData;
            const uintData: Uint32Array = buffer._uintVData;

            for (let d = indexOffset, end = indexOffset + segmentIndexCount; d < end; d++) {
                indexData[d] = vertexOffset + frameIndices[indexReadOffset++];
            }

            const vfCount = segment.vfCount;
            vertexFloats.set(frameVertices.subarray(vertexReadOffset, vertexReadOffset + vfCount), cachedByteOffset);
            vertexReadOffset += vfCount;

            if (isTranslateOnly) {
                for (let d = cachedByteOffset, end = cachedByteOffset + vfCount; d < end; d += 6) {
                    vertexFloats[d] += matTx;
                    vertexFloats[d + 1] += matTy;
                }
            } else if (bakedMaterial) {
                for (let d = cachedByteOffset, end = cachedByteOffset + vfCount; d < end; d += 6) {
                    tempX = vertexFloats[d];
                    tempY = vertexFloats[d + 1];
                    vertexFloats[d] = tempX * matA + tempY * matC + matTx;
                    vertexFloats[d + 1] = tempX * matB + tempY * matD + matTy;
                }
            }

            buffer.adjust(vertexCount, segmentIndexCount);

            if (needTintColor) {
                let readOffset = vertexReadOffset - vfCount;

                for (let d = cachedByteOffset + 4, end = cachedByteOffset + 4 + vfCount; d < end; d += 6, readOffset += 6) {
                    if (readOffset >= vfOffset) {
                        currentColor = colors[colorIndex++];
                        updateTintColors(currentColor);
                        vfOffset = currentColor.vfOffset;
                    }

                    uintData[d] = lightColorUint;
                    uintData[d + 1] = darkColorUint;
                }
            }
        }
    }
};

SpineAssembler.fillBuffers = function (comp: any, batcherRef: any): void {
    const node = comp.node;
    node._renderFlag |= cc.RenderFlow.FLAG_UPDATE_RENDER_DATA;

    if (!comp._skeleton) {
        return;
    }

    const color = node._color;
    nodeColorR = color.r / 255;
    nodeColorG = color.g / 255;
    nodeColorB = color.b / 255;
    nodeColorA = color.a / 255;

    useTint = comp.useTint || comp.isAnimationCached();
    vertexFormat = useTint ? vfmtPosUvTwoColor : vfmtPosUvColor;
    vertexStep = useTint ? 6 : 5;

    renderNode = comp.node;
    buffer = batcherRef.getBuffer("spine", vertexFormat);
    batcher = batcherRef;
    component = comp;
    needFlushMaterial = true;

    premultipliedAlpha = comp.premultipliedAlpha;
    colorScale = 1;
    bakeFlags = 0;
    needTintColor = false;

    vertexEffect = comp._effectDelegate && comp._effectDelegate._vertexEffect;

    if (color._val !== 4294967295 || premultipliedAlpha) {
        needTintColor = true;
    }
    if (useTint) {
        bakeFlags |= 1;
    }

    let batchMatrix: any = undefined;
    if (component.enableBatch) {
        batchMatrix = renderNode._worldMatrix;
        needFlushMaterial = false;
        bakeFlags |= 16;
    }

    if (comp.isAnimationCached()) {
        this.cacheTraverse(batchMatrix);
    } else {
        if (vertexEffect) {
            vertexEffect.begin(comp._skeleton);
        }
        this.realTimeTraverse(batchMatrix);
        if (vertexEffect) {
            vertexEffect.end();
        }
    }

    renderNode = null;
    buffer = null;
    batcher = null;
    component = null;
    vertexEffect = null;
};

export {};