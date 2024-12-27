import { Hono } from 'hono'

export type Env = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Env }>()

export default app
