export default class ImageUtil {
    static getTrim(data, width, height) {
        let minX;
        let maxX;
        let minY;
        let x = 0;
        let y = 0;
        const stride = 4 * width;
        scanLeft: for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                if (0 !== data[stride * y + 4 * x + 3]) {
                    break scanLeft;
                }
            }
        }
        minX = x;
        scanRight: for (x = width - 1; x >= 0; x--) {
            for (y = 0; y < height; y++) {
                if (0 !== data[stride * y + 4 * x + 3]) {
                    break scanRight;
                }
            }
        }
        maxX = x + 1;
        scanTop: for (x = 0; x < height; x++) {
            for (y = 0; y < width; y++) {
                if (0 !== data[stride * x + 4 * y + 3]) {
                    break scanTop;
                }
            }
        }
        minY = x;
        scanBottom: for (x = height - 1; x >= 0; x--) {
            for (y = 0; y < width; y++) {
                if (0 !== data[stride * x + 4 * y + 3]) {
                    break scanBottom;
                }
            }
        }
        return {
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: x + 1
        };
    }
}
