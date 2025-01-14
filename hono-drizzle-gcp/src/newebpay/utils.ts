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

export function createAesDecrypt(TradeInfo: string, key: string, iv: string) {
  try {
    // 1. 將 hex 字串轉換為 WordArray
    const ciphertext = CryptoES.enc.Hex.parse(TradeInfo);
    
    // 2. 準備 key 和 iv
    const keyBytes = CryptoES.enc.Utf8.parse(key);
    const ivBytes = CryptoES.enc.Utf8.parse(iv);

    // 3. 解密
    const decrypted = CryptoES.AES.decrypt(
      { ciphertext: ciphertext },
      keyBytes,
      {
        iv: ivBytes,
        mode: CryptoES.mode.CBC,
        padding: CryptoES.pad.Pkcs7
      }
    );

    // 4. 轉換為 UTF-8 字串
    const decryptedStr = decrypted.toString(CryptoES.enc.Utf8);

    // 5. 移除填充字符
    const result = decryptedStr.replace(/[\x00-\x20]+/g, '');

    // 6. 解析 JSON
    return JSON.parse(result);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt TradeInfo');
  }
}
