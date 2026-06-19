# @repo/metrics

指标接口包。默认提供 no-op 实现，后续可以接 Prometheus 或 OpenTelemetry。

## 用法

```ts
import { noopMetrics } from '@repo/metrics';

noopMetrics.increment('room.join');
noopMetrics.timing('tick.duration', 16);
```
