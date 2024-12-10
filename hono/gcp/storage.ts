import { Storage } from "@google-cloud/storage";

export const googleStorage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY || '{}')
});

export const googleBucket = googleStorage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME || '');

export async function uploadGoogleFile(base64Data: string, destFileName: string, generationMatchPrecondition: number) {  
  const buffer = Buffer.from(base64Data, 'base64');

  const url = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET_NAME ?  process.env.GOOGLE_STORAGE_BUCKET_NAME + '/': ''}${destFileName}`;

  const file = googleBucket.file(destFileName);

  try {
    // 如果該檔案已經存在，則使用該檔案的 generation 來進行上傳
    const [metadata] = await file.getMetadata();
    await file.save(buffer, {
      preconditionOpts: { 
        ifGenerationMatch: metadata.generation 
      }
    });
  } catch (error) {
    // 如果該檔案不存在，則使用 0 代表新文件
    await file.save(buffer, {
      preconditionOpts: { 
        ifGenerationMatch: 0 
      }
    });
  }
  
  await file.makePublic();
  return url;
}

export async function deleteGoogleFile(destFileName: string) {
  try {
    await googleStorage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME || '').file(destFileName).delete();
  } catch (error) {
    console.error('Error delete file:', error);
    return false;
  }
  return true;
}