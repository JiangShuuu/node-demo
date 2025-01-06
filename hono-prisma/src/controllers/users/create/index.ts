import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const create = new Hono()

const createUser = async (c: Context) => {
  const user = await prisma.user.create({
    data: {
      email: 'john006@example.com',
      name: 'John Doe 006',
      role: 'USER',
      posts: {
        create: [
          {
            title: 'Crash Course of prisma',
            published: true,
            categories: {
              // connect: [{ id: 1 }, { id: 2 }]
              connectOrCreate: { // 如果找不到，就建立
                where: {
                  id: 101
                },
                create: {
                  name: 'Big Prisma'
                }
              }
            }
          }
        ]
      }
    }
  })

  return c.json(user)
} 

create.post('/', createUser)

export default create