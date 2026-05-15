import { prisma } from "@/lib/prisma";
import { isEmailConfigured, sendEmail } from "@/lib/email";

type WelcomeEmailCustomer = {
  id: string;
  firstName: string;
  email: string | null;
  welcomeEmailSent: boolean;
};

function buildWelcomeEmailHtml(firstName: string) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f7f4ec; color: #1a3c2e; padding: 32px;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 36px 32px; border: 1px solid rgba(26,60,46,0.08);">
        <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #8b7b44; margin: 0 0 14px;">Fab Shopper</p>
        <h1 style="font-size: 28px; line-height: 1.25; margin: 0 0 16px;">Your account is ready, ${firstName}.</h1>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">
          Thanks for creating your Fab Shopper account.
        </p>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">
          You can now sign in to view your account, manage your details, and track your orders in one place.
        </p>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
          If you did not create this account, please reply to this email so we can help.
        </p>
        <a href="https://delightclosetrevolution.com/account" style="display: inline-block; background: #1a3c2e; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-weight: 600;">
          Go to My Account
        </a>
        <p style="font-size: 13px; line-height: 1.7; color: #5e6d65; margin: 28px 0 0;">
          Fab Shopper
        </p>
      </div>
    </div>
  `;
}

function buildWelcomeEmailText(firstName: string) {
  return `Your account is ready, ${firstName}.

Thanks for creating your Fab Shopper account.

You can now sign in to view your account, manage your details, and track your orders in one place.

Need help getting started? Reply to this email and we'll help.

Go to your account: https://delightclosetrevolution.com/account`;
}

export async function sendWelcomeEmail(customer: WelcomeEmailCustomer) {
  if (!customer.email || customer.welcomeEmailSent || !isEmailConfigured()) {
    return;
  }

  try {
    await sendEmail({
      to: customer.email,
      subject: "Your Fab Shopper account is ready",
      html: buildWelcomeEmailHtml(customer.firstName),
      text: buildWelcomeEmailText(customer.firstName),
    });

    await prisma.customer.update({
      where: { id: customer.id },
      data: { welcomeEmailSent: true },
    });
  } catch (error) {
    console.error("Failed to send welcome email", error);
  }
}
