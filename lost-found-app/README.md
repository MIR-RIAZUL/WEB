# Lost & Found Bangladesh

A Next.js + Tailwind CSS production-ready lost and found application built for Bangladesh. This starter includes authentication, item listings, smart AI search, image recognition placeholders, chat, and admin analytics.

## Features
- Google login and JWT session support via NextAuth
- PostgreSQL database with Prisma ORM
- Multi-image item posts with Cloudinary upload helper
- AI-powered search matching using OpenAI
- Item detail pages, chat, profile, admin dashboard
- Bangladesh-specific config and modern mobile-first UI

## Setup
1. Copy `.env.example` to `.env` and fill in secrets.
2. Install dependencies:
```bash
cd "d:/EDUCATION/8th trimester/WEB/lost-found-app"
npm install
























- Use Cloudinary credentials for image uploads.
- Provide Google OAuth client credentials.
- Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` for map rendering.## Notes- `app/api/` - authenticated API routes- `prisma/` - database schema and seed data- `lib/` - backend helpers for Prisma, auth, AI, Cloudinary- `components/` - reusable React components- `app/` - Next.js pages and UI## Project structurenpm run dev
``` ```bash5. Run development server:npm run prisma:seed
``` ```bash4. Seed sample data:npx prisma migrate dev --name init
``` npx prisma generate```bash3. Generate Prisma client and migrate database:``` 