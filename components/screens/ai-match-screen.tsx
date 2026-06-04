'use client'

import { ArrowLeft, Check, X, AlertTriangle, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockAIMatches } from '@/lib/mock-data'
import type { ScreenName } from '@/components/bottom-nav'

interface AIMatchScreenProps {
  matchId?: string
  onNavigate: (screen: ScreenName, data?: Record<string, unknown>) => void
  onBack: () => void
}

export function AIMatchScreen({ matchId, onNavigate, onBack }: AIMatchScreenProps) {
  const match = mockAIMatches.find((m) => m.id === matchId) || mockAIMatches[0]

  const handleConfirm = () => {
    alert('Coincidencia confirmada! El dueño sera notificado.')
    onNavigate('dashboard')
  }

  const handleDiscard = () => {
    onBack()
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-secondary rounded-full">
            <ArrowLeft className="w-6 h-6 text-paws-dark" />
          </button>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold text-paws-dark">Coincidencia IA</h1>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      <div className="mx-4 mt-4 p-4 bg-primary/20 rounded-2xl border border-primary/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-primary">Posible coincidencia encontrada!</p>
            <p className="text-sm text-paws-primary-dark">{match.matchPercentage}% de similitud</p>
          </div>
        </div>
      </div>

      {/* Pet Comparison */}
      <div className="px-4 mt-6">
        <div className="flex gap-3">
          {/* Lost Pet */}
          <div className="flex-1">
            <div className="relative">
              <img
                src={match.lostPet.image}
                alt={match.lostPet.name}
                className="w-full h-40 object-cover rounded-2xl"
              />
              <span className="absolute top-2 left-2 px-2 py-1 bg-paws-urgent text-white text-xs font-semibold rounded-full">
                Perdida
              </span>
            </div>
            <p className="font-medium text-paws-dark mt-2 text-center">{match.lostPet.name}</p>
            <p className="text-sm text-muted-foreground text-center">{match.lostPet.breed}</p>
          </div>

          {/* Match Indicator */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-white font-bold text-sm">{match.matchPercentage}%</span>
            </div>
          </div>

          {/* Found Pet */}
          <div className="flex-1">
            <div className="relative">
              <img
                src={match.foundPet.image}
                alt="Found pet"
                className="w-full h-40 object-cover rounded-2xl"
              />
              <span className="absolute top-2 right-2 px-2 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                Encontrada
              </span>
            </div>
            <p className="font-medium text-paws-dark mt-2 text-center">Mascota encontrada</p>
            <p className="text-sm text-muted-foreground text-center">{match.lostPet.createdAt}</p>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-paws-dark">Nivel de coincidencia</span>
            <span className="text-sm font-semibold text-primary">{match.matchPercentage}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${match.matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Detected Features */}
        <div className="mt-6">
          <h3 className="font-semibold text-paws-dark mb-4">Caracteristicas detectadas</h3>
          <div className="space-y-3">
            {match.features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  feature.match ? 'bg-primary/10' : 'bg-paws-alert/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  feature.match ? 'bg-primary' : 'bg-paws-alert'
                }`}>
                  {feature.match ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${feature.match ? 'text-paws-primary-dark' : 'text-paws-alert'}`}>
                    {feature.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{feature.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-border flex gap-3">
        <Button
          onClick={handleConfirm}
          className="flex-1 h-12 rounded-xl bg-primary hover:bg-paws-primary-dark text-white font-semibold"
        >
          <Check className="w-5 h-5 mr-2" />
          Confirmar coincidencia
        </Button>
        <Button
          onClick={handleDiscard}
          variant="outline"
          className="flex-1 h-12 rounded-xl border-border text-muted-foreground hover:bg-secondary font-semibold"
        >
          <X className="w-5 h-5 mr-2" />
          Descartar
        </Button>
      </div>
    </div>
  )
}
