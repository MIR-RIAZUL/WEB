import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { detectImageLabels } from '@/lib/vision'
import { prisma } from '@/lib/prisma'
import { sampleItems } from '@/lib/demo-data'

const hasDb = Boolean(process.env.DATABASE_URL)

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const query = url.searchParams.get('query') || undefined
  const category = url.searchParams.get('category') || undefined
  const location = url.searchParams.get('location') || undefined
  const ownerId = url.searchParams.get('ownerId') || undefined

  if (!hasDb) {
    const filtered = sampleItems.filter(item => {
      const queryMatch = query
        ? item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase())
        : true
      const categoryMatch = category ? item.category === category : true
      const locationMatch = location ? item.location.toLowerCase().includes(location.toLowerCase()) : true
      const ownerMatch = ownerId ? item.owner.id === ownerId : true
      return queryMatch && categoryMatch && locationMatch && ownerMatch
    })
    return NextResponse.json(filtered)
  }

  const items = await prisma.item.findMany({
    where: {
      OR: query
        ? [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        : undefined,
      category: category ? { equals: category } : undefined,
      location: location ? { contains: location, mode: 'insensitive' } : undefined,
      ownerId: ownerId ? { equals: ownerId } : undefined
    },
    orderBy: { createdAt: 'desc' },
    include: { owner: true }
  })

  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  if (!hasDb) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, category, location, latitude, longitude, date, imageUrls, status, reward } = body

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const item = await prisma.item.create({
    data: {
      title,
      description,
      category,
      location,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      date: new Date(date),
      imageUrls: imageUrls || [],
      imageLabels: imageUrls?.length ? await detectImageLabels(imageUrls[0]) : [],
      status: status || 'LOST',
      reward: reward ? Number(reward) : 0,
      ownerId: user.id
    }
  })

  return NextResponse.json(item)
}
