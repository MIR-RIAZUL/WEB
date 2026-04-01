import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Lost & Found Bangladesh',
  description: 'AI-powered lost and found marketplace for Bangladesh.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers session={null}>{children}</Providers>
      </body>
    </html>
  )
}
