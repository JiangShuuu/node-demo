import { Hono, Context } from "hono";
import prisma from "../../../lib/prisma";

const pagination = new Hono()

const getPostsPagination = async (c: Context) => {
  const page = Number(c.req.query('page')) || 1
  const size = Number(c.req.query('size')) || 10

  const posts = await prisma.post.findMany({
    skip: (page - 1) * size, // 跳過前 n 個
    take: size // 取 n 個
  })

  return c.json(posts)
}

const getCursorPagination = async (c: Context) => {
  const cursor = Number(c.req.query('cursor')) || 1
  const size = Number(c.req.query('size')) || 10

  const posts = await prisma.post.findMany({
    cursor: { id: cursor }, // 從 id 幾開始
    take: size // 取 n 個
  })

  return c.json(posts)
}

pagination.get('/', getPostsPagination)
pagination.get('/cursor', getCursorPagination)

export default pagination
