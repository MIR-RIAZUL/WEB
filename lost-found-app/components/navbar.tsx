'use client'

import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-brand-600 text-lg font-bold text-white shadow-sm">
            LF
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.15em] text-slate-900">Lost & Found BD</p>
            <p className="text-xs text-slate-500">AI-powered recovery</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {['Browse', 'Image Match', 'Post Item', 'Chat', 'Profile', 'Admin'].map(label => (
            <Link
              key={label}
              href={`/${label.toLowerCase().replace(' ', '-')}`}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-600">{session.user.name ?? session.user.email}</span>
              <button
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                onClick={() => void signOut()}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              onClick={() => void signIn('google')}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
