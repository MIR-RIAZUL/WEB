'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { ItemCard } from '@/components/item-card'

interface MatchItem {
  id: string
  title: string
  category: string
  location: string
  status: string
  reward?: number
  imageUrls: string[]
  matchScore?: number
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Unable to read file'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function ImageMatchPanel() {
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [labels, setLabels] = useState<string[]>([])
  const [results, setResults] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setSelectedFile(null)
      setPreviewUrl('')
      return
    }

    const blobUrl = URL.createObjectURL(file)
    setSelectedFile(file)
    setPreviewUrl(blobUrl)
    setImageUrl('')
    setLabels([])
    setResults([])
    setError('')
  }

  const handleSearch = async () => {
    if (!imageUrl && !selectedFile) {
      setError('Please upload an image or paste an image URL.')
      return
    }

    setLoading(true)
    setError('')
    setLabels([])
    setResults([])

    try {
      const payload: Record<string, any> = { category: category.trim(), location: location.trim() }

      if (selectedFile) {
        payload.imageBase64 = await fileToBase64(selectedFile)
      } else {
        payload.imageUrl = imageUrl.trim()
      }

      const response = await fetch('/api/image-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Image matching failed.')
      } else {
        setLabels(data.labels ?? [])
        setResults(data.matches ?? [])
        if (!previewUrl && data.imageUrl) {
          setPreviewUrl(data.imageUrl)
        }
      }
    } catch (err) {
      setError('Could not run image matching. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200/70">
        <h2 className="text-lg font-semibold text-slate-900">Upload a photo to find matching listings</h2>
        <p className="mt-2 text-sm text-slate-500">Use an item photo from your phone or paste an image URL. The AI will compare detected labels with stored lost and found posts.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Image URL
            <input
              value={imageUrl}
              onChange={e => {
                setImageUrl(e.target.value)
                setSelectedFile(null)
                setPreviewUrl(e.target.value)
                setError('')
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="https://example.com/item-photo.jpg"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Upload photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Category filter
            <input
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="Electronics, Accessories..."
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Location filter
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              placeholder="Dhaka, Chittagong..."
            />
          </label>
        </div>

        {previewUrl ? (
          <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
            <img src={previewUrl} alt="Preview" className="h-72 w-full object-cover" />
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? 'Matching...' : 'Find matching items'}
          </button>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
      </div>

      {labels.length ? (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Detected image labels</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {labels.map(label => (
              <span key={label} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                {label}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <section className="space-y-6">
        {results.length ? (
          <>
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
              <h3 className="text-base font-semibold text-slate-900">Matching results</h3>
              <p className="mt-2 text-sm text-slate-500">Results are ranked by visual similarity and text match confidence.</p>
            </div>
            <div className="grid gap-6 xl:grid-cols-3">
              {results.map(item => (
                <div key={item.id} className="space-y-3">
                  <ItemCard
                    id={item.id}
                    title={item.title}
                    category={item.category}
                    location={item.location}
                    status={item.status}
                    reward={item.reward ?? 0}
                    imageUrl={item.imageUrls?.[0] ?? ''}
                  />
                  <p className="text-sm text-slate-500">Match score: {item.matchScore?.toFixed(0) ?? 0}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200/70 text-slate-500">
            Upload an image or paste an item photo URL to find similar lost/found posts.
          </div>
        )}
      </section>
    </div>
  )
}
