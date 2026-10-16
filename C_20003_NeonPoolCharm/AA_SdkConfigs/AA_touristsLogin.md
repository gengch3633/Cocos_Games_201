# touristsLogin 游客登录接口

> 来源梳理：`assets/scripts/third/BaseSystem.ts`（接口层，本项目已 mock）、`loadingCN.ts`（调用方）、`LocalServer.ts`（mock 数据）、`HttpUtil.ts`（响应解析）、`PlayerDataSys.ts`（data 消费方）、`UrlMgr.ts`（真实 uri）。

## 1. 接口基本信息

| 项 | 内容 |
| --- | --- |
| 接口名 | `touristsLogin`（游客登录） |
| 真实请求 uri | `POST login/tourists_submit`（`UrlMgr.RequestType.TouristLogin`） |
| 关联接口 | `autoLogin` 直接复用 `touristsLogin` 逻辑（uri 为 `login/auto_submit`） |
| 请求参数 | `{ black_box }`：同盾设备指纹 black_box（`SdkHelper.requestTDId()`，Android/iOS 原生获取，可为空）；另附通用 form 参数（`dev_token`、`business_data` 等，`business_data` 可整体 AES 加密） |
| 当前状态 | 本项目业务接口已全部 mock，无真实请求；`BaseSystem.touristsLogin` → `LocalServer.requestLogin()` 固定返回成功空数据 |

## 2. 返回参数结构

统一响应协议（与全项目业务接口一致）：

```json
{
  "code": 1,
  "data": {
    "user_id": "xxx",
    "user_name": "xxx",
    "yid": "xxx"
  },
  "ecp": 0,
  "message": ""
}
```

### 顶层字段

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `code` | number | 业务状态码，详见下方「code 取值」 |
| `data` | object | 登录结果数据；`101/102` 拦截时为空对象 `{}` |
| `ecp` | number | **加密标记**：真值表示 `data` 为 AES 加密字符串，客户端用 `SdkHelper.getAesDncrypData()` 解密后再 `JSON.parse`；`0`/假值表示明文（见 `HttpUtil._Post`） |
| `message` | string | 失败提示文案（通用协议中 toast 直接弹出），成功时为 `""` |

### data 字段（code = 1 成功时）

| 字段 | 类型 | 含义 | 客户端去向 |
| --- | --- | --- | --- |
| `user_id` | string | 服务器分配的用户 ID | `PlayerDataSys.user_id`（`initUserId`） |
| `user_name` | string | 用户名/昵称 | `PlayerDataSys.user_name` |
| `yid` | string | 游客设备唯一标识（登录凭证） | `PlayerDataSys.yid`、`ClientData.yid`，并写入 localStorage `"yid"`，供下次启动 `autoLogin`/本地恢复使用；读取失败时兜底 `"yid_read_failed"` |

## 3. code 取值

| code | 含义 | 触发条件（客户端侧） | 客户端表现 |
| --- | --- | --- | --- |
| `1` | 登录成功 | 正常流程 | `PlayerDataSys.initUserId(res.data)` 初始化用户 → `getGameConfig()` → `getUserInfo()` 继续加载 |
| `2` | 失败（通用协议） | 业务失败 | `message` 作为 toast 弹出 |
| `101` | **IP 限制拦截**（地区限制） | 原生端 && 非内网 && kickstart 下发配置 `IP_RESTRICT` 开启 && `GameHelper.spawn`（中台下发的渠道/地区标记）命中 | 停止 loading，弹 `BlockPage`，`type: "area"`（文案 `pkey_040`），流程中止 |
| `102` | **VPN 限制拦截**（VPN/代理） | 原生端 && 非内网 && `VPN_RESTRICT` 开启 && (`PoolNative.isVPNEnabled` \|\| `isProxyEnabled`) && 非 `GameHelper.pocketed`（非提审/内部标记） | 同上，`BlockPage` `type: "vpn"`（文案 `pkey_039`），流程中止 |
| `-1` / `-1000` | 会话失效等致命错误 | `HttpUtil` 层判定 | 走 fail 回调 → `frameworkManager.httpErr` 弹窗重试 |

> 说明：本项目 mock 版本中，`101/102` 由 `BaseSystem.touristsLogin` 在客户端按 kickstart 配置（`IP_RESTRICT`/`VPN_RESTRICT` 开关）模拟生成，结构与真实服务器返回一致；真实环境中这两个码由服务器下发。

## 4. 调用链

```
loadingCN.touristsLogin()
  └─ BaseSystem.touristsLogin({ black_box }, success, fail)
       ├─ CoinfinityRideress.electroretinogram() 取 kickstart 配置（IP_RESTRICT/VPN_RESTRICT 等）
       ├─ 命中 IP_RESTRICT  → 返回 { code: 101, data: {}, ecp: 0, message: "" }
       ├─ 命中 VPN_RESTRICT → 返回 { code: 102, data: {}, ecp: 0, message: "" }
       ├─ GameConfigurations.updateWebConfig / updateNewBallConfig（应用下发配置）
       └─ LocalServer.requestLogin()（mock）/ 真实环境 POST login/tourists_submit
            → 返回 { code: 1, data: { user_id, user_name, yid }, ecp: 0, message: "" }
```

- 成功回调中：`code 101/102` → `BlockPage`（area/vpn）；其余 → `initUserId` + 拉取用户数据进入游戏。
- 失败回调（网络错误、`code -1/-1000`）：`frameworkManager.httpErr` → 用户确认后重试 `touristsLogin(retry)`。
