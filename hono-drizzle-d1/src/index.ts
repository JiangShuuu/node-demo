import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { posts } from './db/schema'

export type Env = {
  MY_VAR: string
  PRIVATE: string
  DB: D1Database
}

const app = new Hono<{ Bindings: Env }>()

app.get('/posts', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(posts).all()

  return c.json(result)
}).post('/posts', async (c) => {
  const db = drizzle(c.env.DB)

  const { title, content, author } = await c.req.json()

  const result = await db.insert(posts).values({ title, content, author }).returning()

  return c.json(result)
})

export default app
