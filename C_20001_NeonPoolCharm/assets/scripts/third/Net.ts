let url = "http://127.0.0.1:8081/";
let lockTime = 0;
let lockPath = "";

const Net = {
    CMD_insertLog: "ball/insertLog",
    CMD_updateInfo: "ball/updateInfo",
    CMD_getInfo: "ball/getInfo",
    CMD_addAdvice: "ball/addAdvice",
    CMD_getRanklist: "ball/getRanklist",
    CMD_getID: "ball/getID",
    CMD_initEnv: "ball/initEnv",
    CMD_updateUserInfoKV: "ball/updateUserInfoKV",
    CMD_getMovieInfo: "ball/getMovieInfo",
    CMD_getPublicTableInfo: "ball/getPublicTableInfo",
    CMD_createOnePublicTableInfo: "ball/createOnePublicTableInfo",
    CMD_updateOnePublicTableInfo: "ball/updateOnePublicTableInfo",
    CMD_removeOnePublicTableInfo: "ball/removeOnePublicTableInfo",
    CMD_createOneTableInfo: "ball/createOneTableInfo",
    CMD_saveOneTableInfo: "ball/saveOneTableInfo",
    CMD_saveTablesInfo: "ball/saveTablesInfo",
    CMD_getTablesInfo: "ball/getTablesInfo",

    set_url(e: string): void {
        url = e;
    },

    get_test(): void {
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                const responseText = xhr.responseText;
                console.log(responseText);
            }
        };
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        xhr.send();
    },

    do_post(
        path: string,
        data: any,
        callback?: (success: boolean, responseText?: string, status?: number) => void,
        isPost?: boolean
    ): void {
        console.log("do_post", path);
        if (lockTime != 0) {
            const now = new Date().getTime();
            if (now - lockTime < 1000 && lockPath == path) {
                console.log("lock ms too short", now - lockTime, lockPath == path);
                return;
            }
        }
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    console.log("recv suc", xhr.readyState, xhr.status);
                    lockTime = 0;
                    callback && callback(true, xhr.responseText, xhr.status);
                } else {
                    console.log("recv fail", xhr.readyState, xhr.status);
                    lockTime = 0;
                    callback && callback(false, xhr.responseText, xhr.status);
                }
            }
        };
        xhr.open(isPost ? "POST" : "GET", url + path, true);
        xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
        console.log("xhr.open", isPost ? "POST" : "GET", url + path);
        lockTime = new Date().getTime();
        lockPath = path;
    },

    do_get(
        requestUrl: string,
        _params: any,
        callback?: (success: boolean, data?: any, status?: number) => void
    ): void {
        console.log("do_get", requestUrl, _params);
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    console.log("do_get recv suc", xhr.readyState, xhr.status, xhr.responseText, typeof xhr.responseText);
                    if (callback) {
                        const parsed = JSON.parse(xhr.responseText);
                        callback(true, parsed, xhr.status);
                    }
                } else {
                    console.log("do_get recv fail", xhr.readyState, xhr.status);
                    callback && callback(false, xhr.status);
                }
            }
        };
        xhr.open("GET", requestUrl, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.send(null);
    },
};

export default Net;
