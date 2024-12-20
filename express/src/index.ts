import express from "express";
import newepayRouter from "./newebpay/newebpay.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

// 掛載 newepay 路由
app.use("/api/newebpay", newepayRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
