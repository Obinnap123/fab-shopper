import { NextResponse } from 'next/server'
import { z } from "zod";
import { prisma } from '@/lib/prisma'
import { slugify } from "@/lib/slug";

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const slug = params.slug

    const collection = await prisma.collection.findUnique({
      where: { slug: slug }
    })
    
    if (!collection) {
      // Return a graceful response even if not in DB
      return NextResponse.json({ 
        name: slug.split('-').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' '),
        slug: slug 
      })
    }
    
    return NextResponse.json(collection)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 })
  }
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().optional()
});

export async function PATCH(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const idValue = params.slug; // Passed as ID from the frontend Admin client
  
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { name, image } = parsed.data;
  
  const updateData: any = {};
  if (name !== undefined) {
    updateData.name = name;
    updateData.slug = slugify(name);
  }
  if (image !== undefined) {
    updateData.image = image;
  }

  try {
    const updated = await prisma.collection.update({
      where: { id: idValue },
      data: updateData
    });
    return NextResponse.json({ data: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const idValue = params.slug;
  try {
    await prisma.collection.delete({ where: { id: idValue } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}
