import db from "../../db";
import App from "../../app";
import { Context } from "hono";

const getUsers = async (c: Context) => {
  const prisma = db(c.env);
  const posts = await prisma.post.findMany();
  return c.json(posts);
};

const UserController = App.basePath('/users')
  .get('/', getUsers)
  
export default UserController