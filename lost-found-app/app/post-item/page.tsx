'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface UploadResult {
  url: string
}

export default function PostItemPage() {
  const { data: session } = useSession()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Accessories',
    location: '',
    latitude: '',
    longitude: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'LOST',
    reward: '0'
  })
  const [images, setImages] = useState<File[]>([])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })

  const uploadImages = async () => {
    const uploaded: string[] = []
    for (const file of images) {
      const base64 = await toBase64(file)
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      })
      const data = (await response.json()) as UploadResult
      if (data.url) uploaded.push(data.url)
    }
    return uploaded
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!session?.user) {
      setMessage('Login first to post an item.')
      return
    }
    setSubmitting(true)
    try {
      const imageUrls = images.length ? await uploadImages() : []
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude) || undefined,
          longitude: parseFloat(form.longitude) || undefined,
          reward: parseFloat(form.reward) || 0,
          imageUrls
        })
      })
      if (!response.ok) throw new Error('Save failed')
      setMessage('Item posted successfully. Check Browse items to view it.')
      setImages([])
      setForm({ ...form, title: '', description: '', location: '', reward: '0' })
    } catch (error) {
      setMessage('Could not save item. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Post a lost or found item</h1>
        <p className="mt-3 text-slate-600">Add details, attach images, and let the platform match your listing.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Title
              <input value={form.title} onChange={e => update('title', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500" placeholder="e.g. Lost red backpack" required />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Category
              <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option>Accessories</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Personal</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-700 block">
            Description
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={5} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500" placeholder="Describe the item, where it was lost or found." required />
          </label>

          <div className="grid gap-6 lg:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-700">
              Location
              <input value={form.location} onChange={e => update('location', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="e.g. Gulshan, Dhaka" required />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Latitude
              <input value={form.latitude} onChange={e => update('latitude', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="23.8103" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Longitude
              <input value={form.longitude} onChange={e => update('longitude', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="90.4125" />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-700">
              Date
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" required />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Status
              <select value={form.status} onChange={e => update('status', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Reward (৳)
              <input value={form.reward} onChange={e => update('reward', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="0" type="number" min="0" />
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-700 block">
            Upload images
            <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files ?? []))} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
          </label>

          {message ? <p className="text-sm text-slate-600">{message}</p> : null}

          <button disabled={submitting} className="inline-flex w-full items-center justify-center rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            {submitting ? 'Posting...' : 'Publish item'}
          </button>
        </form>
      </div>
    </div>
  )
}
