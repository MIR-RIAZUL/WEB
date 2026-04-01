import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lostfoundbd.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@lostfoundbd.com',
      role: 'admin',
      verified: true,
      reputation: 100
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@lostfoundbd.com' },
    update: {},
    create: {
      name: 'Ayesha Rahman',
      email: 'user@lostfoundbd.com',
      verified: true,
      reputation: 42,
      nid: '1987654321'
    }
  })

  await prisma.item.createMany({
    data: [
      {
        title: 'Red school bag',
        description: 'Lost near Dhaka University gate after evening class.',
        category: 'Accessories',
        location: 'Dhaka University',
        latitude: 23.7320,
        longitude: 90.3932,
        date: new Date('2026-03-28').toISOString(),
        imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'],
        imageLabels: ['school bag', 'backpack', 'red', 'student', 'book bag'],
        status: 'LOST',
        reward: 500,
        ownerId: user.id
      },
      {
        title: 'Black smartphone',
        description: 'Found on a bus to Gulshan. Screen protector with a sticker.',
        category: 'Electronics',
        location: 'Gulshan-1',
        latitude: 23.7925,
        longitude: 90.4077,
        date: new Date('2026-03-29').toISOString(),
        imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'],
        imageLabels: ['smartphone', 'phone', 'mobile', 'black', 'screen'],
        status: 'FOUND',
        reward: 0,
        ownerId: admin.id
      }
    ]
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
