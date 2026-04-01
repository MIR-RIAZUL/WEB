import { prisma } from '@/lib/prisma'
import { SiteShell } from '@/components/site-shell'
import { ResolveItemButton } from '@/components/resolve-item-button'
import { sampleItems } from '@/lib/demo-data'

interface ItemDetailPageProps {
  params: { id: string }
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const hasDb = Boolean(process.env.DATABASE_URL)

  const item = hasDb
    ? await prisma.item.findUnique({
        where: { id: params.id },
        include: { owner: true }
      })
    : sampleItems.find(item => item.id === params.id)

  if (!item) {
    return (
      <SiteShell>
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">Item not found</h1>
          <p className="mt-3 text-slate-600">The requested listing is not available.</p>
        </div>
      </SiteShell>
    )
  }

  if (!item) {
    return (
      <SiteShell>
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">Item not found</h1>
          <p className="mt-3 text-slate-600">The requested listing is not available.</p>
        </div>
      </SiteShell>
    )
  }

  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapUrl = item.latitude && item.longitude && mapKey ? `https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=${item.latitude},${item.longitude}` : null

  return (
    <SiteShell>
      <div className="grid gap-10 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-wrap items-start gap-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.25em] text-brand-600">{item.status} item</p>
              <h1 className="text-3xl font-semibold text-slate-900">{item.title}</h1>
            </div>
            <span className="ml-auto rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              {item.category}
            </span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-2 font-semibold text-slate-900">{item.location}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Reported by</p>
              <p className="mt-2 font-semibold text-slate-900">{item.owner.name ?? item.owner.email}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-sm text-slate-500">Description</p>
              <p className="mt-3 text-slate-700 leading-7">{item.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Date</p>
                <p className="mt-2 font-semibold text-slate-900">{new Date(item.date).toISOString().split('T')[0]}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Reward</p>
                <p className="mt-2 font-semibold text-emerald-600">৳ {item.reward?.toFixed(0) ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {item.imageUrls.length ? item.imageUrls.map(url => (
              <img key={url} src={url} alt={item.title} className="h-56 w-full rounded-3xl object-cover" />
            )) : (
              <div className="flex h-56 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">No images uploaded.</div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-5 space-y-4">
              <ResolveItemButton itemId={item.id} />
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Share a WhatsApp alert</p>
                <a href={`https://wa.me/?text=${encodeURIComponent(`I found this item: ${item.title} at ${item.location}. View details: ${process.env.NEXT_PUBLIC_BASE_URL}/item/${item.id}`)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                  Share on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {mapUrl ? (
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200">
              <iframe title="Item location" width="100%" height="320" loading="lazy" src={mapUrl} />
            </div>
          ) : (
            <div className="rounded-[2rem] bg-white p-6 text-slate-600 shadow-xl ring-1 ring-slate-200">Add GPS coordinates to display a map here.</div>
          )}
        </aside>
      </div>
    </SiteShell>
  )
}
