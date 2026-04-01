'use client'

import { useEffect, useState } from 'react'
import { SearchPanel } from '@/components/search-panel'
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

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const runSearch = async (query = '', category = '', location = '') => {
    setLoading(true)
    if (query) {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, category, location })
      })
      const data = await response.json()
      setItems(data ?? [])
    } else {
      const endpoint = `/api/items?category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`
      const response = await fetch(endpoint)
      const data = await response.json()
      setItems(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    void runSearch()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Browse lost and found listings</h1>
          <p className="mt-3 text-slate-600">Search in Bangla or English, filter by category, and review the latest item posts.</p>
          <div className="mt-8">
            <SearchPanel onSearch={runSearch} />
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">Loading listings...</div>
          ) : items.length ? (
            items.map(item => (
              <ItemCard key={item.id} id={item.id} title={item.title} category={item.category} location={item.location} status={item.status} reward={item.reward ?? 0} imageUrl={item.imageUrls?.[0]} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">No matching items were found.</div>
          )}
        </section>
      </div>
    </div>
  )
}
