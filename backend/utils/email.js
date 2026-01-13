import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendMagicLink(email, token) {
  const magicLink = `${process.env.FRONTEND_URL}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

  await transporter.sendMail({
    from: `"WebBuilder" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Magic Link to WebBuilder',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Login to WebBuilder</h2>
        <p>Click the button below to login. This link expires in 15 minutes.</p>
        <a href="${magicLink}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Login to WebBuilder
        </a>
        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `
  });
}
