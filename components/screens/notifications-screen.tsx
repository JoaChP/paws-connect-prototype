'use client'

import { ArrowLeft, Bot, MapPin, MessageCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { mockNotifications } from '@/lib/mock-data'
import type { ScreenName } from '@/components/bottom-nav'

interface NotificationsScreenProps {
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
  onBack: () => void
}

export function NotificationsScreen({ onNavigate, onBack }: NotificationsScreenProps) {
  const todayNotifications = mockNotifications.slice(0, 3)
  const yesterdayNotifications = mockNotifications.slice(3)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ai_match':
        return <Bot className="w-5 h-5 text-white" />
      case 'sighting':
        return <MapPin className="w-5 h-5 text-white" />
      case 'message':
        return <MessageCircle className="w-5 h-5 text-white" />
      case 'confirmation':
        return <CheckCircle className="w-5 h-5 text-white" />
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-white" />
      default:
        return null
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ai_match':
        return 'bg-primary'
      case 'sighting':
        return 'bg-paws-info'
      case 'message':
        return 'bg-muted-foreground'
      case 'confirmation':
        return 'bg-primary'
      case 'alert':
        return 'bg-paws-alert'
      default:
        return 'bg-muted-foreground'
    }
  }

  const handleNotificationClick = (notification: typeof mockNotifications[0]) => {
    switch (notification.type) {
      case 'ai_match':
        onNavigate('aiMatchList')
        break
      case 'sighting':
        onNavigate('map')
        break
      case 'message':
        onNavigate('chat')
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <h1 className="text-xl font-semibold text-paws-dark">Notificaciones</h1>
        </div>
      </div>

      {/* Today Section */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Hoy</h3>
        <div className="space-y-3">
          {todayNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border text-left transition-colors ${
                notification.read ? 'border-border' : 'border-primary bg-primary/5'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-medium text-paws-dark ${!notification.read && 'font-semibold'}`}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
                {notification.description && (
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Yesterday Section */}
      <div className="px-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Ayer</h3>
        <div className="space-y-3">
          {yesterdayNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className="w-full flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-border text-left"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-paws-dark">{notification.title}</p>
                {notification.description && (
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
