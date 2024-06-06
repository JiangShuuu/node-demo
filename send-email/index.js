import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

console.log("prorerere", process.env.GMAIL_USER);

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
    subject: "Welcome to Our Service!",
    html: `
    <html>
    <head>
      <style>
        .container {
          font-family: Arial, sans-serif;
          margin: 0 auto;
          padding: 20px;
          max-width: 600px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          text-align: center;
          padding: 10px 0;
        }
        .content {
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome!</h1>
        </div>
        <div class="content">
          <p>Thank you for joining our service. We are excited to have you on board!</p>
          <p>Here are some quick links to get you started:</p>
          <ul>
            <li><a href="https://example.com/start">Getting Started Guide</a></li>
            <li><a href="https://example.com/support">Customer Support</a></li>
          </ul>
        </div>
        <div class="footer">
          <p>&copy; 2024 Our Service. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
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
