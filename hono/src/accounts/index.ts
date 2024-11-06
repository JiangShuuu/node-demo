import { Hono } from "hono"
import db from "../db"
import { accountsTable } from "../db/schema"

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Accounts!',
  })
})

app.post('/', async (c) => {
  const info = {
    name: 'John',
    age: 20,
    email: 'john@example.com',
  }
  await db.insert(accountsTable).values(info)
  console.log('success')
  return c.json({
    ok: true,
  })
})

export default app