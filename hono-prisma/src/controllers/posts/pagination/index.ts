import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const pagination = new Hono()

const getPostsPagination = async (c: Context) => {
  const posts = await prisma.post.findMany({
    skip: 10,
    take: 10
  })

  return c.json(posts)
}

pagination.get('/', getPostsPagination)

export default pagination