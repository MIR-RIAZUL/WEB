'use client'

import { useState } from 'react'

interface SearchPanelProps {
  onSearch: (query: string, category: string, location: string) => void
}

export function SearchPanel({ onSearch }: SearchPanelProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Natural language search</h2>
      <p className="mt-2 text-sm text-slate-500">Search in Bangla or English, filter by category or location.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="space-y-2 text-sm text-slate-700">
          Search keywords
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="e.g. হারিয়ে যাওয়া ব্যাগ, found phone"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Category
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <option value="">All categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Location
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            placeholder="Dhaka, Chittagong, Sylhet"
          />
        </label>
      </div>
      <button className="mt-5 inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700" onClick={() => onSearch(query, category, location)}>
        Search items
      </button>
    </div>
  )
}
