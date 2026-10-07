export default class ImageUtil {
    static getTrim(
        data: number[] | Uint8Array,
        width: number,
        height: number
    ): { minX: number; maxX: number; minY: number; maxY: number } {
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let rowBytes = 4 * width;

        outerTop: for (minX = 0; minX < width; minX++) {
            for (let y = 0; y < height; y++) {
                if (data[rowBytes * y + 4 * minX + 3] !== 0) {
                    break outerTop;
                }
            }
        }

        outerBottom: for (let x = width - 1; x >= 0; x--) {
            for (let y = 0; y < height; y++) {
                if (data[rowBytes * y + 4 * x + 3] !== 0) {
                    maxX = x + 1;
                    break outerBottom;
                }
            }
        }

        outerLeft: for (minY = 0; minY < height; minY++) {
            for (let x = 0; x < width; x++) {
                if (data[rowBytes * minY + 4 * x + 3] !== 0) {
                    break outerLeft;
                }
            }
        }

        outerRight: for (let y = height - 1; y >= 0; y--) {
            for (let x = 0; x < width; x++) {
                if (data[rowBytes * y + 4 * x + 3] !== 0) {
                    return {
                        minX,
                        maxX,
                        minY,
                        maxY: y + 1,
                    };
                }
            }
        }

        return { minX, maxX, minY, maxY: 0 };
    }
}
