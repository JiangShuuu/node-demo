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

// is，isNot 適用於 one-to-one or many-to-one 的關係
const getPostsIs = async (c: Context) => {
  const posts = await prisma.post.findMany({
    where: {
      author: {
        is: {
          name: 'John'
        }
      }
    }
  })

  return c.json(posts)
}

const getPostsIsNot = async (c: Context) => {
  const posts = await prisma.post.findMany({
    where: {
      author: {
        isNot: {
          name: 'John'
        },
        is: {
          email: {
            startsWith: 's'
          }
        }
      }
    },
    // 包含 author 的資料
    include: {
      author: true
    }
  })

  return c.json(posts)
}

posts.get('/', getPosts)
posts.get('/is', getPostsIs)
posts.get('/isNot', getPostsIsNot)

export default posts
