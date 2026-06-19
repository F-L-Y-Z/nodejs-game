# @repo/logger

统一日志接口和默认 console 实现。

## 用法

```ts
import { createConsoleLogger } from '@repo/logger';

const logger = createConsoleLogger('server');
logger.info('server started', { port: 2567 });
```
