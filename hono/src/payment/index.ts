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

// SDK
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
    MerchantTradeNo: 'test' + new Date().getTime(), // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate,
    TotalAmount: '100',
    TradeDesc: '測試交易描述',
    ItemName: '測試商品等',
    ReturnURL: process.env.PAYMENT_RETURN_URL,
    ClientBackURL: process.env.PAYMENT_CALLBACK_URL,
  };
  const create = new ecpay_payment(options);

  // 注意：在此事直接提供 html + js 直接觸發的範例，直接從前端觸發付款行為
  const html = create.payment_client.aio_check_out_all(base_param);

  return c.html(html)
})

app.post('/refund', async (c) => {
  // const body = await c.req.parseBody()
  // console.log('payment refund', body)
  const refund = new ecpay_payment(options);

  const payload = {
    MerchantTradeNo: "test1734430936645",
    TradeNo: "2412171822169397",
    Action: "R",
    TotalAmount: "100"
  }
  const res = refund.payment_client.credit_do_act(payload)

  return c.json({ ok: true, data: res })
})

app.post('/capture', async (c) => {
  const body = await c.req.parseBody()

  console.log('payment capture', body)
  // {
  //   CustomField1: "",
  //   CustomField2: "",
  //   CustomField3: "",
  //   CustomField4: "",
  //   MerchantID: "3002607",
  //   MerchantTradeNo: "test1734430936645",
  //   PaymentDate: "2024/12/17 18:22:54",
  //   PaymentType: "Credit_CreditCard",
  //   PaymentTypeChargeFee: "2",
  //   RtnCode: "1",
  //   RtnMsg: "交易成功",
  //   SimulatePaid: "0",
  //   StoreID: "",
  //   TradeAmt: "100",
  //   TradeDate: "2024/12/17 18:22:16",
  //   TradeNo: "2412171822169397",
  //   CheckMacValue: "447090F34BFFD306CE78C3CF5C52725A8AEC851EB37629B2F2D10423E38BAD26",
  // }
  return c.json({ ok: true })
})

// 手動建立測試訂單驗證
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