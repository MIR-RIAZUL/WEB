import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SiteShell } from '@/components/site-shell'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return (
      <SiteShell>
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">Admin access required</h1>
          <p className="mt-3 text-slate-600">Please sign in with an admin account to view the dashboard.</p>
        </div>
      </SiteShell>
    )
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (user?.role !== 'admin') {
    return (
      <SiteShell>
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">Restricted</h1>
          <p className="mt-3 text-slate-600">Only admin users can access this page.</p>
        </div>
      </SiteShell>
    )
  }

  if (!process.env.DATABASE_URL) {
    return (
      <SiteShell>
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900">Database not configured</h1>
          <p className="mt-3 text-slate-600">Set DATABASE_URL in your environment to view admin analytics.</p>
        </div>
      </SiteShell>
    )
  }

  const [itemCount, userCount, reportCount, messageCount] = await Promise.all([
    prisma.item.count(),
    prisma.user.count(),
    prisma.report.count(),
    prisma.message.count()
  ])

  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
          <p className="mt-3 text-slate-600">Overview of listings, users, reports, and platform activity.</p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Total Listings</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{itemCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Active Users</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{userCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Pending reports</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{reportCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Messages sent</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{messageCount}</p>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  )
}
