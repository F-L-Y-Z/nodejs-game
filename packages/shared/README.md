# @repo/shared

跨端共享包。客户端和服务端都可以依赖这里的内容。

## 用法

```ts
import { CLIENT_MESSAGES, ROOM_NAMES, type MoveMessage } from '@repo/shared';

room.send(CLIENT_MESSAGES.Move, {
  x: 1,
  y: 0,
} satisfies MoveMessage);

client.joinOrCreate(ROOM_NAMES.Game, {
  token: 'dev:user-1',
});
```

## 放什么

- 房间名
- 消息名
- payload 类型
- 错误码
- 基础响应类型

## 不放什么

- Colyseus Room
- Express 中间件
- JWT/数据库/Redis 调用
- 服务端专用实现
