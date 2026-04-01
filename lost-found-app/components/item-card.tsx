'use client'

import Link from 'next/link'

interface ItemCardProps {
  id: string
  title: string
  category: string
  location: string
  status: string
  reward?: number | null
  imageUrl?: string
}

export function ItemCard({ id, title, category, location, status, reward, imageUrl }: ItemCardProps) {
  return (
    <Link
      href={`/item/${id}`}
      className="group block overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-56 bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No image</div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
          {status}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">{category}</span>
          {reward ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              ৳{reward.toFixed(0)}
            </span>
          ) : null}
        </div>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{location}</p>
      </div>
    </Link>
  )
}
