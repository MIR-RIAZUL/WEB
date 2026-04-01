import { prisma } from '@/lib/prisma'
import { SiteShell } from '@/components/site-shell'
import { ItemCard } from '@/components/item-card'

type HomeItem = {
  id: string
  title: string
  category: string
  location: string
  status: string
  reward: number | null
  imageUrls: string[]
  owner: {
    name: string | null
    email: string
  }
}

export default async function HomePage() {
  const hasDb = Boolean(process.env.DATABASE_URL)
  const recentItems: HomeItem[] = hasDb
    ? await prisma.item.findMany({ orderBy: { createdAt: 'desc' }, take: 6, include: { owner: true } })
    : [
        {
          id: 'demo-1',
          title: 'Red school bag',
          category: 'Accessories',
          location: 'Dhaka University',
          status: 'LOST',
          reward: 500,
          imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'],
          owner: { name: 'Ayesha Rahman', email: 'user@lostfoundbd.com' }
        },
        {
          id: 'demo-2',
          title: 'Black smartphone',
          category: 'Electronics',
          location: 'Gulshan-1',
          status: 'FOUND',
          reward: 0,
          imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'],
          owner: { name: 'Admin User', email: 'admin@lostfoundbd.com' }
        }
      ]
  const totalItems = hasDb ? await prisma.item.count() : 2
  const totalUsers = hasDb ? await prisma.user.count() : 10

  return (
    <SiteShell>
      <section className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-[0_35px_120px_-50px_rgba(15,23,42,0.3)] ring-1 ring-slate-200/70">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          <div>
            <div className="inline-flex items-center rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-700 shadow-sm">
              Trusted by communities across Bangladesh
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Recover lost things faster with AI-powered matching.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
              Post lost or found items, search naturally in Bangla and English, and let the system suggest matches automatically. Built for communities across Bangladesh.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/post-item" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
                Post an item
              </a>
              <a href="/browse" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Browse items
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-3xl font-semibold text-slate-900">{totalItems}</p>
              <p className="mt-3 text-sm text-slate-500">Active listings</p>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
              <p className="text-3xl font-semibold text-slate-900">{totalUsers}</p>
              <p className="mt-3 text-sm text-slate-500">Community members</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-600">Recent postings</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest lost & found items</h2>
          </div>
          <a href="/browse" className="text-sm font-semibold text-brand-700 transition hover:text-brand-900">
            View all listings
          </a>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recentItems.map(item => (
            <ItemCard key={item.id} id={item.id} title={item.title} category={item.category} location={item.location} status={item.status} reward={item.reward ?? 0} imageUrl={item.imageUrls[0]} />
          ))}
        </div>
      </section>
    </SiteShell>
  )
}
