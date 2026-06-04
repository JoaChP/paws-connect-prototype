'use client'

import { useState } from 'react'
import { PawPrint, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LoginScreenProps {
  onLogin: () => void
  onRegister: () => void
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
          <PawPrint className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-paws-dark">PawsConnect</h1>
        <p className="text-muted-foreground text-sm mt-1">Encuentra a tu mascota</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-4 stagger-children">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 rounded-xl border-border"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 h-12 rounded-xl border-border"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Eye className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        <button className="text-sm text-primary hover:underline w-full text-right">
          ¿Olvidaste tu contraseña?
        </button>

        <Button 
          onClick={onLogin} 
          className="w-full h-12 rounded-xl bg-primary hover:bg-paws-primary-dark text-white font-semibold text-base"
        >
          Iniciar Sesión
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center w-full max-w-sm my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="px-4 text-sm text-muted-foreground">o continúa con</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Social Login */}
      <div className="w-full max-w-sm space-y-3">
        <Button 
          variant="outline" 
          className="w-full h-12 rounded-xl border-border font-medium"
          onClick={onLogin}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuar con Google
        </Button>

        <Button 
          className="w-full h-12 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium"
          onClick={onLogin}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continuar con Facebook
        </Button>
      </div>

      {/* Register Link */}
      <p className="mt-8 text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <button onClick={onRegister} className="text-primary font-semibold hover:underline">
          Regístrate
        </button>
      </p>
    </div>
  )
}
