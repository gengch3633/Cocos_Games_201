import Service from "./Service";
import UrlMgr from "./UrlMgr";
import Handler from "./Handler";

export default class HttpHandler {
    static _pool: HttpHandler[] = [];

    private _successHandle: Handler = null;
    private _failHandle: Handler = null;
    private _requestType: string = null;
    private _requestData: unknown = null;
    private _retry = false;

    constructor(requestType?: string, successHandle?: Handler, failHandle?: Handler) {
        this.setHandler(requestType, successHandle, failHandle);
    }

    clear(): this {
        this._requestType = null;
        this._requestData = null;
        this._successHandle?.recover();
        this._failHandle?.recover();
        return this;
    }

    setHandler(requestType: string, successHandle: Handler, failHandle: Handler): this {
        this.setRequest(requestType);
        this._successHandle = successHandle;
        this._failHandle = failHandle;
        return this;
    }

    setRequest(requestType: string): this {
        this._requestType = requestType;
        this._requestData = null;
        this._retry = UrlMgr.getInstance().needEnqueue(this._requestType);
        return this;
    }

    getRequestData(): unknown {
        return this._requestData;
    }

    enterQueue(): boolean {
        return UrlMgr.getInstance().needEnqueue(this._requestType);
    }

    getRequestType(): string {
        return this._requestType;
    }

    setRequestData(data: unknown = null): this {
        this._requestData = data;
        return this;
    }

    setRetry(retry: boolean): this {
        this._retry = retry;
        return this;
    }

    static create(requestType: string, successHandle: Handler, failHandle: Handler): HttpHandler {
        if (HttpHandler._pool.length) {
            return HttpHandler._pool.pop().setHandler(requestType, successHandle, failHandle);
        }
        return new HttpHandler(requestType, successHandle, failHandle);
    }

    success(data: unknown): boolean {
        this._successHandle?.runWith(data);
        this.recover();
        return false;
    }

    needRetry(): boolean {
        return this._retry;
    }

    fail(data: unknown): boolean {
        this._failHandle?.runWith(data);
        if (this._retry) {
            return true;
        }
        this.recover();
        return false;
    }

    recover(): void {
        HttpHandler._pool.push(this.clear());
    }

    handleRequest(): void {
        Service.request(this);
    }
}
