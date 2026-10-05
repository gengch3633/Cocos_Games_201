let baseUrl = "http://127.0.0.1:8081/";
let lastRequestTime = 0;
let lastRequestPath = "";

export const CMD_insertLog = "ball/insertLog";
export const CMD_updateInfo = "ball/updateInfo";
export const CMD_getInfo = "ball/getInfo";
export const CMD_addAdvice = "ball/addAdvice";
export const CMD_getRanklist = "ball/getRanklist";
export const CMD_getID = "ball/getID";
export const CMD_initEnv = "ball/initEnv";
export const CMD_updateUserInfoKV = "ball/updateUserInfoKV";
export const CMD_getMovieInfo = "ball/getMovieInfo";
export const CMD_getPublicTableInfo = "ball/getPublicTableInfo";
export const CMD_createOnePublicTableInfo = "ball/createOnePublicTableInfo";
export const CMD_updateOnePublicTableInfo = "ball/updateOnePublicTableInfo";
export const CMD_removeOnePublicTableInfo = "ball/removeOnePublicTableInfo";
export const CMD_createOneTableInfo = "ball/createOneTableInfo";
export const CMD_saveOneTableInfo = "ball/saveOneTableInfo";
export const CMD_saveTablesInfo = "ball/saveTablesInfo";
export const CMD_getTablesInfo = "ball/getTablesInfo";

export function set_url(url: string): void {
    baseUrl = url;
}

export function get_test(): void {
    const xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
            console.log(xhr.responseText);
        }
    };
    xhr.open("GET", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    xhr.send();
}

export function do_post(
    path: string,
    data: unknown,
    callback?: (success: boolean, responseText: string, status: number) => void,
    usePost = true
): void {
    console.log("do_post", path);
    if (lastRequestTime != 0) {
        const now = new Date().getTime();
        if (now - lastRequestTime < 1000 && lastRequestPath == path) {
            console.log("lock ms too short", now - lastRequestTime, lastRequestPath == path);
            return;
        }
    }
    const xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                console.log("recv suc", xhr.readyState, xhr.status);
                lastRequestTime = 0;
                callback?.(true, xhr.responseText, xhr.status);
            } else {
                console.log("recv fail", xhr.readyState, xhr.status);
                lastRequestTime = 0;
                callback?.(false, xhr.responseText, xhr.status);
            }
        }
    };
    xhr.open(usePost ? "POST" : "GET", baseUrl + path, true);
    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
    console.log("xhr.open", usePost ? "POST" : "GET", baseUrl + path);
    lastRequestTime = new Date().getTime();
    lastRequestPath = path;
}

export function do_get(
    url: string,
    _data: unknown,
    callback?: (success: boolean, response: unknown, status: number) => void
): void {
    console.log("do_get", url);
    const xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                console.log("do_get recv suc", xhr.readyState, xhr.status, xhr.responseText, typeof xhr.responseText);
                if (callback) {
                    const parsed = JSON.parse(xhr.responseText);
                    callback(true, parsed, xhr.status);
                }
            } else {
                console.log("do_get recv fail", xhr.readyState, xhr.status);
                callback?.(false, xhr.status, xhr.status);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.send(null);
}
