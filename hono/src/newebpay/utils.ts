import CryptoES from 'crypto-es'

export function createAesEncrypt(TradeInfo: any, key: string, iv: string) {

  const keyBytes = CryptoES.enc.Utf8.parse(key);
  const ivBytes = CryptoES.enc.Utf8.parse(iv);

  // 將物件轉換為查詢字串
  const urlEncodedString = new URLSearchParams(TradeInfo).toString();
  
  // 使用 CBC 模式進行加密
  const encrypted = CryptoES.AES.encrypt(urlEncodedString, keyBytes, {
    iv: ivBytes,
    mode: CryptoES.mode.CBC,
    padding: CryptoES.pad.Pkcs7
  });

  // 轉換為 base64 字串
  return encrypted?.ciphertext?.toString(CryptoES.enc.Hex);
}

// Sha 加密
export function createShaEncrypt(aesEncrypt: string, key: string, iv: string) {
  const plainText = `HashKey=${key}&${aesEncrypt}&HashIV=${iv}`;
  
  // 使用 CryptoES 進行 SHA256 雜湊
  const hash = CryptoES.SHA256(plainText);
  
  // 轉換為大寫的十六進制字串
  return hash.toString(CryptoES.enc.Hex).toUpperCase();
}