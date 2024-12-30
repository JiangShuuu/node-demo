import { Hono, Context } from "hono";
import prisma from "../../lib/prisma";

const posts = new Hono()

const getPosts = async (c: Context) => {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: 'github',
            mode: 'insensitive' // 不區分大小寫
          }
        },
        {
          title: {
            contains: 'Twitter'
          }
        }
      ],
      AND: {
        published: true
      }
    }
  })

  return c.json(posts)
}

posts.get('/', getPosts)

export default posts