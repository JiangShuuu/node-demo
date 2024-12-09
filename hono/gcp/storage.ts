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
  await file.save(buffer, {
    preconditionOpts: { ifGenerationMatch: generationMatchPrecondition }
  });
  await file.makePublic();
  return url;
}
