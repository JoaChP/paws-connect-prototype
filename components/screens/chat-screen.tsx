'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Send, Image, MapPin } from 'lucide-react'
import { mockChatMessages } from '@/lib/mock-data'
import type { ScreenName } from '@/components/bottom-nav'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

interface ChatScreenProps {
  onNavigate: (screen: ScreenName) => void
  onBack: () => void
}

export function ChatScreen({ onNavigate, onBack }: ChatScreenProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(mockChatMessages)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSend = () => {
    if (!message.trim()) return
    
    setMessages([
      ...messages,
      {
        id: String(messages.length + 1),
        sender: 'me',
        content: message,
        time: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      },
    ])
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://picsum.photos/seed/carlos/100/100"
                alt="Carlos M."
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="font-semibold text-paws-dark">Carlos M.</p>
              <p className="text-xs text-primary">En linea</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === 'me'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-white text-paws-dark rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.type === 'location' && msg.location ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className={`w-4 h-4 ${msg.sender === 'me' ? 'text-white/80' : 'text-muted-foreground'}`} />
                    <span>Ubicacion compartida</span>
                  </div>
                  <div className="h-32 rounded-xl overflow-hidden border border-white/20">
                    {isClient && (
                      <MapContainer
                        center={[msg.location.lat, msg.location.lng]}
                        zoom={15}
                        className="h-full w-full"
                        zoomControl={false}
                        dragging={false}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[msg.location.lat, msg.location.lng]} />
                      </MapContainer>
                    )}
                  </div>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
              <p className={`text-xs mt-1 ${
                msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-border p-4 pb-safe">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-secondary rounded-full">
            <Image className="w-6 h-6 text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe un mensaje..."
              className="w-full px-4 py-3 bg-secondary rounded-full outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button 
            onClick={handleSend}
            className="p-3 bg-primary rounded-full hover:bg-paws-primary-dark transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
