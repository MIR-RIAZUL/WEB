import { NextRequest, NextResponse } from 'next/server'
import { aiSearchItems } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { query, category, location, date } = body

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  const results = await aiSearchItems(query, { category, location, date })
  const hasDb = Boolean(process.env.DATABASE_URL)

  if (!hasDb) {
    return NextResponse.json(results)
  }

  const enriched = await prisma.item.findMany({
    where: { id: { in: results.map(item => item.id) } },
    include: { owner: true }
  })

  return NextResponse.json(enriched)
}
