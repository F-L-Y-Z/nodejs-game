# @repo/validators

轻量运行时校验工具包。当前不引入外部 schema 库，后续可以在这个包内部替换为 zod、valibot 或自研 schema。

## 用法

```ts
import { isNumberInRange, requireString } from '@repo/validators';

const x = isNumberInRange(payload.x, -1, 1) ? payload.x : 0;
const name = requireString(options.name, 'Guest');
```
