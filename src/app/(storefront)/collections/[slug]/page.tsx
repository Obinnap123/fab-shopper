import { ProductCard } from '@/components/storefront/products/product-card'
import { PageSpacer } from '@/components/storefront/layout/page-spacer'
import { prisma } from '@/lib/prisma'

interface CollectionPageProps {
  params: Promise<{ slug: string }>
}

type CollectionPageProduct = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  discountedPrice: number | null;
};

const normalizeSlugKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/s$/, "");

async function getCollection(slug: string) {
  try {
    const exactMatch = await prisma.collection.findUnique({ where: { slug } });
    if (exactMatch) return exactMatch;

    const collections = await prisma.collection.findMany({
      select: { id: true, slug: true, name: true, image: true }
    });
    const requested = normalizeSlugKey(slug);
    return collections.find((collection) => normalizeSlugKey(collection.slug) === requested) ?? null;
  } catch (error) {
    console.error("Failed to fetch collection:", error)
    return null
  }
}

async function getCollectionProducts(slug: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        collections: {
          some: { slug }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    // Ensure decimal price formats serialization correctly mapped to numbers
    return products.map((product) => ({
      ...product,
      price: Number(product.price),
      discountedPrice: product.discountedPrice !== null ? Number(product.discountedPrice) : null,
      costPrice: product.costPrice !== null ? Number(product.costPrice) : null
    }))
  } catch (error) {
    console.error("Failed to fetch collection products:", error)
    return []
  }
}

export async function generateStaticParams() {
  return [
    { slug: 'new-arrivals' },
    { slug: 'womens-shoes' },
    { slug: 'mens-shoes' },
    { slug: 'bags' },
    { slug: 'clothing' },
    { slug: 'perfumes' },
    { slug: 'accessories' },
    { slug: 'wristwatches' },
    { slug: 'wristbands' },
  ]
}

export default async function CollectionPage(props: CollectionPageProps) {
  const { slug } = await props.params;
  const collection = await getCollection(slug)
  const resolvedSlug = collection?.slug ?? slug;
  
  // If collection doesn't exist in DB, show a graceful page anyway
  // based on the slug name (for hardcoded category collections)
  const collectionName = collection?.name || 
    slug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  const products = await getCollectionProducts(resolvedSlug)

  return (
    <main>
      <PageSpacer />
      {/* Collection Hero Banner */}
      <section
        className="relative flex items-center justify-center py-20"
        style={{
          minHeight: 400,
          background: 'var(--brand-green)',
          overflow: 'hidden'
        }}
      >
        <div className="text-center z-10 relative px-6 w-full">
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--brand-gold)',
            marginBottom: 16
          }}>
            Collection
          </p>
          <h1 className="text-5xl md:text-7xl" style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            color: 'var(--brand-gold)',
            lineHeight: 1.1,
          }}>
            {collectionName}
          </h1>
          {products.length > 0 && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 16
            }}>
              {products.length} Items
            </p>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section style={{ padding: '80px 0', background: 'var(--brand-cream)' }}>
        <div className="max-w-7xl mx-auto px-8">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-md shadow-sm border border-[rgba(26,60,46,0.1)] p-12">
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontStyle: 'italic',
                color: 'var(--brand-green)',
                marginBottom: 16
              }}>
                Coming Soon
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 16,
                color: 'rgba(0,0,0,0.5)'
              }}>
                We're adding breathtaking products to this collection. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product: CollectionPageProduct) => (
                <ProductCard key={product.id} product={product} theme="light" />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
