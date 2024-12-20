import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const { NEWEBPAY_MERCHANT_ID, NEWEBPAY_HASH_KEY, NEWEBPAY_HASH_IV, NEWEBPAY_API_URL } = process.env;

if (!NEWEBPAY_MERCHANT_ID || !NEWEBPAY_HASH_KEY || !NEWEBPAY_HASH_IV || !NEWEBPAY_API_URL) {
  throw new Error("Missing NewebPay configuration in .env");
}

export const createOrder = async (order: { amt: number; itemDesc: string; email: string }) => {
  const tradeInfo = {
    MerchantID: NEWEBPAY_MERCHANT_ID,
    RespondType: "JSON",
    TimeStamp: Math.floor(Date.now() / 1000).toString(),
    Version: "1.5",
    MerchantOrderNo: `ORD${Date.now()}`,
    Amt: order.amt,
    ItemDesc: order.itemDesc,
    Email: order.email,
  };

  // 將參數轉為字串格式
  const tradeInfoString = new URLSearchParams(tradeInfo as any).toString();

  // 加密參數
  const encryptedTradeInfo = encrypt(tradeInfoString);
  const tradeSha = sha256(`HashKey=${NEWEBPAY_HASH_KEY}&${encryptedTradeInfo}&HashIV=${NEWEBPAY_HASH_IV}`);

  const formData = new FormData();
  formData.append("MerchantID", NEWEBPAY_MERCHANT_ID);
  formData.append("TradeInfo", tradeInfoString);
  formData.append("TradeSha", tradeSha);
  formData.append("Version", "2.2");

  // 傳送請求到藍新 API
  try {
    const response = await axios.post(NEWEBPAY_API_URL, formData, {
      headers: formData.getHeaders(), 
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw new Error('Failed to create order');
  }
};

// 加密函數
const encrypt = (data: string) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", NEWEBPAY_HASH_KEY!, NEWEBPAY_HASH_IV!);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// SHA256 雜湊函數
const sha256 = (data: string) => {
  return crypto.createHash("sha256").update(data).digest("hex").toUpperCase();
};
