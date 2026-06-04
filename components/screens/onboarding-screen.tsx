'use client'

import { PawPrint, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OnboardingScreenProps {
  onGetStarted: () => void
  onLogin: () => void
}

export function OnboardingScreen({ onGetStarted, onLogin }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Hero Image with Gradient Overlay */}
      <div className="relative h-[55vh] w-full">
        <img
          src="https://picsum.photos/seed/pawshero/800/1000"
          alt="Pet hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/50 to-white" />
        
        {/* Floating Logo */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce-in">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <PawPrint className="w-12 h-12 text-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10 -mt-10 bg-white rounded-t-[2rem] relative z-10">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-paws-dark">PawsConnect</h1>
          <p className="text-xl font-semibold text-primary">Encuentra a tu mascota</p>
          <p className="text-muted-foreground text-base max-w-xs mx-auto leading-relaxed">
            Plataforma colaborativa con IA para recuperar mascotas perdidas en Costa Rica y Latinoamérica
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-sm mt-10 space-y-4">
          <Button 
            onClick={onGetStarted} 
            className="w-full h-14 rounded-2xl bg-primary hover:bg-paws-primary-dark text-white font-semibold text-lg shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Comenzar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <button 
            onClick={onLogin}
            className="w-full text-center text-primary font-medium hover:underline py-2"
          >
            Ya tengo cuenta
          </button>
        </div>

        {/* Decorative Paw Prints */}
        <div className="absolute bottom-4 left-4 opacity-10">
          <PawPrint className="w-8 h-8 text-primary rotate-[-20deg]" />
        </div>
        <div className="absolute bottom-12 right-6 opacity-10">
          <PawPrint className="w-6 h-6 text-primary rotate-[15deg]" />
        </div>
      </div>
    </div>
  )
}
