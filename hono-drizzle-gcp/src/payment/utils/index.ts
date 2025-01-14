import CryptoES from 'crypto-es'

export function generateRandomCode() {
  const now = new Date()
  const dateStr = now.toISOString().replace(/[-:]/g, '').slice(0, 14)
  const randomStr = Array.from({ length: 6 }, () => Math.random().toString(36)[2]).join('')
  return `${dateStr}${randomStr}`
}

// AES加密
export function encodeAES(jsonData: any) {
  // Key
  const secretKey = CryptoES.enc.Utf8.parse(process.env.AES_KEY || '')
  const iv = CryptoES.enc.Utf8.parse(process.env.AES_IV || '')
  // 加密
  const jsonString = JSON.stringify(jsonData)
  // UrlEncode
  const encodedString = encodeURIComponent(jsonString)
  // AesEncode
  const cipherText = CryptoES.AES.encrypt(encodedString, secretKey, {
    iv,
    mode: CryptoES.mode.CBC,
    padding: CryptoES.pad.Pkcs7 // 使用PKCS7填充
  })
  // base64
  const base64CipherText = cipherText.toString()
  return base64CipherText
}

// AES解密
export function decodeAES(aesCode: any) {
  // Key
  const secretKey = CryptoES.enc.Utf8.parse(process.env.AES_KEY || '')
  const iv = CryptoES.enc.Utf8.parse(process.env.AES_IV || '')
  // 解密
  const cipherText = CryptoES.enc.Base64.parse(aesCode)

  const decrypted = CryptoES.AES.decrypt({ ciphertext: cipherText }, secretKey, {
    iv,
    mode: CryptoES.mode.CBC,
    padding: CryptoES.pad.Pkcs7
  })

  const utf8Text = decrypted.toString(CryptoES.enc.Utf8)

  // URL 解码
  const decodedString = decodeURIComponent(utf8Text)

  // JSON 解码
  try {
    const decryptedObject = JSON.parse(decodedString)
    return decryptedObject
  } catch (error) {
    console.error('解析 JSON 錯誤::', error)
  }

  return utf8Text
}

// 產生 SHA256 的 CheckMacValue
export function generateCheckMacValue(payload: any, hashKey: string, hashIV: string) {
  // 將 payload 轉換為排序後的查詢字串
  const sortedQueryString = Object.keys(payload)
    .sort()
    .map(key => `${key}=${payload[key]}`)
    .join('&');

  // 加入 HashKey 與 HashIV
  const stringWithHash = `HashKey=${hashKey}&${sortedQueryString}&HashIV=${hashIV}`;

  // URL encode
  const encodedString = encodeURIComponent(stringWithHash)
    .replace(/%20/g, '+') // 符合規範，用 + 替代空格
    .toLowerCase();       // 轉小寫

  // 使用 SHA256 進行雜湊
  const hash = CryptoES.SHA256(encodedString).toString();

  // 轉大寫
  const checkMacValue = hash.toUpperCase();

  return checkMacValue;
}
