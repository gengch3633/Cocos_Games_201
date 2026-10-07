export class LZFAHNEP {
    static _instance: LZFAHNEP = null;

    static JSMUTJPLNP(): LZFAHNEP {
        if (this._instance == null) {
            this._instance = new this();
        }
        return this._instance;
    }
}
