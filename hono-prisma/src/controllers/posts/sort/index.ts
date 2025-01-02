import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const sort = new Hono()

const getPostsSort = async (c: Context) => {
  const posts = await prisma.post.findMany({
    orderBy: {
      likeNum: 'desc'
    }
  })

  return c.json(posts)
}

sort.get('/', getPostsSort)

export default sort