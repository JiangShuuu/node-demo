bun i drizzle-orm @libsql/client
bun i -D drizzle-kit

## 建立 D1 資料庫

```
bunx wrangler d1 create hono-drizzle-d1
```

複製進 wrangler.toml

## schema push to D1 and local sqlite

```
bunx wrangler d1 execute hono-drizzle-d1 --local --file ./drizzle/migrations/0000_fancy_madripoor.sql
bunx wrangler d1 execute hono-drizzle-d1 --remote --file ./drizzle/migrations/0000_fancy_madripoor.sql
```

## 本地連 sqlite db

```
/Users/jiangshulu/Documents/frontend/node-demo/hono-drizzle-d1/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/257b8545e4218b5df41788e8d11c23faaa01fda99f6208556098f5c3e4fc2d59.sqlite
```

## 修改 schema 之後

```
bun run db:generate
bun run d1:local
bun run d1:remote
```

drizzle-kit up 是給其他資料庫使用的指令，d1 不需要

## 修改程式碼後

```
bun run deploy
```

## reference

- https://www.youtube.com/watch?v=PxWleEgi3Hw
