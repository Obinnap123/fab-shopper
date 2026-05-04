"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSnapPixel(id: string) {
  const settings = await prisma.storeSettings.findFirst();
  
  if (settings) {
    await prisma.storeSettings.update({
      where: { id: settings.id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { snapPixelId: id } as any
    });
  } else {
    await prisma.storeSettings.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { snapPixelId: id } as any
    });
  }
  
  revalidatePath("/", "layout");
  return { success: true };
}
