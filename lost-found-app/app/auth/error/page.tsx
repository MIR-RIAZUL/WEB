'use client'

import Link from 'next/link'

export default function SignInErrorPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Authentication failed</h1>
        <p className="mt-4 text-slate-600">There was a problem signing you in. Please try again or contact support.</p>
        <Link href="/auth/signin" className="mt-8 inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
