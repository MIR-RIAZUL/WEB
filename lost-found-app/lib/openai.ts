import OpenAI from 'openai'
import { prisma } from './prisma'
import { sampleItems } from './demo-data'

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null
const hasDb = Boolean(process.env.DATABASE_URL)

export async function estimateMatchScore(textA: string, textB: string) {
  if (!client) {
    return Math.min(100, Math.floor((textA.length + textB.length) % 101))
  }

  const prompt = `Estimate a numerical similarity score from 0 to 100 for these two descriptions:\n\nA: ${textA}\nB: ${textB}`
  const response = await client!.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
    max_output_tokens: 5
  })
  const raw = (response as any).output[0]?.content[0]?.text ?? ''
  const score = Number(raw.replace(/[^0-9]/g, ''))
  return Number.isNaN(score) ? 50 : Math.min(100, Math.max(0, score))
}

export async function aiSearchItems(query: string, filters?: { category?: string; location?: string; date?: string }) {
  const baseFilter = {
    OR: [
      { title: { contains: query, mode: 'insensitive' as any } },
      { description: { contains: query, mode: 'insensitive' as any } }
    ],
    category: filters?.category ? { equals: filters.category } : undefined,
    location: filters?.location ? { contains: filters.location, mode: 'insensitive' as any } : undefined
  } as any

  if (!process.env.OPENAI_API_KEY || !hasDb) {
    return sampleItems
      .filter(item => {
        const queryMatch = query
          ? item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase())
          : true
        const categoryMatch = filters?.category ? item.category === filters.category : true
        const locationMatch = filters?.location ? item.location.toLowerCase().includes(filters.location.toLowerCase()) : true
        return queryMatch && categoryMatch && locationMatch
      })
      .slice(0, 30)
  }

  const filterText = ['category', 'location', 'date']
    .filter(key => filters?.[key as keyof typeof filters])
    .map(key => `${key}: ${filters?.[key as keyof typeof filters]}`)
    .join('\n')

  const prompt = `Search the item database for lost and found posts matching this request.\n\nRequest: ${query}\n${filterText}\n\nReturn a JSON array of up to 15 item titles only.`
  const response = await client!.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
    max_output_tokens: 120
  })
  const text = (response as any).output[0]?.content[0]?.text ?? ''
  const keywords = text
    .replace(/\n/g, ' ')
    .replace(/\[|\]|"/g, '')
    .split(',')
    .map((part: string) => part.trim())
    .filter(Boolean) as string[]

  if (!keywords.length) {
    return prisma.item.findMany({
      where: baseFilter,
      orderBy: { createdAt: 'desc' },
      take: 30
    })
  }

  if (!hasDb) {
    return sampleItems
      .filter(item => keywords.some(keyword => item.title.toLowerCase().includes(keyword.toLowerCase()) || item.description.toLowerCase().includes(keyword.toLowerCase())))
      .slice(0, 30)
  }

  return prisma.item.findMany({
    where: {
      OR: [
        { title: { in: keywords, mode: 'insensitive' } },
        { description: { in: keywords, mode: 'insensitive' } }
      ],
      category: filters?.category ? { equals: filters.category } : undefined
    },
    orderBy: { createdAt: 'desc' },
    take: 30
  })
}

export async function findVisualMatches(imageLabels: string[], filters?: { category?: string; location?: string }) {
  if (!imageLabels.length) {
    return []
  }

  const normalizedLabels = Array.from(new Set(imageLabels.map(label => label.toLowerCase())))
  const queryText = normalizedLabels.join(' ')

  const items = !hasDb
    ? sampleItems.filter(item => {
        const metaText = `${item.title} ${item.description} ${item.category} ${item.imageLabels.join(' ')}`.toLowerCase()
        const matchesLabels = normalizedLabels.some(label => metaText.includes(label))
        const matchesLocation = filters?.location ? item.location.toLowerCase().includes(filters.location.toLowerCase()) : true
        const matchesCategory = filters?.category ? item.category === filters.category : true
        return matchesLabels && matchesLocation && matchesCategory
      })
    : await prisma.item.findMany({
        where: {
          OR: [
            { title: { contains: queryText, mode: 'insensitive' as any } },
            { description: { contains: queryText, mode: 'insensitive' as any } },
            { imageLabels: { hasSome: normalizedLabels } },
            { category: { in: normalizedLabels } }
          ],
          category: filters?.category ? { equals: filters.category } : undefined,
          location: filters?.location ? { contains: filters.location, mode: 'insensitive' as any } : undefined
        },
        include: { owner: true },
        orderBy: { createdAt: 'desc' },
        take: 50
      })

  const scored = await Promise.all(
    items.map(async item => {
      const overlap = item.imageLabels
        .map(label => label.toLowerCase())
        .filter(label => normalizedLabels.includes(label)).length
      const overlapScore = Math.min(100, overlap * 30)
      const textScore = await estimateMatchScore(queryText, `${item.title}. ${item.description}`)
      const matchScore = Math.max(overlapScore, textScore)
      return { ...item, matchScore }
    })
  )

  return scored.sort((a, b) => b.matchScore - a.matchScore)
}
