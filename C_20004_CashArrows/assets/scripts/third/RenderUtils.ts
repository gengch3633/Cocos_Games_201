const { ccclass, property } = cc._decorator;

@ccclass
export default class RenderUtils {
    public static getRenderTexture(node: cc.Node, texture?: cc.RenderTexture): cc.RenderTexture | null {
        if (!cc.isValid(node)) {
            return null;
        }
        if (!texture || !(texture instanceof cc.RenderTexture)) {
            texture = new cc.RenderTexture();
        }
        const width = Math.floor(node.width);
        const height = Math.floor(node.height);
        texture.initWithSize(width, height);
        const cameraNode = new cc.Node();
        cameraNode.parent = node;
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        camera.targetTexture = texture;
        camera.render(node);
        cameraNode.destroy();
        return texture;
    }

    public static getPixelsData(node: cc.Node, flipY: boolean = true): Uint8Array | null {
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

    public static flipY(pixels: Uint8Array, rowBytes: number): Uint8Array {
        const length = pixels.length;
        const result = new Uint8Array(length);
        let srcIndex = 0;
        let dstIndex = length - rowBytes;
        for (; srcIndex < length; srcIndex += rowBytes, dstIndex -= rowBytes) {
            for (let i = 0; i < rowBytes; i++) {
                result[srcIndex + i] = pixels[dstIndex + i];
            }
        }
        return result;
    }

    public static hitColor(node: cc.Node, worldPos: cc.Vec2, out?: cc.Color): cc.Color | null {
        if (!cc.isValid(node)) {
            return null;
        }
        const pixels = RenderUtils.getPixelsData(node);
        if (!pixels) {
            return null;
        }
        const localPos = node.parent.convertToNodeSpaceAR(worldPos);
        const x = localPos.x + node.anchorX * node.width;
        const y = -(localPos.y - node.anchorY * node.height);
        const index = 4 * node.width * Math.floor(y) + 4 * Math.floor(x);
        const colorData = pixels.slice(index, index + 4);
        if (!out) {
            out = new cc.Color();
        }
        out.r = colorData[0];
        out.g = colorData[1];
        out.b = colorData[2];
        out.a = colorData[3];
        return out;
    }
}