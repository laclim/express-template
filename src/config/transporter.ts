import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",

  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD // generated ethereal password
  }
});
