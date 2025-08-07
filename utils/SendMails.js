import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or 'SendGrid', 'Yahoo', or use 'host' and 'port' below
  auth: {
    user: process.env.EMAIL_USER,      // your email
    pass: process.env.EMAIL_PASS       // your email app password
  }
  // You can use host/port if you're not using a service:
  // host: 'smtp.gmail.com',
  // port: 587,
  // secure: false,
});

export const SendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Microcon Systems" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Email sending failed");
  }
};
