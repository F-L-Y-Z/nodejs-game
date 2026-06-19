# @repo/auth

鉴权基础包。根导出只包含通用类型和错误；服务端实现从 `@repo/auth/server` 引入。

## Room 中使用

```ts
import { createDevTokenVerifier } from '@repo/auth/server';

const verifyToken = createDevTokenVerifier();

async onAuth(_client, options) {
  return verifyToken(options.token);
}
```

## 开发 token

当前内置的开发 verifier 接受：

```txt
dev:<userId>
```

例如：

```txt
dev:user-1
```

后续可以把 `TokenVerifier` 替换为 JWT、Session 服务或数据库查询。
