export default class ImageUtil {
    static getTrim(
        pixels: ArrayLike<number>,
        width: number,
        height: number
    ): { minX: number; maxX: number; minY: number; maxY: number } {
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;
        const rowStride = 4 * width;

        top: for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (pixels[rowStride * y + 4 * x + 3] !== 0) {
                    minX = x;
                    break top;
                }
            }
        }

        bottom: for (let x = width - 1; x >= 0; x--) {
            for (let y = 0; y < height; y++) {
                if (pixels[rowStride * y + 4 * x + 3] !== 0) {
                    maxX = x + 1;
                    break bottom;
                }
            }
        }

        left: for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (pixels[rowStride * y + 4 * x + 3] !== 0) {
                    minY = y;
                    break left;
                }
            }
        }

        right: for (let y = height - 1; y >= 0; y--) {
            for (let x = 0; x < width; x++) {
                if (pixels[rowStride * y + 4 * x + 3] !== 0) {
                    maxY = y + 1;
                    break right;
                }
            }
        }

        return { minX, maxX, minY, maxY };
    }
}
