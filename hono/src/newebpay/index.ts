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
  
  const key = NEWEBPAYHASHKEY || '';
  const iv = NEWEBPAYHASHIV || '';

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

  const aesEncrypt = createAesEncrypt(initialPayload, key, iv);
  const shaEncrypt = createShaEncrypt(aesEncrypt, key, iv);

  const finalPayload = {
    MerchantID: NEWEBPAYMERCHANTID,
    TradeInfo: aesEncrypt,
    TradeSha: shaEncrypt,
    Version: NEWEBPAYVersion,
    EncryptType: '1',
  }

  const formData = new FormData();
  formData.append('MerchantID', finalPayload.MerchantID || '');
  formData.append('TradeInfo', finalPayload.TradeInfo || '');
  formData.append('TradeSha', finalPayload.TradeSha || '');
  formData.append('Version', finalPayload.Version || '');
  formData.append('EncryptType', finalPayload.EncryptType || '');

  const response = await fetch(NEWEBPAYPayGateWay || '', {
    method: 'POST',
    body: formData
  });

  // 獲取藍新金流的回應
  const result = await response.text();
  return c.text(result);
})


app.post('/php', async (c) => {
  const key = 'Fs5cX1TGqYM2PpdbE14a9H83YQSQF5jn'
  const iv = 'C6AcmfqJILwgnhIP'

  const payload = {
    MerchantID: 'MS127874575',
    RespondType: 'String',
    TimeStamp: '1695795410',
    Version: '2.0',
    MerchantOrderNo: 'Vanespl_ec_1695795410',
    Amt: '30',
    ItemDesc: 'test',
    NotifyURL: 'https://webhook.site/97c6899f-077b-4025-9948-9ee96a38dfb7',
  }

  const aesEncrypt = createAesEncrypt(payload, key, iv);
  const shaEncrypt = createShaEncrypt(aesEncrypt!, key, iv);
  
  // const beforeSha = `f79eac33c4f3245d58f17b544c5d38b09457a6d77e77bae6f10fcc7236fe153ccef1a80001c0746afc063a7570f80ad970d8a32c72332c9ec5547410188007876bdca2bafa52d07d31b6b183f2204d6e4feee6d245e286ab198cf95422ad5843c7696fc943cbb65979ad207607d4b5d97dac4a90ccd5e7a37adb7d7062e838be09d94e8c5dfa145c048e17feabe58c2e310792f0f50f5af32961ffb07ff6649ae1021ad558242551de5f09316e3182e198775e5d1ad5b66a70be290004de750fa85d86b0c2f087b40005d89e048be2ab6fd83f1c522494c093426a10a1f73fe4`
  // const afterSha = createShaEncrypt(beforeSha, key, iv);
  // console.log('afterSha', afterSha)

  // console.log('aesEncrypt', aesEncrypt)

  return c.json({
    aesEncrypt: aesEncrypt,
    shaEncrypt: shaEncrypt
  })
})

export default app
