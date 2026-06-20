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

## Colyseus 迁移状态

- [x] 服务端注册 `mahjong_room`，使用 Colyseus Room 生命周期管理连接。
- [x] `onAuth` 校验登录 token，禁止客户端伪造 `userId`。
- [x] `onJoin` 根据 `userId` 恢复座位或替换同账号旧连接。
- [x] 客户端通过 Colyseus SDK 创建/加入房间，并监听 `mahjong_snapshot`。
- [x] 删除旧的 `/mahjong/rooms` HTTP 轮询和 `/mahjong/ws` 自定义 WebSocket。
- [x] `/colyseus` monitor 展示真实 `mahjong_room` 实例。

## 客户端 SDK 依赖

`colyseus.js` 安装在微信小游戏客户端包：

```bash
pnpm --filter @repo/wx-mahjong add colyseus.js@^0.17
```

当前客户端直接在 `main-controller.js` 中使用 Colyseus SDK。后续如果连接逻辑继续增长，再拆到独立封装：

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
