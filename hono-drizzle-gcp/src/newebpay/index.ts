import { Hono } from "hono"
import { createAesEncrypt, createShaEncrypt, createAesDecrypt } from './utils'

const app = new Hono()

const {
  NEWEBPAYMERCHANTID,
  NEWEBPAYHASHKEY,
  NEWEBPAYHASHIV,
  NEWEBPAYVersion,
  NEWEBPAYUrl,
  NEWEBPAYNotifyUrl,
  NEWEBPAYReturnUrl,
} = process.env;

app.get('/', (c) => {
  return c.json({
    NEWEBPAYMERCHANTID,
    NEWEBPAYHASHKEY,
    NEWEBPAYHASHIV,
    NEWEBPAYVersion,
    NEWEBPAYUrl,
    NEWEBPAYNotifyUrl,
    NEWEBPAYReturnUrl,
  })
})

// 建立訂單
app.post('/create', async (c) => {
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
  const shaEncrypt = createShaEncrypt(aesEncrypt!, key, iv);

  return c.json({
    MerchantID: initialPayload.MerchantID,
    TradeInfo: aesEncrypt,
    TradeSha: shaEncrypt,
    TimeStamp: initialPayload.TimeStamp,
    Version: initialPayload.Version,
    LangType: initialPayload.LangType,
    MerchantOrderNo: initialPayload.MerchantOrderNo,
    Amt: initialPayload.Amt,
    ItemDesc: initialPayload.ItemDesc,
    CREDIT: initialPayload.CREDIT,
    APPLEPAY: initialPayload.APPLEPAY,
    ReturnURL: initialPayload.ReturnURL,
    NotifyURL: initialPayload.NotifyURL,
    Email: initialPayload.Email,
    paymentUrl: NEWEBPAYUrl + '/MPG/mpg_gateway' // 加入付款網址
  });
})

// 後端通知付款結果
app.post('/notify', async (c) => {
  const res = {
    Status: "SUCCESS",
    MerchantID: "MS154715440",
    Version: "2.2",
    TradeInfo: "916907d9b6675ee9aae697e967ee676a74a8e4cc0da4e5941307d4cbef7258fd80f131223b2ce1c142a59e59a6916e8952e0f682fd20e977f21fd0fa0e20126d4395dab1ac6902f11a695c818bb6e1b5ba535b895fde4685dfa97a90671fd89bcb0227d481a257af95b7fcfdb58e40651fd3408697e77300324b454278494bd29583d6b3a3849a743148e9db528fb81cd6072290cb26ec7db239899a272303b9059336f3c2d4f002602ab86964e6842c56d9ad5683562034efffd58e06f775f8bec0fe8509b0b65879702dc17a7589b1d8b28ce1ec566e7b5bbd46ca2ff12278637c842ba5e7a6c14c428898eb42b5f719b664c5d0d0ce06ad7ed324f7590380f08b9ecf5188c2cc91cfc82a21b2a3e531e93d7f0aeca1ce9808af95999d7ff9ca5252030d3f01aad23c8b980e9760e4a1c2288e59a55171b2fe0955e365b875c731b98515c00b8893c25aae0a1da910ca15df61156aee8d35290e5c0d1383cb0b3d542089d7f5609b822d55c412c8ff93dcae6f3291adff79e1874004a952fedecbd29b4774900226e860f2e234047fbd7aeb1ac984c883f693869c17f59fcbd5c32f8b2347ce48c2344ab4b3ac33052f7b3ee125d46cc10a79e3659d3b0f595f6d281edd03e51d0d6688c912327f23ce855a7555f1809270f2e941f53db3f0e9f8d74452407a5d1ad637390c512757dd223b11d3a5740c66e24775c56af7ab",
    TradeSha: "44487CF5EA74EFBDF2E00D7E562F2BAE1229323266FEF40FBE9015DB7BE9E85E",
  }

  // 解密交易內容
  const data = createAesDecrypt(res.TradeInfo, process.env.NEWEBPAYHASHKEY!, process.env.NEWEBPAYHASHIV!);
  console.log('data:', data);

  // 取得交易內容，並查詢本地端資料庫是否有相符的訂單

  // 使用 HASH 再次 SHA 加密字串，確保比對一致（確保不正確的請求觸發交易成功）
  const thisShaEncrypt = createShaEncrypt(res.TradeInfo, process.env.NEWEBPAYHASHKEY!, process.env.NEWEBPAYHASHIV!);
  if (thisShaEncrypt !== res.TradeSha) {
    return c.text('付款失敗：TradeSha 不一致');
  }

  // 交易完成，將成功資訊儲存於資料庫
 
  return c.json({
    Status: "SUCCESS",
    TradeInfo: data,
  })
})

// 退款
app.post('/refund', async (c) => {
  const key = NEWEBPAYHASHKEY || '';
  const iv = NEWEBPAYHASHIV || '';

  const initialPayload = {
    MerchantID: NEWEBPAYMERCHANTID,
    RespondType: 'JSON',
    Version: '2.2',
    Amt: '10000',
    MerchantOrderNo: '1734755807',
    TimeStamp: Math.round(new Date().getTime() / 1000).toString(),
    IndexType: '2',
    TradeNo: '24122112370166550',
    CloseType: '2',
  }

  const aesEncrypt = createAesEncrypt(initialPayload, key, iv);

  const formData = new FormData();
  formData.append('MerchantID_', initialPayload.MerchantID || '');
  formData.append('PostData_', aesEncrypt || '');
  formData.append('RespondType', initialPayload.RespondType || '');
  formData.append('Version', initialPayload.Version || '');
  formData.append('Amt', initialPayload.Amt || '');
  formData.append('MerchantOrderNo', initialPayload.MerchantOrderNo || '');
  formData.append('TimeStamp', initialPayload.TimeStamp || '');
  formData.append('IndexType', initialPayload.IndexType || '');
  formData.append('TradeNo', initialPayload.TradeNo || '');
  formData.append('CloseType', initialPayload.CloseType || '');

  const response = await fetch(NEWEBPAYUrl + '/API/CreditCard/Close', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  // TRA10035 銀行尚未回應
  
  return c.json({
    data,
  })
})

export default app
