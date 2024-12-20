import CryptoES from 'crypto-es'
const crypto = require('crypto');

const {
  NEWEBPAYHASHKEY,
  NEWEBPAYHASHIV,
} = process.env;

export function createAesEncrypt(TradeInfo: any) {
  if (!NEWEBPAYHASHKEY || !NEWEBPAYHASHIV) {
    throw new Error('NEWEBPAY_HASHKEY or NEWEBPAY_HASHIV is not set');
  }

  const keyBytes = CryptoES.enc.Utf8.parse(NEWEBPAYHASHKEY);
  const ivBytes = CryptoES.enc.Utf8.parse(NEWEBPAYHASHIV);

  // 加密
  const urlEncodedString = new URLSearchParams(TradeInfo).toString();

  console.log('urlEncodedString', urlEncodedString)

  const cipher = CryptoES.AES.encrypt(urlEncodedString, keyBytes, {
    iv: ivBytes,
    mode: CryptoES.mode.CBC,
    padding: CryptoES.pad.Pkcs7
  });

  return cipher.toString();
}

// 字串組合
function genDataChain(order: any) {
  return `MerchantID=${order.MerchantID}&TimeStamp=${
    order.TimeStamp
  }&Version=${order.Version}&RespondType=${order.RespondType}&MerchantOrderNo=${
    order.MerchantOrderNo
  }&Amt=${order.Amt}&NotifyURL=${encodeURIComponent(
    order.NotifyUrl,
  )}&ReturnURL=${encodeURIComponent(order.ReturnUrl)}&ItemDesc=${encodeURIComponent(
    order.ItemDesc,
  )}&Email=${encodeURIComponent(order.Email)}`;
}

// Sha 加密
export function createShaEncrypt(aesEncrypt: string) {
  const plainText = `HashKey=${NEWEBPAYHASHKEY}&${aesEncrypt}&HashIV=${NEWEBPAYHASHIV}`;
  
  // 使用 CryptoES 進行 SHA256 雜湊
  const hash = CryptoES.SHA256(plainText);
  
  // 轉換為大寫的十六進制字串
  return hash.toString(CryptoES.enc.Hex).toUpperCase();
}

// old Aes
export function createOldAesEncrypt(TradeInfo: any) {
  const encrypt = crypto.createCipheriv('aes-256-cbc', NEWEBPAYHASHKEY, NEWEBPAYHASHIV);
  // 加密
  const jsonString = JSON.stringify(TradeInfo)
  // UrlEncode
  const encodedString = encodeURIComponent(jsonString)
  const enc = encrypt.update(encodedString, 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

// old sha
export function createOldShaEncrypt(aesEncrypt: string) {
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${NEWEBPAYHASHKEY}&${aesEncrypt}&HashIV=${NEWEBPAYHASHIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}