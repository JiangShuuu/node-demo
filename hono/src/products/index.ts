import { Hono } from "hono"
import db from "../db"
import { productsTable } from "../db/schema"

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Products!',
  })
})

app.post('/product', async (c) => {
  const { title, description, price, image } = await c.req.json()
  const product = await db.insert(productsTable).values({ title, description, price, image })
  return c.json(product)
})

export default app