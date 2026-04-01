import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'
import { detectImageLabels } from '@/lib/vision'
import { findVisualMatches } from '@/lib/openai'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { imageUrl, imageBase64, category, location } = body

  if (!imageUrl && !imageBase64) {
    return NextResponse.json({ error: 'imageUrl or imageBase64 is required' }, { status: 400 })
  }

  let sourceUrl = imageUrl

  if (!sourceUrl && imageBase64) {
    try {
      const upload = await uploadImage(imageBase64)
      sourceUrl = upload.url
    } catch (error) {
      return NextResponse.json(
        { error: 'Could not upload image', details: String(error) },
        { status: 500 }
      )
    }
  }

  if (!sourceUrl) {
    return NextResponse.json({ error: 'Unable to resolve image URL' }, { status: 400 })
  }

  const labels = await detectImageLabels(sourceUrl)
  const matches = await findVisualMatches(labels, { category, location })

  return NextResponse.json({ imageUrl: sourceUrl, labels, matches })
}
