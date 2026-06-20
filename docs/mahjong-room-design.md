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
- 通信通道使用 Colyseus Room。

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
  status: 'waiting' | 'playing' | 'settling' | 'closed';
  table: MahjongTable;
  lastSeenByUserId: Map<string, number>;
  readyUserIds: Set<string>;
  createdAt: number;
  updatedAt: number;
};
```

`MahjongTable` 内部固定 4 个座位，真人入座后替换对应 AI；真人离开或超时后，AI 接管该座位。

当前阶段的状态流转：

```txt
waiting
  -> 4 个座位 ready
  -> playing
  -> round-over
  -> settling
  -> 4 个座位 ready
  -> playing

任意状态
  -> 所有真人离开/超时
  -> closed
```

准备规则：

- 真人座位必须由对应玩家点击准备。
- AI 座位默认已准备。
- 房间快照返回每个座位的 `isReady`，客户端在等待/结算阶段展示。
- 只有 4 个座位全部 ready 后才开始或再开一局。

退出规则：

- 只允许在 `waiting` 和 `settling` 阶段主动退出。
- 退出后真人座位释放，由 AI 接管。
- 退出玩家的准备、活跃实例和房间索引会被清理。
- 如果最后一名真人退出，房间进入 `closed` 并从内存移除。

## Colyseus Room

目标房间类型：

```txt
mahjong_room
```

客户端通过 Colyseus SDK `create`/`joinById` 进入房间，`onAuth` 校验 token 后返回可信 `userId`，`onJoin` 使用服务端身份恢复或占用座位。房间内部继续使用固定 4 座麻将桌，不足真人由服务端 AI 补齐。

创建/加入参数：

```json
{
  "token": "<auth-token>",
  "name": "玩家昵称",
  "password": "1234",
  "timeoutSeconds": 30
}
```

动作统一通过 `mahjong_action` 消息提交：

```json
{
  "action": "discard",
  "index": 3
}
```

服务端通过 `mahjong_snapshot` 向每个连接发送该玩家自己的视角快照；错误通过 `mahjong_error` 返回。

## 状态同步

服务端对每个玩家生成独立视角快照：

- 自己永远映射为 `players[0]`，在画面底部。
- 自己手牌可见。
- 其他玩家只给手牌数量、弃牌、副露。
- `currentPlayer`、`lastDiscard.from`、`winner` 都转换为当前玩家视角座位。
- 服务端在状态变化后通过 Colyseus `mahjong_snapshot` 推送当前玩家视角快照。

快照包含倒计时和配置摘要：

```json
{
  "serverTime": 1710000000000,
  "turnDeadlineAt": 1710000030000,
  "config": {
    "timeoutSeconds": 30,
    "hasPassword": true
  }
}
```

客户端在当前操作玩家名称旁显示剩余秒数。超时后，服务端自动执行托管操作：等待碰/杠时自动过，等待出牌时自动打一张牌。

## 超时和离线

- Colyseus 连接断开会触发 `onLeave`。
- `waiting` 和 `settling` 阶段离开会释放座位，由 AI 接管。
- `playing` 阶段断开后不立即释放座位，服务端按超时倒计时自动托管操作。

## 重复登录

- 服务端以 `userId` 作为玩家身份，同一个 `userId` 在同一房间只占一个座位。
- 同一账号再次进入原房间视为重连，恢复原座位，不新增座位。
- 同一账号在另一设备进入原房间时，新的 Colyseus session 接管该账号；旧 session 会收到 `account_replaced` 并离开房间。
- 开发调试时，客户端大厅提供“重新登录”入口，会清除本地登录缓存并重新走登录流程。

## 后续演进

- 增加房间分享入口。
- 增加房间过期清理和服务端持久化。
- 增加断线重连回原座位。
