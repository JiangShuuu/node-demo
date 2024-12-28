## Create D1 Database

```
bunx wrangler d1 create <<project-name>>
```

## 等待整理

```不確定作用
bunx prisma generate
```

```遠端建立庫名
bunx wrangler d1 migrations create hono-drizzle-d1-example create_tables
```

```根據 schema.prisma 建立 migration 檔案
bunx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output ./prisma/migrations/0001_create_tables.sql
```

```本地增加資料表
bunx wrangler d1 execute hono-drizzle-d1-example --local --file ./prisma/migrations/0001_create_tables.sql
```

```遠端增加資料表
bunx wrangler d1 execute hono-drizzle-d1-example --remote --file ./prisma/migrations/0001_create_tables.sql
```

## reference

https://www.youtube.com/watch?v=PxWleEgi3Hw
https://github.com/arryanggaputra/hono-d1-prisma-cloudflare-worker/blob/main/README.md
