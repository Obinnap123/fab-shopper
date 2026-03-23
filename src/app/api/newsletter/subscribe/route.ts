import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    // 1. Save to local DB as backup
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email }
    });

    // 2. Sync to Mailchimp
    const { MAILCHIMP_API_KEY, MAILCHIMP_API_SERVER, MAILCHIMP_AUDIENCE_ID } = process.env;

    if (MAILCHIMP_API_KEY && MAILCHIMP_API_SERVER && MAILCHIMP_AUDIENCE_ID) {
      const url = `https://${MAILCHIMP_API_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `auth ${MAILCHIMP_API_KEY}`
        },
        body: JSON.stringify({
          email_address: parsed.data.email,
          status: "subscribed", // "subscribed" means immediate opt-in
          merge_fields: {
            FNAME: parsed.data.firstName || "",
            LNAME: parsed.data.lastName || ""
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // If "Member Exists" we can ignore it since they are already safely subscribed.
        if (errorData.title !== "Member Exists") {
          console.error("Mailchimp Sync Error:", errorData);
        }
      }
    }
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
