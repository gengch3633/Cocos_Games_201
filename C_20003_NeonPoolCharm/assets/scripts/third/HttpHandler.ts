import Service from "./Service";
import UrlMgr from "./UrlMgr";

export default class HttpHandler {

    _successHandle = null;
    _failHandle = null;
    _requestType = null;
    _requestData = null;
    _retry = false;

    static _pool: HttpHandler[] = [];

    constructor(requestType, successHandle, failHandle) {
        this.setHandler(requestType, successHandle, failHandle);
    }

    clear() {
        this._requestType = null;
        this._requestData = null;
        this._successHandle && this._successHandle.recover();
        this._failHandle && this._failHandle.recover();
        return this;
    }

    setHandler(requestType, successHandle, failHandle) {
        this.setRequest(requestType);
        this._successHandle = successHandle;
        this._failHandle = failHandle;
        return this;
    }

    setRequest(requestType) {
        this._requestType = requestType;
        this._requestData = null;
        this._retry = UrlMgr.getInstance().needEnqueue(this._requestType);
        return this;
    }

    getRequestData() {
        return this._requestData;
    }

    enterQueue() {
        return UrlMgr.getInstance().needEnqueue(this._requestType);
    }

    getRequestType() {
        return this._requestType;
    }

    setRequestData(data?) {
        if (undefined === data) {
            data = null;
        }
        this._requestData = data;
        return this;
    }

    setRetry(retry) {
        this._retry = retry;
        return this;
    }

    static create(requestType, successHandle, failHandle) {
        return HttpHandler._pool.length ? HttpHandler._pool.pop().setHandler(requestType, successHandle, failHandle) : new HttpHandler(requestType, successHandle, failHandle);
    }

    success(data) {
        this._successHandle && this._successHandle.runWith(data);
        this.recover();
        return false;
    }

    needRetry() {
        return this._retry;
    }

    fail(data) {
        this._failHandle && this._failHandle.runWith(data);
        if (this._retry) {
            return true;
        }
        this.recover();
        return false;
    }

    recover() {
        HttpHandler._pool.push(this.clear());
    }

    handleRequest() {
        Service.request(this);
    }
}
