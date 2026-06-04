'use client'

import { useState } from 'react'
import { Filter, Heart, MessageCircle, Share2, AlertTriangle, PartyPopper, PawPrint } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import type { ScreenName } from '@/components/bottom-nav'

interface CommunityScreenProps {
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
}

type FilterType = 'todos' | 'perdidos' | 'encontrados' | 'adopcion'

export function CommunityScreen({ onNavigate }: CommunityScreenProps) {
  const { posts, toggleLike } = useApp()
  const [filter, setFilter] = useState<FilterType>('todos')

  const filters: { id: FilterType; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'perdidos', label: 'Perdidos' },
    { id: 'encontrados', label: 'Encontrados' },
    { id: 'adopcion', label: 'Adopcion' },
  ]

  const filteredPosts = posts.filter((post) => {
    if (filter === 'todos') return true
    if (filter === 'perdidos') return post.type === 'lost'
    if (filter === 'encontrados') return post.type === 'found'
    if (filter === 'adopcion') return post.type === 'adoption'
    return true
  })

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'lost':
        return <AlertTriangle className="w-4 h-4" />
      case 'found':
        return <PartyPopper className="w-4 h-4" />
      case 'adoption':
        return <PawPrint className="w-4 h-4" />
      default:
        return null
    }
  }

  const getPostBadge = (type: string) => {
    switch (type) {
      case 'lost':
        return null
      case 'found':
        return (
          <span className="px-2 py-1 bg-primary text-white text-xs font-semibold rounded-full">
            ENCONTRADA
          </span>
        )
      case 'adoption':
        return (
          <span className="px-2 py-1 bg-paws-info text-white text-xs font-semibold rounded-full">
            ADOPCION
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-paws-dark">Comunidad PawsConnect</h1>
          <button className="p-2 hover:bg-secondary rounded-full">
            <Filter className="w-5 h-5 text-paws-dark" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.id
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="p-4 space-y-4 stagger-children">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border"
          >
            {/* Author */}
            <div className="p-4 flex items-center gap-3">
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-paws-dark">{post.userName}</p>
                <p className="text-xs text-muted-foreground">
                  {post.createdAt}
                </p>
              </div>
              {getPostBadge(post.type)}
            </div>

            {/* Image */}
            <img
              src={post.petImage || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'}
              alt={post.petName || 'mascota'}
              className="w-full h-52 object-cover cursor-pointer"
              onClick={() => post.petId && onNavigate('petDetail', { petId: post.petId })}
            />

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <span className={`mt-1 ${
                  post.type === 'lost' ? 'text-paws-urgent' : 
                  post.type === 'found' ? 'text-primary' : 'text-paws-info'
                }`}>
                  {getPostIcon(post.type)}
                </span>
                <h3 className="font-semibold text-paws-dark">{post.petName || 'Mascota'}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-paws-urgent transition-colors"
                >
                  <Heart className={`w-5 h-5 ${post.liked ? 'fill-paws-urgent text-paws-urgent' : ''}`} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-paws-info transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ml-auto">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Compartir</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
