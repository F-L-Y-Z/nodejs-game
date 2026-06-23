# 游戏服务端基础搭建设计

本文记录当前 monorepo 面向多游戏客户端、多服务端能力演进时的基础框架设计。

## 当前目标

当前仓库采用 pnpm workspace + Turborepo：

```txt
apps/
  server/           Colyseus 游戏服务端
packages/
  shared/           跨端共享类型、协议、常量
```

后续会在 `apps` 下加入多种游戏客户端项目，因此 `packages` 需要承载跨项目基础设施：

```txt
apps/
  server/           Colyseus 服务端
  web-client/       Web 客户端
  cocos-client/     Cocos 客户端
  admin/            后台工具

packages/
  shared/           纯共享协议和类型
  core/             配置、日志、指标、校验、health、shutdown 等基础运行库
  auth/             鉴权类型、token 和微信登录
  room/             多人房间会话、准备状态和通用房间错误
```

## 分层原则

整体依赖方向应该保持单向：

```txt
apps/*
  -> packages/*

packages/shared
  -> 不依赖 Node、Colyseus、Express、数据库、Redis

packages/auth
  -> 可导出跨端类型
  -> 服务端鉴权实现放在 server 子路径

packages/core
  -> 基础运行库，不放业务协议、具体游戏规则或认证流程

packages/room
  -> 房间通用能力，不依赖 Colyseus 具体 Room 子类
```

不允许出现：

```txt
packages/shared -> apps/server
packages/shared -> colyseus
客户端项目 -> @repo/auth/server
```

## Room 准入模型

Colyseus 中“谁能进入 Room”通常由四层共同决定：

```txt
filterBy       决定匹配到哪类房间
maxClients     决定容量上限
lock/unlock    决定房间是否继续接收新玩家
onAuth         决定当前玩家是否有资格进入
```

推荐流程：

```txt
client joinOrCreate
  -> matchmaker 根据 room name/filter 找房间
  -> onAuth 校验 token、账号状态、版本、房间状态
  -> onJoin 使用 auth 返回的可信身份创建玩家状态
```

`onJoin` 不应该信任客户端传入的 `userId`、段位、队伍、权限等敏感字段。敏感身份信息必须来自 `onAuth` 的服务端校验结果。

## Room 代码职责

`Room` 只负责连接、生命周期和消息入口：

```txt
Room
  -> onCreate 注册消息和模拟循环
  -> onAuth 做准入校验
  -> onJoin 加入玩家状态
  -> onLeave 清理玩家状态
  -> onDispose 释放资源
```

复杂业务应该拆出：

```txt
commands/       处理一次客户端输入
systems/        每 tick 更新世界
validators/     校验 payload
services/       调用数据库、Redis、奖励、匹配等外部能力
```

推荐游戏房间目录：

```txt
apps/server/src/rooms/game/
  game-room.ts
  game-state.ts
  messages.ts
  validators.ts
  commands/
    move-command.ts
  systems/
    movement-system.ts
```

## packages 职责

### shared

纯共享包，服务端和客户端都可以依赖。

适合放：

```txt
房间名
客户端消息名
服务端消息名
payload 类型
错误码
基础响应类型
```

不适合放：

```txt
Colyseus Room
Express 中间件
JWT 校验
数据库查询
Redis 调用
```

### core

基础运行库，包含：

```txt
环境变量读取
日志接口和默认 console 实现
指标接口和 no-op 实现
轻量运行时校验工具
健康检查响应
Express health route
进程关闭处理
```

不放游戏协议、具体游戏规则、微信登录流程、数据库 repository 或 Redis 具体实现。

### auth

提供鉴权相关的类型、错误和服务端鉴权能力。

当前实现包含 token 签发/校验和微信小游戏 code exchange。后续可以在不影响 Room 调用方式的情况下替换或扩展为：

```txt
JWT
Session 服务
数据库用户查询
账号封禁检查
客户端版本检查
```

### room

多人房间通用能力：

```txt
房间会话归属
同账号顶号
准备状态
房间参数标准化
通用房间错误码/关闭码
```

具体 Colyseus Room 子类、游戏规则和业务快照仍保留在 `apps/server`。

## 推荐演进路径

第一阶段：

```txt
shared      协议和错误码
core        config/logger/metrics/validators/health/shutdown
auth        token 和微信登录
room        会话归属、ready 状态、房间通用错误
```

第二阶段：

```txt
auth        账号状态、封禁、客户端版本检查
room        房间过期清理、重连策略、房间索引
```

第三阶段：

```txt
按真实实现再拆 repository、Redis presence、限流、分布式锁、缓存等边界
```

核心原则：先定义稳定边界，再接具体技术选型。
