import { Hono } from "hono"
import { decodeAES, encodeAES, generateCheckMacValue } from "./utils"
const ecpay_payment = require('ecpay_aio_nodejs');

const app = new Hono()

const options = {
  OperationMode: 'Test', //Test or Production
  MercProfile: {
    MerchantID: process.env.MERCHANTID,
    HashKey: process.env.HASH_KEY,
    HashIV: process.env.HASH_IV,
  },
  IgnorePayment: [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
  ],
  IsProjectContractor: false,
};


app.post('/create', async (c) => {
  // const body = await c.req.parseBody()
  // const { orderId, amount, name } = body

  const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  let base_param = {
    MerchantTradeNo: 'test' + new Date().getTime(), //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate,
    TotalAmount: '100',
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等',
    ReturnURL: `http://localhost:3000/api/payment/capture`,
    ClientBackURL: `http://localhost:8080/callback`,
  };
  const create = new ecpay_payment(options);

  // 注意：在此事直接提供 html + js 直接觸發的範例，直接從前端觸發付款行為
  const html = create.payment_client.aio_check_out_all(base_param);

  return c.html(html)
})

app.post('/capture', async (c) => {
  const body = await c.req.parseBody()

  console.log('payment capture', body)
  return c.json({ ok: true })
})

app.post('/notify', async (c) => {
  const payload = {
    TradeDesc: '促銷方案',
    PaymentType: 'aio',
    MerchantTradeDate: '2023/03/12 15:30:23',
    MerchantTradeNo: 'ecpay20230312153023',
    MerchantID: '3002607',
    ReturnURL: 'https://www.ecpay.com.tw/receive.php',
    ItemName: 'Apple iphone 15',
    TotalAmount: '30000',
    ChoosePayment: 'ALL',
    EncryptType: '1'
  }

  const hashKey = process.env.HASH_KEY || '';
  const hashIV = process.env.HASH_IV || '';

  const checkMacValue = generateCheckMacValue(payload, hashKey, hashIV);
  console.log('CheckMacValue:', checkMacValue);

  if (checkMacValue === '6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840') {
    return c.json({ ok: true })
  } else {
    return c.json({ ok: false })
  }
})

export default app