# 多人麻将架构迁移

本文记录当前从自定义 HTTP/WebSocket 好友房迁移到 Colyseus Room 的工作边界。

## 目标架构

```txt
apps/
  server/        业务服务端，包含 MahjongRoom 和麻将规则编排
  wx-mahjong/    微信小游戏客户端

packages/
  shared/        跨端协议、房间名、消息名、payload 类型
  auth/          鉴权类型和服务端 token 校验边界
  config/        环境变量解析
  logger/        日志接口
  server-kit/    服务端通用 Express/Colyseus 辅助
  validators/    运行时校验工具
```

依赖方向保持为 `apps/* -> packages/*`。`packages` 不依赖具体业务应用；麻将规则、房间生命周期和 AI 陪玩属于业务代码，保留在 `apps/server`。

## Colyseus 迁移步骤

1. 服务端注册 `mahjong_room`，使用 Colyseus Room 生命周期管理连接。
2. `onAuth` 校验登录 token，禁止客户端伪造 `userId`。
3. `onJoin` 根据 `userId` 恢复座位或替换同账号旧连接。
4. 客户端通过 Colyseus SDK 创建/加入房间，并监听 `mahjong_snapshot`。
5. 删除旧的 `/mahjong/rooms` HTTP 轮询和 `/mahjong/ws` 自定义 WebSocket。
6. 验证 `/colyseus` monitor 能看到真实 `mahjong_room` 实例。

## 迁移期状态

- 服务端已经新增 `apps/server/src/rooms/mahjong-room.ts`，并注册为 `mahjong_room`。
- `packages/shared` 已新增 `ROOM_NAMES.Mahjong`，旧 `ROOM_NAMES.Game` 暂时保留为兼容别名。
- 迁移期 HTTP 好友房状态已拆到 `apps/server/src/mahjong/mahjong-lobby.ts`，`routes.ts` 只保留 HTTP 适配。
- 微信小游戏客户端还没有接入 Colyseus SDK；当前环境访问 npm registry/npmmirror 被 allowlist 拦截，无法下载 `colyseus.js`，因此客户端仍保留自定义 WebSocket/HTTP 兜底链路。

## 客户端 SDK 依赖

`colyseus.js` 应安装到微信小游戏客户端包：

```bash
pnpm --filter @repo/wx-mahjong add colyseus.js@^0.17
```

不要在 SDK 未实际安装成功时把 `colyseus.js` 留在 `apps/wx-mahjong/package.json` 或 `pnpm-lock.yaml` 中，否则后续 `pnpm install` 会在离线/受限网络环境下失败。依赖可用后，再新增客户端连接封装：

```txt
apps/wx-mahjong/src/network/colyseus-client.js
```

封装层负责创建/加入 `ROOM_NAMES.Mahjong`、监听 `mahjong_snapshot`/`mahjong_error`、发送 `mahjong_action`，`main-controller.js` 只依赖该封装。

## 分层整理原则

- 放入 `packages/shared`：房间名、消息名、跨端 payload 类型、通用错误码。
- 放入 `packages/auth`：鉴权上下文类型、token 校验边界。
- 放入 `packages/server-kit`：健康检查、服务启动、关闭处理等服务端通用能力。
- 保留在 `apps/server`：麻将规则、AI 操作、房间生命周期、Colyseus Room 编排。
- 保留在 `apps/wx-mahjong`：小游戏渲染、输入、登录态缓存、客户端连接适配。
