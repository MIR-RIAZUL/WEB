'use client'

import { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { ItemCard } from '@/components/item-card'

interface Item {
  id: string
  title: string
  category: string
  location: string
  status: string
  reward?: number | null
  imageUrls: string[]
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadItems = async () => {
      if (!session?.user?.id) return
      setLoading(true)
      const response = await fetch(`/api/items?ownerId=${session.user.id}`)
      const data = await response.json()
      setItems(data ?? [])
      setLoading(false)
    }

    void loadItems()
  }, [session?.user?.id])

  const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 shadow-xl ring-1 ring-slate-200 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Your profile</h1>
          <p className="mt-4 text-slate-600">Sign in to manage your listings and verification settings.</p>
          <button
            onClick={() => void signIn('google')}
            disabled={!googleEnabled}
            className="mt-8 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Sign in with Google
          </button>
          {!googleEnabled ? (
            <p className="mt-4 text-sm text-slate-500">Google login is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local.</p>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-600">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back, {session.user.name ?? session.user.email}</h1>
            </div>
            <button onClick={() => void signOut()} className="rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Sign out
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-2 text-slate-900">{session.user.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Verification status</p>
              <p className="mt-2 text-emerald-600">Verified</p>
            </div>
          </div>
        </div>

        <section className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">Your active listings</h2>
          <p className="mt-2 text-sm text-slate-500">Manage your lost and found posts in one place.</p>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            {loading ? (
              <div className="col-span-full rounded-3xl bg-slate-50 p-8 text-center text-slate-500">Loading your items...</div>
            ) : items.length ? (
              items.map(item => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  location={item.location}
                  status={item.status}
                  reward={item.reward ?? 0}
                  imageUrl={item.imageUrls?.[0]}
                />
              ))
            ) : (
              <div className="col-span-full rounded-3xl bg-slate-50 p-8 text-center text-slate-500">You have not posted any items yet.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
