# @repo/config

环境变量和配置解析工具包。

## 用法

```ts
import { readNumberEnv, readStringEnv } from '@repo/config';

const port = readNumberEnv('PORT', 2567);
const nodeEnv = readStringEnv('NODE_ENV', 'development');
```
