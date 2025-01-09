import { Hono, Context } from "hono";
import prisma from "../../lib/prisma";

const transaction = new Hono()

// 使用 transaction ，需要陣列內的項目都成功，才會更新結果，如果其中一個失敗，則全部失敗
const post = async (c: Context) => {
  const result = await prisma.$transaction([
    prisma.post.update({
      where: { id: 136 },
      data: { 
        likeNum: {
          increment: 5
        }
      },
    }),
    prisma.post.update({
      where: { id: 137 },
      data: { 
        likeNum: {
          increment: 5
        }
      },
    })
  ])

  return c.json(result)
}

transaction.post('/', post)

export default transaction