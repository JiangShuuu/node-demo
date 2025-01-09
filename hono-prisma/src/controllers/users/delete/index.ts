import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const deleteUser = new Hono()

const deleteUserFunction= async (c: Context) => {
  const { id } = await c.req.json()

  if (!id) {
    return c.json({ error: 'id is required' }, 400)
  }

  // 刪除 user 的 id 為 1 的資料
  try {
    const users = await prisma.user.delete({
      where: { 
        id: Number(id)
      },
    })
    return c.json(users)
  } catch (error) {
    return c.json({ error: 'user not found' }, 400)
  }
}

deleteUser.delete('/', deleteUserFunction)

export default deleteUser