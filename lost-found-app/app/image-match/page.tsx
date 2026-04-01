import { SiteShell } from '@/components/site-shell'
import { ImageMatchPanel } from '@/components/image-match-panel'

export default function ImageMatchPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_auto]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-700">Visual search</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900">Find matching items by photo</h1>
              <p className="mt-3 text-slate-600">Upload a picture of a lost or found item and the AI matching engine will compare it to existing posts in the database.</p>
            </div>
          </div>
        </section>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <ImageMatchPanel />
        </div>
      </div>
    </SiteShell>
  )
}
