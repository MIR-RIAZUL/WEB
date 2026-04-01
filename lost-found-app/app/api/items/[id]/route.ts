import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { sampleItems } from '@/lib/demo-data'

const hasDb = Boolean(process.env.DATABASE_URL)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!hasDb) {
    const item = sampleItems.find(item => item.id === params.id)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  }

  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: { owner: true }
  })
  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }
  return NextResponse.json(item)
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!hasDb) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const item = await prisma.item.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

  const body = await request.json()
  const updated = await prisma.item.update({
    where: { id: params.id },
    data: {
      status: body.status,
      updatedAt: new Date()
    }
  })

  return NextResponse.json(updated)
}
