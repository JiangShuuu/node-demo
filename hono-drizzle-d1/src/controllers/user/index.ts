import { Hono, Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { user } from "../../db/schema";

const userController = new Hono()

const getUsers = async (c: Context) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(user).all()

  return c.json(result)
}

const createUser = async (c: Context) => {
  const db = drizzle(c.env.DB)
  const { name, email, password } = await c.req.json()
  const result = await db.insert(user).values({ name, email, password }).returning()
  return c.json(result)
}

userController.get('/', getUsers)
userController.post('/', createUser)

export default userController