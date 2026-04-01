import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const targetId = url.searchParams.get('target')
  if (!targetId) {
    return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 })
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { fromId: user.id, toId: targetId },
        { fromId: targetId, toId: user.id }
      ]
    },
    orderBy: { createdAt: 'asc' }
  })

  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const message = await prisma.message.create({
    data: {
      fromId: user.id,
      toId: body.toId,
      itemId: body.itemId,
      content: body.content
    }
  })

  return NextResponse.json(message)
}
