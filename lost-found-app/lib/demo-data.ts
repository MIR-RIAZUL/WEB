export const sampleItems = [
  {
    id: 'demo-1',
    title: 'Red school bag',
    description: 'A red school bag with a small blue tag, lost near Dhaka University.',
    category: 'Accessories',
    location: 'Dhaka University',
    latitude: 23.7393,
    longitude: 90.3917,
    date: '2026-03-22T00:00:00.000Z',
    imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'],
    imageLabels: ['bag', 'school', 'red', 'backpack'],
    status: 'LOST',
    reward: 500,
    createdAt: '2026-03-22T12:00:00.000Z',
    updatedAt: '2026-03-22T12:00:00.000Z',
    owner: {
      id: 'demo-user-1',
      name: 'Ayesha Rahman',
      email: 'user@lostfoundbd.com'
    }
  },
  {
    id: 'demo-2',
    title: 'Black smartphone',
    description: 'A black smartphone found near Gulshan Park with a cracked screen.',
    category: 'Electronics',
    location: 'Gulshan-1',
    latitude: 23.7947,
    longitude: 90.4078,
    date: '2026-03-18T00:00:00.000Z',
    imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1/sample.jpg'],
    imageLabels: ['phone', 'black', 'smartphone'],
    status: 'FOUND',
    reward: 0,
    createdAt: '2026-03-18T09:00:00.000Z',
    updatedAt: '2026-03-18T09:00:00.000Z',
    owner: {
      id: 'demo-user-2',
      name: 'Admin User',
      email: 'admin@lostfoundbd.com'
    }
  }
]
