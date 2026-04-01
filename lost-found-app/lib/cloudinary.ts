import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export async function uploadImage(base64: string) {
  const result = await cloudinary.uploader.upload(base64, {
    folder: 'lost-found-bd',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }]
  })
  return {
    url: result.secure_url,
    publicId: result.public_id
  }
}
