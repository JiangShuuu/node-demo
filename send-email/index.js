import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const emailTemplatePath = path.resolve("example.html");
const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

app.post("/email", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    to: "globelex65@gmail.com",
    subject: "Welcome to Our Service!!!",
    html: emailTemplate,
  };

  await transporter.verify();

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      throw createError({
        statusCode: 500,
        message: "發送失敗",
      });
    } else {
      console.log(info);
      res.json({
        data: true,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
