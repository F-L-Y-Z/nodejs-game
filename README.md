# Colyseus Node Game Monorepo

TypeScript monorepo using pnpm workspaces and Turborepo.

## Structure

```txt
apps/
  server/          Colyseus game server
packages/
  shared/          Shared TypeScript types and constants
```

## Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm typecheck
pnpm clean
```

## Notes

- `pnpm-workspace.yaml` defines workspace packages under `apps/*` and `packages/*`.
- `turbo.json` runs package scripts in dependency order and caches build outputs.
- `tsconfig.base.json` contains shared TypeScript compiler options.
- `apps/server` depends on `@repo/shared` with `workspace:*`.
