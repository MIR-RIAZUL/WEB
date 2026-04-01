export async function detectImageLabels(imageUrl: string) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY
  if (!apiKey) {
    return ['photo', 'object', 'unknown']
  }

  const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          image: { source: { imageUri: imageUrl } },
          features: [{ type: 'LABEL_DETECTION', maxResults: 10 }]
        }
      ]
    })
  })

  if (!response.ok) return ['photo', 'object']

  const data = await response.json()
  const labels = data.responses?.[0]?.labelAnnotations ?? []
  return labels.map((item: any) => item.description).slice(0, 8)
}
