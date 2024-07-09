import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST ?? "localhost",
  port: parseInt(process.env.EMAIL_PORT ?? "25", 10),
  auth: {
    user: process.env.EMAIL_USER ?? "",
    pass: process.env.EMAIL_PASSWORD ?? "",
  },
});

export default transporter;
