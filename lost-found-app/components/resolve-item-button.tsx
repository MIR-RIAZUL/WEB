'use client'

import { useState } from 'react'

interface ResolveItemButtonProps {
  itemId: string
}

export function ResolveItemButton({ itemId }: ResolveItemButtonProps) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const markResolved = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      })
      if (!response.ok) throw new Error('Unable to update status')
      const data = await response.json()
      setStatus(data.status)
    } catch (err) {
      setError('Could not mark item resolved.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button disabled={loading} onClick={markResolved} className="inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">
        {loading ? 'Saving...' : 'Mark as Resolved'}
      </button>
      {status ? <p className="text-sm text-emerald-600">Updated status: {status}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  )
}
