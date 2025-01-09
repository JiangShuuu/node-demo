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

const createManyUsers = async (c: Context) => {
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'john007@example.com',
        name: 'John Doe 007',
        role: 'USER',
      },
      {
        email: 'john008@example.com',
        name: 'John Doe 008',
        role: 'USER',
      }
    ],
    skipDuplicates: true // 跳過重複的資料，不會報錯，但也不會建立資料
  })

  return c.json(users)
}

create.post('/', createUser)
create.post('/many', createManyUsers)
export default create
