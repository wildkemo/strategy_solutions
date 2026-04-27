import nodemailer from 'nodemailer';

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * @returns {{ skipped: boolean }}
 */
export async function sendUserEmail({ to, subject, text }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[mail] EMAIL_USER / EMAIL_PASS not set — skipped:', subject)
    return { skipped: true }
  }
  await getTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  })
  return { skipped: false }
}
