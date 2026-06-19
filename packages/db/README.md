# @repo/db

数据库抽象边界包。当前不绑定 ORM 或数据库驱动。

## 用法

```ts
import type { DatabaseClient } from '@repo/db';

async function loadPlayer(db: DatabaseClient, userId: string) {
  return db.queryOne('player.byId', { userId });
}
```
