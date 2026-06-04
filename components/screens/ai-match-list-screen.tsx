'use client'

import { ArrowLeft, Bot, ChevronRight } from 'lucide-react'
import { mockAIMatches } from '@/lib/mock-data'
import type { ScreenName } from '@/components/bottom-nav'

interface AIMatchListScreenProps {
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
  onBack: () => void
}

export function AIMatchListScreen({ onNavigate, onBack }: AIMatchListScreenProps) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-primary text-white'
    if (percentage >= 70) return 'bg-paws-alert text-white'
    return 'bg-muted-foreground text-white'
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold text-paws-dark">Coincidencias IA</h1>
          </div>
        </div>
      </div>

      {/* Match List */}
      <div className="p-4 space-y-3 stagger-children">
        {mockAIMatches.map((match) => (
          <button
            key={match.id}
            onClick={() => onNavigate('aiMatch', { matchId: match.id })}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-border hover:border-primary transition-all text-left"
          >
            <div className="flex items-center gap-4">
              {/* Pet Images */}
              <div className="relative flex-shrink-0">
                <img
                  src={match.lostPet.image}
                  alt={match.lostPet.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <img
                  src={match.foundPet.image}
                  alt="Found pet"
                  className="w-16 h-16 rounded-xl object-cover absolute -right-4 top-0 border-2 border-white"
                />
              </div>

              {/* Info */}
              <div className="flex-1 ml-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getMatchColor(match.matchPercentage)}`}>
                    {match.matchPercentage}% coincidencia
                  </span>
                </div>
                <p className="font-medium text-paws-dark">{match.lostPet.name}</p>
                <p className="text-sm text-muted-foreground">{match.lostPet.breed}</p>
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            {/* Match Features Preview */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {match.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full ${
                    feature.match 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-paws-alert/10 text-paws-alert'
                  }`}
                >
                  {feature.label}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-4 bg-paws-info/10 rounded-2xl">
        <div className="flex items-start gap-3">
          <Bot className="w-6 h-6 text-paws-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-paws-dark">Como funciona la IA?</p>
            <p className="text-sm text-muted-foreground mt-1">
              Nuestro sistema analiza caracteristicas visuales como color, tamaño, 
              raza y marcas distintivas para encontrar posibles coincidencias entre 
              mascotas perdidas y encontradas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
