import { Resend } from "resend";
import { requiredEnv } from "@/lib/env";

let resendClient: Resend | null = null;

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL);
}

function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(requiredEnv("RESEND_API_KEY"));
  }

  return resendClient;
}

export function getFromEmail() {
  return requiredEnv("FROM_EMAIL");
}

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailArgs) {
  return getResendClient().emails.send({
    from: getFromEmail(),
    to,
    subject,
    html,
    text
  });
}
