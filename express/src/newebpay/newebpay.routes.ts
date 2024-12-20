import { Router } from "express";
import { createOrder } from "./newepay.service";

const newepayRouter = Router();

// 定義 API 路徑
newepayRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to /api/newepay" });
});

newepayRouter.post("/create", async (req, res) => {
  // const { amt, itemDesc, email } = req.body;

  // if (!amt || !itemDesc || !email) {
  //   return res.status(400).json({ message: "Missing required fields: amt, itemDesc, email" });
  // }

  try {
    const order = await createOrder({
      amt: 100,
      itemDesc: "test",
      email: "test@test.com",
    });

    console.log('resres', order);
    res.json(order);
  } catch (error) {
    console.error("NewebPay API error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

newepayRouter.get("/status/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Payment status for ${id}`, status: "Pending" });
});

export default newepayRouter;