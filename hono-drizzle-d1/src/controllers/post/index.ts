import { Hono, Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { post } from "../../db/schema";

const postController = new Hono()

const getPosts = async (c: Context) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(post).all()

  return c.json(result)
}

const createPost = async (c: Context) => {
  const db = drizzle(c.env.DB)
  const { title, content, rating } = await c.req.json()
  const result = await db.insert(post).values({ title, content, rating }).returning()
  return c.json(result)
}

postController.get('/', getPosts)
postController.post('/', createPost)

export default postController