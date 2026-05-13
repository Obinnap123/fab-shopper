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
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 40px 32px;">
        <p style="font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #8b7b44; margin: 0 0 16px;">Fab Shopper</p>
        <h1 style="font-size: 30px; line-height: 1.2; margin: 0 0 16px;">Welcome, ${firstName}.</h1>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">
          Your account is ready and we are excited to have you with us.
        </p>
        <p style="font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
          You can now explore new arrivals, save your favorites, and enjoy a smoother checkout experience every time you shop.
        </p>
        <a href="https://delightclosetrevolution.com" style="display: inline-block; background: #1a3c2e; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-weight: 600;">
          Start Shopping
        </a>
      </div>
    </div>
  `;
}

function buildWelcomeEmailText(firstName: string) {
  return `Welcome, ${firstName}.

Your Fab Shopper account is ready. You can now explore new arrivals, save your favorites, and enjoy a faster checkout experience.

Start shopping: https://delightclosetrevolution.com`;
}

export async function sendWelcomeEmail(customer: WelcomeEmailCustomer) {
  if (!customer.email || customer.welcomeEmailSent || !isEmailConfigured()) {
    return;
  }

  try {
    await sendEmail({
      to: customer.email,
      subject: "Welcome to Fab Shopper",
      html: buildWelcomeEmailHtml(customer.firstName),
      text: buildWelcomeEmailText(customer.firstName)
    });

    await prisma.customer.update({
      where: { id: customer.id },
      data: { welcomeEmailSent: true }
    });
  } catch (error) {
    console.error("Failed to send welcome email", error);
  }
}
