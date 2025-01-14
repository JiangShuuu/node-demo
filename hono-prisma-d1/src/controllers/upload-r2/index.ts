import App from "../../app";
import { Context } from "hono";
import { s3Client } from "./utile";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command, 
} from "@aws-sdk/client-s3";

const createUploadFile = async (c: Context) => {
  console.log("uploadR2", c.env);

  const params = {
    Bucket: "hono-example",
    Key: "example/test",
    Body: JSON.stringify('Hello, World!'),
    ContentType: "application/json",
  };

  const command = new PutObjectCommand(params);
  
  try {
    const response = await s3Client(c.env).send(command);
    console.log("response", response);
  } catch (error) {
    console.log("error", error);
  }

  return c.json({ message: "uploadR2" });
};

const uploadR2Controller = App.basePath("/upload/r2")
  .post("/create", createUploadFile);

export default uploadR2Controller;
