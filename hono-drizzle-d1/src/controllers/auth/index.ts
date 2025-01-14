import { Hono, Context } from "hono";
import { user } from "../../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { sign, verify } from "hono/jwt"; 
import { hashPassword, comparePassword } from "../../lib/crypto";

const authController = new Hono();

// 註冊
const register = async (c: Context) => {
  const { email, password, name } = await c.req.json();
  const db = drizzle(c.env.DB);
  
  const hashedPassword = await hashPassword(password);
  
  try {
    const [users] = await db.insert(user)
      .values({
        email,
        password: hashedPassword,
        name
      })
      .returning();

    console.log(users)

    return c.json({   
      success: true,
      user: { 
        id: users.id, 
        email: users.email, 
        name: users.name 
      }
    });
  } catch (error) {
    return c.json({ 
      success: false, 
      message: "Email already exists" 
    }, 400);
  }
};

// 登入
const login = async (c: Context) => {
  const { email, password } = await c.req.json();
  const db = drizzle(c.env.DB);

  const [users] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!users) {
    return c.json({ 
      success: false, 
      message: "User not found" 
    }, 404);
  }

  const isValid = await comparePassword(password, String(users.password));
  
  if (!isValid) {
    return c.json({ 
      success: false, 
      message: "Invalid password" 
    }, 401);
  }

  const token = await sign({ userId: users.id, email: users.email }, c.env.JWT_SECRET);

  return c.json({ 
    success: true,
    token,
    user: { 
      id: users.id, 
      email: users.email, 
      name: users.name 
    }
  });
};

// 驗證 middleware
export const authMiddleware = async (c: Context, next: Function) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ 
      success: false, 
      message: "No token provided" 
    }, 401);
  }

  try {
    const decoded = await verify(token, c.env.JWT_SECRET) as {
      userId: number;
      email: string;
    };
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ 
      success: false, 
      message: "Invalid token" 
    }, 401);
  }
};

authController.post("/register", register);
authController.post("/login", login);

export default authController;