export function getCryptoJS(): any {
    const crypto =
        (typeof window !== "undefined" && (window as any).CryptoJS) ||
        (typeof globalThis !== "undefined" && (globalThis as any).CryptoJS);
    if (!crypto?.enc?.Utf8) {
        throw new Error("CryptoJS is not loaded");
    }
    return crypto;
}
