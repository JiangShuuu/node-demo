import { Hono, Context } from "hono";
import prisma from "../../lib/prisma";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const auth = new Hono();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 註冊
const register = async (c: Context) => {
  const { email, password, name } = await c.req.json();
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });

  return c.json({ 
    success: true,
    user: { id: user.id, email: user.email, name: user.name }
  });
};

// 登入
const login = async (c: Context) => {
  const { email, password } = await c.req.json();

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return c.json({ success: false, message: "User not found" }, 404);
  }

  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return c.json({ success: false, message: "Invalid password" }, 401);
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return c.json({ 
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
};

// 驗證 middleware
export const authMiddleware = async (c: Context, next: Function) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ success: false, message: "No token provided" }, 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ success: false, message: "Invalid token" }, 401);
  }
};

auth.post("/register", register);
auth.post("/login", login);

export default auth;