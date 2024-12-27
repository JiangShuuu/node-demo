import db from "../../db";
import App from "../../app";
import { Context } from "hono";

const getPosts = async (c: Context) => {
  const prisma = db(c.env);
  const posts = await prisma.post.findMany();
  return c.json(posts);
};

const PostController = App.basePath('/posts')
  .get('/', getPosts)
export default PostController