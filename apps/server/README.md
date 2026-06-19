# Colyseus Node Game Server

一个基于 Colyseus、Express 和 TypeScript 的游戏服务器基础项目。

## 功能

- Colyseus WebSocket 游戏服务器
- `game_room` 示例房间
- 基于 `@colyseus/schema` 的状态同步
- 玩家加入、离开、移动消息处理
- HTTP 健康检查：`GET /health`
- Colyseus Monitor：`/colyseus`
- 基于 `@repo/auth` 的 Room 准入校验
- 基于 `@repo/shared` 的房间名和消息协议

## 快速开始

```bash
npm install
npm run dev
```

默认监听 `http://localhost:2567`。

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
  token: "dev:user-1",
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
