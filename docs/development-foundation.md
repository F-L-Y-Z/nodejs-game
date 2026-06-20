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
  validators/       运行时校验工具
  auth/             鉴权类型和服务端鉴权边界
  server-kit/       Express/Colyseus 服务端通用工具
  config/           环境变量和配置解析
  logger/           日志接口和默认实现
  metrics/          指标接口和 no-op 实现
  db/               数据库抽象边界
  redis/            Redis 抽象边界
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

packages/server-kit
  -> 服务端专用
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
    MoveCommand.ts
  systems/
    MovementSystem.ts
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

### validators

提供轻量运行时校验工具。后续可以替换或接入 zod/valibot，但当前先避免新增外部依赖。

### auth

提供鉴权相关的类型、错误和服务端鉴权边界。

当前实现是基础版 token verifier，后续可以在不影响 Room 调用方式的情况下替换为：

```txt
JWT
Session 服务
数据库用户查询
账号封禁检查
客户端版本检查
```

### server-kit

服务端通用工具：

```txt
健康检查响应
Express health route
进程关闭处理
Colyseus 房间名注册辅助
```

### config

环境变量读取、数字/布尔解析、必填项校验。

### logger

提供统一日志接口。业务代码依赖接口，不直接绑定具体日志库。

### metrics

提供指标接口。默认 no-op，生产环境可替换为 Prometheus/OpenTelemetry。

### db

定义数据库连接和 repository 边界，不绑定具体 ORM。

### redis

定义缓存、发布订阅、分布式锁等边界，不绑定具体 Redis 客户端。

## 推荐演进路径

第一阶段：

```txt
shared      协议和错误码
validators  运行时校验
auth        onAuth 准入校验
server-kit  health/env/shutdown
```

第二阶段：

```txt
logger      统一日志
metrics     统一指标
config      配置 schema
```

第三阶段：

```txt
db          repository 和事务边界
redis       presence、限流、分布式锁、缓存
```

核心原则：先定义稳定边界，再接具体技术选型。
