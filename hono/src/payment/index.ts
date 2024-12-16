import { Hono } from "hono"
import { decodeAES, encodeAES, generateCheckMacValue } from "./utils"

const app = new Hono()

app.post('/create', async (c) => {
  const body = await c.req.parseBody()
  const { orderId, amount, name } = body

  const payload = {
    MerchantTradeNo: orderId,
    MerchantTradeDate: new Date().toISOString(),
    PaymentType: 'aio',
    TotalAmount: amount,
    TradeDesc: 'test',
    ItemName: name,
    ReturnURL: `${process.env.BASE_URL}/api/payment/capture`,
    ChoosePayment: 'Credit',
    CheckMacValue: '',
    EncryptType: 1,
  }

  const encodeData = encodeAES(payload)

  try {
    const response = await fetch(process.env.ECPAY_CREATE_BY_TEMP_TRADE || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: {
        MerchantID: process.env.MERCHANTID || '',
        RqHeader: {
          Timestamp: Math.floor(new Date().getTime() / 1000.0)
        },
        Data: encodeData
      }
    })

    const data = await response.json()
    console.log('payment data', data)

    // const resultData = decodeAES(response.data)
    return c.json({ ok: true })
  } catch (error: any) {
    console.error('payment error', error)
    return c.json({ ok: false, error: error.message }, 422)
  }
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