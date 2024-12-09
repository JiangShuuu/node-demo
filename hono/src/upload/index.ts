// https://tinymurky.medium.com/nodejs-%E9%80%8F%E9%81%8Egoogle-cloud-storage%E8%BC%95%E9%AC%86%E5%B1%95%E7%A4%BA%E5%9C%96%E7%89%87-%E6%89%93%E9%80%A0%E5%B1%AC%E6%96%BC%E8%87%AA%E5%B7%B1%E7%9A%84%E5%9C%96%E5%BA%AB-31a8df808537
import { Hono } from "hono"
import { uploadGoogleFile } from "../../gcp/storage"
import { encodeBase64 } from "hono/utils/encode"

const app = new Hono()


app.post('/', async (c) => {
  try {
    const body = await c.req.parseBody();
    const image = body["image"] as File;
    const byteArrayBuffer = await image.arrayBuffer();
    const base64 = encodeBase64(byteArrayBuffer);
    const result = await uploadGoogleFile(base64, image.name, 0);

    return c.json({ ok: true, url: result });
  } catch (error) {
    console.error('Error:', error);
    return c.json({ ok: false, error: 'Upload failed' });
  }
});

export default app