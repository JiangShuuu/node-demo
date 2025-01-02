import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const group = new Hono()

const getPostsGroup = async (c: Context) => {
  const posts = await prisma.post.groupBy({
    by: ['authorId'],
    _sum: {
      likeNum: true
    },
    _avg: {
      likeNum: true
    },
    _count: {
      likeNum: true
    }
  })

  return c.json(posts)
}

group.get('/', getPostsGroup)

export default group