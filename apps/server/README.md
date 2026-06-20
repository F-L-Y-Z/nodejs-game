# Colyseus Node Game Server

一个基于 Colyseus、Express 和 TypeScript 的游戏服务器基础项目。

## 功能

- Colyseus WebSocket 游戏服务器
- `game_room` 示例房间
- 基于 `@colyseus/schema` 的状态同步
- 玩家加入、离开、移动消息处理
- HTTP 健康检查：`GET /health`
- 微信小游戏登录：`POST /auth/wechat/minigame/login`
- Colyseus Monitor：`/colyseus`
- 基于 `@repo/auth` 的 Room 准入校验
- 基于 `@repo/shared` 的房间名和消息协议

## 快速开始

```bash
npm install
npm run dev
```

默认监听 `http://localhost:2567`。

## 环境变量

服务启动时会自动加载 `.env` 文件。加载顺序如下，后面的文件会覆盖前面的文件；真实进程环境变量优先级最高，不会被 `.env` 覆盖。

```text
仓库根目录/.env
仓库根目录/.env.local
apps/server/.env
apps/server/.env.local
```

可以从 `apps/server/.env.example` 复制一份到 `apps/server/.env`：

```bash
PORT=2567
WECHAT_MINIGAME_APP_ID=your-appid
WECHAT_MINIGAME_APP_SECRET=your-secret
WECHAT_MINIGAME_APPS={"mahjong":{"appId":"wx...","appSecret":"..."}}
WECHAT_MINIGAME_MOCK_LOGIN=false
AUTH_TOKEN_SECRET=replace-with-a-long-random-secret
AUTH_TOKEN_TTL_SECONDS=604800
AUTH_ALLOW_DEV_TOKENS=true
```

生产环境必须配置 `AUTH_TOKEN_SECRET` 和微信小游戏配置。单个小游戏可以继续使用 `WECHAT_MINIGAME_APP_ID` / `WECHAT_MINIGAME_APP_SECRET`；多个小游戏共用服务端时，使用 `WECHAT_MINIGAME_APPS`。

`WECHAT_MINIGAME_APPS` 是按 `gameId` 索引的 JSON 对象：

```bash
WECHAT_MINIGAME_APPS='{
  "mahjong": {"appId": "wx-mahjong-appid", "appSecret": "mahjong-secret"},
  "poker": {"appId": "wx-poker-appid", "appSecret": "poker-secret"}
}'
```

客户端登录时必须传 `gameId`，服务端用它选择对应的 `appid/appSecret` 调微信 `jscode2session`。签发的 token 也会带上 `gameId`，用户 ID 格式为 `wechat:{gameId}:{openid}`，避免不同小游戏的 openid 混用。

`AUTH_ALLOW_DEV_TOKENS` 默认开启，方便本地继续使用 `dev:user-1`；生产环境建议设置为 `false`。本地没有微信小游戏密钥时，可以临时设置 `WECHAT_MINIGAME_MOCK_LOGIN=true` 跳过微信 `jscode2session`，服务端会用传入的 `gameId` 和 `code` 生成 mock openid 并签发内部 token。这个开关只用于开发联调。

## 微信小游戏登录

客户端先调用 `wx.login` 拿到临时 `code`，再交给服务端换取登录态：

```ts
const loginResult = await wx.login();
const response = await fetch("http://localhost:2567/auth/wechat/minigame/login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    gameId: "mahjong",
    code: loginResult.code,
    name: userInfo.nickName,
    avatarUrl: userInfo.avatarUrl,
  }),
});
const { token } = await response.json();
```

服务端会调用微信 `jscode2session`，用返回的 `openid` 生成内部用户 ID，并签发房间连接使用的服务端 token。`name` 和 `avatarUrl` 来自客户端用户主动授权后的微信用户信息；服务端不能仅凭 `code/openid` 自动获取头像昵称。

## 脚本

```bash
npm run dev        # 开发模式，监听文件变化
npm run build      # 编译到 dist/
npm start          # 运行编译后的服务
npm run typecheck  # 类型检查
```

## 客户端连接示例

```ts
import { Client } from "colyseus.js";

const client = new Client("ws://localhost:2567");
const room = await client.joinOrCreate("game_room", {
  token,
  name: "player",
});

room.onStateChange((state) => {
  console.log(state.players);
});

room.send("move", { x: 1, y: 0 });
```

## 项目结构

```text
src/
  index.ts              # 服务入口
  rooms/
    GameRoom.ts         # Colyseus 房间逻辑
  schemas/
    GameState.ts        # 同步状态模型
```
