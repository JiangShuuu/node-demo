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
    RespondType: 'JSON',
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

  console.log(finalPayload)

  const formData = new FormData();
  formData.append('MerchantID', finalPayload.MerchantID || '');
  formData.append('TradeInfo', finalPayload.TradeInfo || '');
  formData.append('TradeSha', finalPayload.TradeSha || '');
  formData.append('Version', finalPayload.Version || '');
  formData.append('EncryptType', finalPayload.EncryptType || '');

  return c.text(formData.toString())

  // const response = await fetch(NEWEBPAYPayGateWay || '', {
  //   method: 'POST',
  //   body: formData
  // });

  // // 獲取藍新金流的回應
  // const result = await response.text();
  // return c.text(result);
})

export default app