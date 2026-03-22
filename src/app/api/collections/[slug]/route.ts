import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
