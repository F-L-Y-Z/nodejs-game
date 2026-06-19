# @repo/server-kit

服务端基础设施工具包。

## 健康检查

```ts
import { createHealthResponse } from '@repo/server-kit';

app.get('/health', (_req, res) => {
  res.json(createHealthResponse('game-server', process.uptime()));
});
```

## Express health route

```ts
import { registerHealthRoute } from '@repo/server-kit/express';

registerHealthRoute(app, {
  service: 'game-server',
  getUptime: () => process.uptime(),
});
```
