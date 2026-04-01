'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession, signIn } from 'next-auth/react'

interface Message {
  id: string
  content: string
  fromId: string
  toId: string
  createdAt: string
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [target, setTarget] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('')
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const targetRef = useRef(target)

  useEffect(() => {
    targetRef.current = target
  }, [target])

  useEffect(() => {
    if (!session?.user?.id) return

    const socket = io({
      path: '/api/socketio',
      auth: { userId: session.user.id }
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      setStatus('Connected to chat server.')
    })

    socket.on('disconnect', () => {
      setConnected(false)
      setStatus('Disconnected from chat server.')
    })

    socket.on('connected', () => {
      setStatus('Ready to chat.')
    })

    socket.on('incoming-message', (message: Message) => {
      const currentTarget = targetRef.current
      if (!currentTarget) return
      if (message.fromId !== currentTarget && message.toId !== currentTarget) return
      setMessages(prevMessages => {
        if (prevMessages.some(msg => msg.id === message.id)) return prevMessages
        return [...prevMessages, message]
      })
    })

    socket.on('error', (error: { message: string }) => {
      setStatus(error.message)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connected')
      socket.off('incoming-message')
      socket.off('error')
      socket.disconnect()
      socketRef.current = null
    }
  }, [session?.user?.id])

  const loadConversation = async () => {
    if (!target) return
    setStatus('Loading messages...')
    const response = await fetch(`/api/chat?target=${encodeURIComponent(target)}`)
    const data = await response.json()
    setMessages(data ?? [])
    setStatus(connected ? 'Conversation loaded.' : 'Conversation loaded. Connect to chat to send messages.')
  }

  const sendMessage = async () => {
    if (!content || !target) return
    setStatus('Sending message...')

    if (socketRef.current?.connected) {
      socketRef.current.emit('send-message', { toId: target, content })
      setContent('')
      return
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toId: target, content })
    })

    if (!response.ok) {
      setStatus('Unable to send message.')
      return
    }

    setContent('')
    await loadConversation()
  }

  const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 shadow-xl ring-1 ring-slate-200 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Chat with the community</h1>
          <p className="mt-4 text-slate-600">Sign in to send messages and connect around items.</p>
          <button
            onClick={() => void signIn('google')}
            disabled={!googleEnabled}
            className="mt-8 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Sign in with Google
          </button>
          {!googleEnabled ? (
            <p className="mt-4 text-sm text-slate-500">Google login is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local.</p>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h1 className="text-3xl font-semibold text-slate-900">Real-time chat</h1>
          <p className="mt-3 text-slate-600">Enter a user ID to view a conversation thread and send messages.</p>
          <p className="mt-2 text-sm text-slate-500">Connected: {connected ? 'yes' : 'no'}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
            <input value={target} onChange={e => setTarget(e.target.value)} placeholder="Target user ID" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <button onClick={loadConversation} className="rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Load chat
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Conversation</h2>
          <div className="mt-6 space-y-4">
            {status ? <p className="text-sm text-slate-500">{status}</p> : null}
            {messages.length ? (
              messages.map(message => (
                <div key={message.id} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{message.fromId === session.user.id ? 'You' : 'Partner'} • {new Date(message.createdAt).toLocaleString()}</p>
                  <p className="mt-2 text-slate-700">{message.content}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">No messages yet. Enter a target user ID above to begin.</div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Write your message..." />
            <button onClick={sendMessage} className="rounded-3xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
