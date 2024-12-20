import { Hono } from "hono"
import { createAesEncrypt, createShaEncrypt } from './utils'

const app = new Hono()

const {
  NEWEBPAYMERCHANTID,
  NEWEBPAYHASHKEY,
  NEWEBPAYHASHIV,
  NEWEBPAYVersion,
  NEWEBPAYPayGateWay,
  NEWEBPAYNotifyUrl,
  NEWEBPAYReturnUrl,
} = process.env;

app.get('/', (c) => {
  console.log(`NEWEBPAYMERCHANTID: ${NEWEBPAYMERCHANTID}, NEWEBPAYHASHKEY: ${NEWEBPAYHASHKEY}, NEWEBPAYHASHIV: ${NEWEBPAYHASHIV}, NEWEBPAYVersion: ${NEWEBPAYVersion}, NEWEBPAYPayGateWay: ${NEWEBPAYPayGateWay}, NEWEBPAYNotifyUrl: ${NEWEBPAYNotifyUrl}, NEWEBPAYReturnUrl: ${NEWEBPAYReturnUrl}`);
  return c.text('Hello World')
})

app.post('/create', async (c) => {
  // const data =  await c.req.parseBody();
  // console.log(data);
  

  const initialPayload = {
    MerchantID: NEWEBPAYMERCHANTID,
    RespondType: 'String',
    TimeStamp: Math.round(new Date().getTime() / 1000),
    Version: NEWEBPAYVersion,
    LangType: 'zh-tw',
    MerchantOrderNo: Math.round(new Date().getTime() / 1000),
    Amt: 10000,
    ItemDesc: 'TestProduct',
    CREDIT: '1',
    LINEPAY: '1',
    APPLEPAY: '1',
    ReturnURL: NEWEBPAYReturnUrl,
    NotifyURL: NEWEBPAYNotifyUrl,
    Email: 'globelex65@gmail.com',
  }

  const aesEncrypt = createAesEncrypt(initialPayload);
  const shaEncrypt = createShaEncrypt(aesEncrypt);

  const finalPayload = {
    MerchantID: NEWEBPAYMERCHANTID,
    TradeInfo: aesEncrypt,
    TradeSha: shaEncrypt,
    Version: NEWEBPAYVersion,
    EncryptType: '1',
  }

  const data = await fetch(`${process.env.NEWEBPAYPayGateWay}`, {
    method: 'POST',
    body: JSON.stringify(finalPayload),
  });


  const response = await data.text();

  return c.text(response)
})

export default app