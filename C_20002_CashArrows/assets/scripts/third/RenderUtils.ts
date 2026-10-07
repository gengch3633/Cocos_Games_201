export default class RenderUtils {
    static getRenderTexture(node: cc.Node, renderTexture?: cc.RenderTexture): cc.RenderTexture {
        if (!cc.isValid(node)) {
            return null;
        }
        if (!renderTexture || !(renderTexture instanceof cc.RenderTexture)) {
            renderTexture = new cc.RenderTexture();
        }
        const width = Math.floor(node.width);
        const height = Math.floor(node.height);
        renderTexture.initWithSize(width, height);
        const cameraNode = new cc.Node();
        cameraNode.parent = node;
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        camera.targetTexture = renderTexture;
        camera.render(node);
        cameraNode.destroy();
        return renderTexture;
    }

    static getPixelsData(node: cc.Node, flipY: boolean = true): Uint8Array {
        if (!cc.isValid(node)) {
            return null;
        }
        const width = Math.floor(node.width);
        const height = Math.floor(node.height);
        const cameraNode = new cc.Node();
        cameraNode.parent = node;
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        const renderTexture = new cc.RenderTexture();
        renderTexture.initWithSize(width, height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
        camera.targetTexture = renderTexture;
        camera.render(node);
        const pixels = renderTexture.readPixels();
        renderTexture.destroy();
        cameraNode.destroy();
        return flipY ? RenderUtils.flipY(pixels, 4 * width) : pixels;
    }

    static flipY(data: Uint8Array, rowBytes: number): Uint8Array {
        const length = data.length;
        const result = new Uint8Array(length);
        let srcOffset = length - rowBytes;
        for (let dstOffset = 0; dstOffset < length; dstOffset += rowBytes, srcOffset -= rowBytes) {
            for (let i = 0; i < rowBytes; i++) {
                result[dstOffset + i] = data[srcOffset + i];
            }
        }
        return result;
    }

    static hitColor(node: cc.Node, worldPos: cc.Vec2, outColor?: cc.Color): cc.Color {
        if (!cc.isValid(node)) {
            return null;
        }
        const pixels = RenderUtils.getPixelsData(node);
        const localPos = node.parent.convertToNodeSpaceAR(worldPos);
        const x = localPos.x + node.anchorX * node.width;
        const y = -(localPos.y - node.anchorY * node.height);
        const offset = 4 * node.width * Math.floor(y) + 4 * Math.floor(x);
        const rgba = pixels.slice(offset, offset + 4);
        if (!outColor) {
            outColor = new cc.Color();
        }
        outColor.r = rgba[0];
        outColor.g = rgba[1];
        outColor.b = rgba[2];
        outColor.a = rgba[3];
        return outColor;
    }
}
