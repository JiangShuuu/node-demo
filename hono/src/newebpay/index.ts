import { Hono } from "hono"
import { createAesEncrypt, createOldAesEncrypt, createShaEncrypt, createOldShaEncrypt } from './utils'

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
    TimeStamp: Math.round(new Date().getTime() / 1000).toString(),
    Version: NEWEBPAYVersion,
    LangType: 'zh-tw',
    MerchantOrderNo: Math.round(new Date().getTime() / 1000).toString(),
    Amt: '10000',
    ItemDesc: 'TestProduct',
    CREDIT: '1',
    APPLEPAY: '1',
    ReturnURL: NEWEBPAYReturnUrl,
    NotifyURL: NEWEBPAYNotifyUrl,
    Email: 'globelex65@gmail.com',
  }

  const aesEncrypt = createAesEncrypt(initialPayload, key, iv);
  const shaEncrypt = createOldShaEncrypt(aesEncrypt!, key, iv);

  const formData = new FormData();
  formData.append('MerchantID', initialPayload.MerchantID || '');
  formData.append('TradeInfo', aesEncrypt || '');
  formData.append('TradeSha', shaEncrypt || '');
  formData.append('TimeStamp', initialPayload.TimeStamp || '');
  formData.append('Version', initialPayload.Version || '');
  formData.append('LangType', initialPayload.LangType || '');
  formData.append('MerchantOrderNo', initialPayload.MerchantOrderNo || '');
  formData.append('Amt', initialPayload.Amt || '');
  formData.append('ItemDesc', initialPayload.ItemDesc || '');
  formData.append('CREDIT', initialPayload.CREDIT || '');
  formData.append('APPLEPAY', initialPayload.APPLEPAY || '');
  formData.append('ReturnURL', initialPayload.ReturnURL || '');
  formData.append('NotifyURL', initialPayload.NotifyURL || '');
  formData.append('Email', initialPayload.Email || '');

  const response = await fetch(NEWEBPAYPayGateWay || '', {
    method: 'POST',
    body: formData
  });

  // 獲取藍新金流的回應

  console.log(response);
  const result = await response.text();
  return c.html(result)
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
    NotifyURL: 'https://webhook.site/d4db5ad1-2278-466a-9d66-78585c0dbadb',
  }

  // const aesEncrypt = `f79eac33c4f3245d58f17b544c5d38b09457a6d77e77bae6f10fcc7236fe153ccef1a80001c0746afc063a7570f80ad970d8a32c72332c9ec5547410188007876bdca2bafa52d07d31b6b183f2204d6e4feee6d245e286ab198cf95422ad5843c7696fc943cbb65979ad207607d4b5d97dac4a90ccd5e7a37adb7d7062e838be09d94e8c5dfa145c048e17feabe58c2e310792f0f50f5af32961ffb07ff6649ae1021ad558242551de5f09316e3182e198775e5d1ad5b66a70be290004de750fa85d86b0c2f087b40005d89e048be2ab6fd83f1c522494c093426a10a1f73fe4`
  const docAes = `f79eac33c4f3245d58f17b544c5d38b09457a6d77e77bae6f10fcc7236fe153ccef1a80001c0746afc063a7570f80ad970d8a32c72332c9ec5547410188007876bdca2bafa52d07d31b6b183f2204d6e4feee6d245e286ab198cf95422ad5843c7696fc943cbb65979ad207607d4b5d97dac4a90ccd5e7a37adb7d7062e838be09d94e8c5dfa145c048e17feabe58c2e310792f0f50f5af32961ffb07ff6649ae1021ad558242551de5f09316e3182e198775e5d1ad5b66a70be290004de750fa85d86b0c2f087b40005d89e048be2ab6fd83f1c522494c093426a10a1f73fe4`
  const docSha = '84E4D9F96537E029F8450BE1E759080F9AF6995921B7F6F9AAFDDD2C36E7B287'

  const aesEncrypt = createAesEncrypt(payload, key, iv);
  const shaEncrypt = createShaEncrypt(aesEncrypt!, key, iv);

  // return c.json({
  //   aesEncrypt: aesEncrypt,
  //   aesResult: docAes === aesEncrypt,
  //   shaEncrypt: shaEncrypt,
  //   shaResult: docSha === shaEncrypt
  // })
  

  const finalPayload = {
    MerchantID: 'MS127874575',
    TradeInfo: aesEncrypt,
    TradeSha: shaEncrypt,
    Version: '2.0',
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

  const result = await response.text();
  return c.text(result);
})

app.post('/test', async (c) => {
  const finalPayload = {
    MerchantID: process.env.NEWEBPAYMERCHANTID || '',
    TradeInfo: 'af2c3ea002cd02f3109954bd454766bd497493625d8156996887ed4749d4b52e44723d2f047f366afd2873bf279442fca469ca6a69b3bbe51ce0dbfbc54cc5d01e1ff03862b8031752b4df9430a83fc999d0388b061b0378ffe9c0fb1337a03be5e644f63d2b5aabd8fbeded85044304944868c513d2cbcd7462061b0ece6ce715b1a61279dbcd829b91bd2a9bcc079007e00671c280c9b86cdce4093a5d7f21264a4eab7f15664a44613cd1badf466153ac5e08a48ba42a1da041ae9a83f49b0d4a363b8bb830927abefbb92822a8f180a81a5c359cdab1eb879b4f942b585644cd06a74bbc35427eb979574675bb37942d749d1448189e6f4c0f0833ff316b13fdc9b6e8c11bbf40c9b2aa275f8a3e6b48339309de4d8a622ca9cf76fddfc4469db4bed869815237bf4368781c61480a52f842ad756370c8c7a39e009ac74b',
    TradeSha: '16EF96A0A8D7E0BCED7089CD6AC2F113F9CF000848F31AEEA7ABC3EF8431AF9A',
    TimeStamp: '1734752959',
    Version: '2.2',
    NotifyUrl: 'https://trans-iot.jiangshuuu.com/api/newebpay/notify',
    ReturnUrl: 'https://trans-iot.jiangshuuu.com/api/newebpay/return',
    MerchantOrderNo: '1734752959',
    Amt: '1000',
    ItemDesc: '測試商品',
    Email: 'globelex65@gmail.com',
  }

  const formData = new FormData();
  formData.append('MerchantID', finalPayload.MerchantID || '');
  formData.append('TradeInfo', finalPayload.TradeInfo || '');
  formData.append('TradeSha', finalPayload.TradeSha || '');
  formData.append('TimeStamp', finalPayload.TimeStamp || '');
  formData.append('Version', finalPayload.Version || '');
  formData.append('NotifyUrl', finalPayload.NotifyUrl || '');
  formData.append('ReturnUrl', finalPayload.ReturnUrl || '');
  formData.append('MerchantOrderNo', finalPayload.MerchantOrderNo || '');
  formData.append('Amt', finalPayload.Amt || '');
  formData.append('ItemDesc', finalPayload.ItemDesc || '');
  formData.append('Email', finalPayload.Email || '');

  const response = await fetch(NEWEBPAYPayGateWay || '', {
    method: 'POST',
    body: formData
  });

  // 獲取藍新金流的回應
  const result = await response.text();
  return c.text(result);
})

export default app
