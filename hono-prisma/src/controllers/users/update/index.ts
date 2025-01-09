import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const update = new Hono()

const updateUser = async (c: Context) => {
  const user = await prisma.user.update({
    where: { id: 4 },
    data: { name: 'John Doe 009' }
  })

  return c.json(user)
}

const updateUserMany = async (c: Context) => {
  const users = await prisma.user.updateMany({
    where: { 
      name: {
        contains: 'c'
      }
     },
    data: { name: 'Johns Doe' }
  })
  return c.json(users)
}

update.put('/', updateUser)
update.put('/many', updateUserMany)

export default update
