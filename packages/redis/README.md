# @repo/redis

Redis 抽象边界包。当前只定义缓存、发布订阅和锁接口，不绑定具体 Redis 客户端。

## 用法

```ts
import type { CacheClient } from '@repo/redis';

async function cacheUser(cache: CacheClient, userId: string, payload: string) {
  await cache.set(`user:${userId}`, payload, { ttlSeconds: 60 });
}
```
