# 麻将多人房间设计

本文记录 `wx-mahjong` 从单机/单公共桌演进到好友房联机的最小可用设计。当前阶段不做快速开始和房间列表，只支持创建房间、房间号加入、房内 1-4 人游玩。

## 目标

- 登录后的玩家先进入简单大厅。
- 玩家可以创建一个麻将房间，服务端返回短房间号。
- 其他玩家输入房间号加入同一房间。
- 每个房间最多 4 名真人玩家。
- 不足 4 人时，由服务端 AI 补齐并陪玩。
- 服务端权威维护牌局，客户端只提交动作和渲染自己的视角快照。
- 玩家断线或停止心跳后，服务端释放座位并由 AI 接管。

## 非目标

- 不做快速开始。
- 不做房间列表。
- 不做复杂匹配、段位、观战、邀请记录。
- 当前先不做持久化，服务重启后房间丢失。
- 当前微信小游戏客户端优先使用 HTTP 轮询，WebSocket/Colyseus 可作为后续优化。

## 客户端流程

```txt
登录
  -> 大厅
      -> 创建房间
          -> 服务端创建 roomId
          -> 进入牌桌
      -> 加入房间
          -> 输入 roomId
          -> 服务端校验并入座
          -> 进入牌桌
```

大厅保持极简，只需要：

- 标题和登录玩家信息。
- 创建房间按钮。
- 加入房间按钮。
- 最近一次创建或加入的房间号提示，方便分享给好友。

## 服务端房间模型

```ts
type MahjongRoom = {
  id: string;
  ownerUserId: string;
  status: 'playing' | 'closed';
  table: MahjongTable;
  lastSeenByUserId: Map<string, number>;
  createdAt: number;
  updatedAt: number;
};
```

当前阶段创建后立即开局。`MahjongTable` 内部固定 4 个座位，真人入座后替换对应 AI；真人离开或超时后，AI 接管该座位。

## HTTP API

### 创建房间

```txt
POST /mahjong/rooms
Authorization: Bearer <token>
```

请求：

```json
{
  "name": "玩家昵称"
}
```

响应：

```json
{
  "ok": true,
  "roomId": "123456",
  "state": {}
}
```

### 加入房间

```txt
POST /mahjong/rooms/:roomId/join
Authorization: Bearer <token>
```

请求：

```json
{
  "name": "玩家昵称"
}
```

响应：

```json
{
  "ok": true,
  "roomId": "123456",
  "state": {}
}
```

### 获取快照

```txt
GET /mahjong/rooms/:roomId/snapshot
Authorization: Bearer <token>
```

响应：

```json
{
  "ok": true,
  "roomId": "123456",
  "state": {}
}
```

### 提交动作

```txt
POST /mahjong/rooms/:roomId/action
Authorization: Bearer <token>
```

请求：

```json
{
  "action": "discard",
  "index": 3
}
```

动作取值：

```txt
discard
pass
peng
gang
hu
restart
```

响应：

```json
{
  "ok": true,
  "roomId": "123456",
  "state": {}
}
```

## 状态同步

服务端对每个玩家生成独立视角快照：

- 自己永远映射为 `players[0]`，在画面底部。
- 自己手牌可见。
- 其他玩家只给手牌数量、弃牌、副露。
- `currentPlayer`、`lastDiscard.from`、`winner` 都转换为当前玩家视角座位。

客户端每 900ms 轮询一次快照。玩家提交动作后立即用动作响应里的快照刷新画面。

## 超时和离线

- 每次创建、加入、获取快照、提交动作都会刷新玩家 `lastSeen`。
- 超过 120 秒未活跃的玩家视为离线。
- 离线玩家从房间座位释放，当前座位由 AI 接管。
- 空房间后续可以增加定时清理；当前 MVP 可在请求入口顺带清理过期玩家。

## 后续演进

- 改为 WebSocket 推送，减少轮询延迟。
- 增加房间等待态、准备态、房主开始。
- 增加房间分享入口。
- 增加房间过期清理和服务端持久化。
- 增加断线重连回原座位。
