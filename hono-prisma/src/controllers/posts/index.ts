import { Hono, Context } from "hono";
import prisma from "../../lib/prisma";

const posts = new Hono()

const getPosts = async (c: Context) => {
  const posts = await prisma.post.findMany()

  return c.json(posts)
}

posts.get('/', getPosts)

export default posts