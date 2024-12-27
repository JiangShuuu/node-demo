## Create D1 Database

```
bunx wrangler d1 create <<project-name>>
```

## 等待整理

```不確定作用
bunx prisma generate
```

bunx wrangler d1 migrations create hono-drizzle-d1-example create_tables

```根據 schema.prisma 建立 migration 檔案
bunx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output ./prisma/migrations/0001_create_tables.sql
```

```apply migration 到 cloudflare d1, 目前還待確認
bunx wrangler d1 migrations apply hono-drizzle-d1-example --remote
```

```本地增加資料庫
bunx wrangler d1 execute hono-drizzle-d1-example --local --file ./prisma/migrations/0001_create_tables.sql
```
