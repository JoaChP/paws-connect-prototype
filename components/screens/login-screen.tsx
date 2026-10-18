'use client'
import { useState } from 'react'
import { PawPrint, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useApp } from '@/lib/app-context'

export function LoginScreen({
  onLogin,
  onRegister,
  register = false,
}: {
  onLogin: () => void
  onRegister: () => void
  register?: boolean
}) {
  const { authenticate, configured } = useApp()
  const [email, setEmail] = useState(''),
    [name, setName] = useState(''),
    [password, setPassword] = useState('')
  const [show, setShow] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState('')
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      await authenticate(register ? 'register' : 'login', email, password, name)
      onLogin()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos iniciar sesión')
    } finally {
      setPending(false)
    }
  }
  return (
    <div className="min-h-screen grid place-items-center bg-[#f4f7f2] p-6">
      <div className="w-full max-w-md">
        <button
          onClick={onLogin}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft size={16} /> Explorar reportes
        </button>
        <div className="rounded-3xl border border-border bg-white p-7 shadow-sm sm:p-10">
          <div className="mb-7 flex items-center gap-3">
            <span className="rounded-2xl bg-primary p-3 text-white">
              <PawPrint size={25} />
            </span>
            <span className="text-xl font-bold">
              PawsConnect
              <span className="block text-xs font-normal text-muted-foreground">
                Cada encuentro empieza con una comunidad.
              </span>
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {register ? 'Súmate a la comunidad' : 'Qué bueno verte de nuevo'}
          </h1>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">
            {register
              ? 'Crea tu cuenta para reportar y ayudar a reunir familias.'
              : 'Inicia sesión para cuidar de quienes más quieres.'}
          </p>
          <form onSubmit={submit} className="space-y-4">
            {register && (
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">
                  Nombre
                </label>
                <Input
                  id="name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete={register ? 'new-password' : 'current-password'}
                  required
                  minLength={10}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12"
                />
                <button
                  type="button"
                  aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-2.5"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Al menos 10 caracteres.</p>
            </div>
            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                {error}
              </p>
            )}
            {!configured && (
              <p className="text-sm text-amber-800">
                El registro estará disponible al conectar la base de datos.
              </p>
            )}
            <Button
              type="submit"
              disabled={pending || !configured}
              className="h-12 w-full rounded-xl"
            >
              {pending ? 'Conectando…' : register ? 'Crear mi cuenta' : 'Iniciar sesión'}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {register ? '¿Ya tienes cuenta?' : '¿Primera vez por aquí?'}{' '}
            <button onClick={onRegister} className="font-semibold text-primary">
              {register ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </p>
        </div>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={16} /> Una comunidad que conecta personas y mascotas.
        </p>
      </div>
    </div>
  )
}
