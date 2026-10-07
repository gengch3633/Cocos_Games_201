export class Debugger {
    private static __EEDf3Qu617zS_: boolean;
    private static __23OhBV67Gs0dganx: boolean;

    static get skipVideo(): boolean {
        return true === Debugger.__EEDf3Qu617zS_;
    }

    static get isDebugMode(): boolean {
        return true === Debugger.__23OhBV67Gs0dganx;
    }
}
