import { NextApiRequest, NextApiResponse } from 'next'
import { Server as IOServer } from 'socket.io'
import { prisma } from '@/lib/prisma'

export const config = {
  api: {
    bodyParser: false
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const resAny = res as any
  const socketServer = (res.socket as any)?.server

  if (!socketServer) {
    res.statusCode = 500
    res.end('Socket server unavailable')
    return
  }

  if (!socketServer.io) {
    const io = new IOServer(socketServer, {
      path: '/api/socketio',
      cors: {
        origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    })

    io.on('connection', socket => {
      const userId = socket.handshake.auth?.userId as string | undefined
      if (!userId) {
        socket.disconnect(true)
        return
      }

      socket.join(userId)
      socket.emit('connected', { userId })

      socket.on('send-message', async (payload: { toId: string; content: string; itemId?: string }) => {
        const { toId, content, itemId } = payload
        if (!toId || !content) return

        try {
          const message = await prisma.message.create({
            data: {
              fromId: userId,
              toId,
              itemId: itemId || undefined,
              content
            }
          })

          io.to(toId).emit('incoming-message', message)
          io.to(userId).emit('incoming-message', message)
        } catch (error) {
          socket.emit('error', { message: 'Could not save chat message.' })
        }
      })
    })

    socketServer.io = io


    resAny.socket.server.io = io
  }

  res.end()
}
