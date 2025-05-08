'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type Message = {
  from: string
  message: string
  profileImg: string
}

const ChatPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [userId, setUserId] = useState<string>('') // Você pode setar com o nome do usuário autenticado

  useEffect(() => {
    const socketInstance: Socket = io('http://localhost:3001', {
      withCredentials: true
    })

    socketInstance.on('connect_error', (err) => {
      console.error('Erro de conexão:', err.message)
    })

    setSocket(socketInstance)

    socketInstance.on('private_message', (data: Message) => {
      setMessages((prev) => [...prev, data])
    })

    socketInstance.on('online_users', (userIds: string[]) => {
      setOnlineUsers(userIds)
    })

    socketInstance.on('set_userid', (name: string) => {
      setUserId(name)
    })
    
    socketInstance.on('connect', () => {
      console.log('✅ Conectado via Socket')
    })

    return () => {
      socketInstance.disconnect()
      socketInstance.off()
    }
  }, [])

  const sendPrivateMessage = () => {
    if (socket && message.trim()) {
      socket.emit('private_message', { message })
      setMessage('')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center text-neutral-800 dark:text-white">
          Chat Privado
        </h1>

        <p className="text-sm text-neutral-500 dark:text-neutral-300">
          Usuários online: {onlineUsers.length}
        </p>

        <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-neutral-50 dark:bg-neutral-700">
          <h2 className="text-sm text-neutral-500 dark:text-neutral-300 mb-2">Mensagens:</h2>
          {messages.length === 0 ? (
            <p className="text-neutral-400 text-sm italic">Nenhuma mensagem ainda.</p>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = msg.from === userId
              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 mb-3 ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex items-center ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    <Image
                      src={msg.profileImg}
                      alt={`Foto de perfil de ${msg.from}`}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className={`text-sm font-semibold ${isOwnMessage ? 'text-blue-600' : 'text-neutral-700'} dark:text-white`}>
                        {msg.from}
                      </p>
                      <p className={`text-sm ${isOwnMessage ? 'text-blue-600' : 'text-neutral-600'} dark:text-neutral-300`}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem"
            className="flex-1 px-3 py-2 border rounded-lg text-sm bg-neutral-50 dark:bg-neutral-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendPrivateMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
