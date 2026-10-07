import Handler from "./Handler";
import Service from "./Service";
import UrlMgr from "./UrlMgr";

export default class HttpHandler {
    _successHandle: Handler = null;
    _failHandle: Handler = null;
    _requestType: any = null;
    _requestData: any = null;
    _retry = false;

    static _pool: HttpHandler[] = [];

    constructor(requestType: any, successHandle: Handler, failHandle: Handler) {
        this.setHandler(requestType, successHandle, failHandle);
    }

    clear(): this {
        this._requestType = null;
        this._requestData = null;
        if (this._successHandle) {
            this._successHandle.recover();
        }
        if (this._failHandle) {
            this._failHandle.recover();
        }
        return this;
    }

    setHandler(requestType: any, successHandle: Handler, failHandle: Handler): this {
        this.setRequest(requestType);
        this._successHandle = successHandle;
        this._failHandle = failHandle;
        return this;
    }

    setRequest(requestType: any): this {
        this._requestType = requestType;
        this._requestData = null;
        this._retry = UrlMgr.getInstance().needEnqueue(this._requestType);
        return this;
    }

    getRequestData(): any {
        return this._requestData;
    }

    enterQueue(): boolean {
        return UrlMgr.getInstance().needEnqueue(this._requestType);
    }

    getRequestType(): any {
        return this._requestType;
    }

    setRequestData(data: any = null): this {
        this._requestData = data;
        return this;
    }

    setRetry(retry: boolean): this {
        this._retry = retry;
        return this;
    }

    static create(requestType: any, successHandle: Handler, failHandle: Handler): HttpHandler {
        if (HttpHandler._pool.length) {
            return HttpHandler._pool.pop().setHandler(requestType, successHandle, failHandle);
        }
        return new HttpHandler(requestType, successHandle, failHandle);
    }

    success(data: any): boolean {
        if (this._successHandle) {
            this._successHandle.runWith(data);
        }
        this.recover();
        return false;
    }

    needRetry(): boolean {
        return this._retry;
    }

    fail(data: any): boolean {
        if (this._failHandle) {
            this._failHandle.runWith(data);
        }
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
