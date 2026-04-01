'use client'

import { signIn } from 'next-auth/react'

const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 shadow-xl ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Sign in to Lost & Found BD</h1>
        <p className="mt-4 text-slate-600">Use Google login to access your profile, post items, and chat with the community.</p>
        <button
          onClick={() => void signIn('google')}
          disabled={!googleEnabled}
          className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Continue with Google
        </button>
        {!googleEnabled ? (
          <p className="mt-4 text-sm text-slate-500">Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local.</p>
        ) : null}
      </div>
    </div>
  )
}
