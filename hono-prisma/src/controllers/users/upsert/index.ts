import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const upsert = new Hono()

// upsert 如果 id 存在，則更新，如果 id 不存在，則創建
const upsertUser= async (c: Context) => {
  const users = await prisma.user.upsert({
    where: { 
      id: 1
     },
    update: { name: 'userFoounded' },
    create: { name: 'newUser', email: 'newUser@prisma.io' },
  })
  return c.json(users)
}

upsert.put('/', upsertUser)

export default upsert