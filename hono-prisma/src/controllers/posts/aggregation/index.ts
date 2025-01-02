import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const aggregation = new Hono()

const getPostsAggregation = async (c: Context) => {
  const posts = await prisma.post.aggregate({
    _sum: {
      likeNum: true
    },
    _avg: {
      likeNum: true
    },
    _min: {
      likeNum: true
    },
    _max: {
      likeNum: true
    },
    _count: {
      id: true
    }
  })

  return c.json(posts)
}

aggregation.get('/', getPostsAggregation)

export default aggregation