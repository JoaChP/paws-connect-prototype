'use client'

import { useState, useEffect } from 'react'
import { AppProvider, useApp } from '@/lib/app-context'
import { BottomNav, DesktopNav, type ScreenName } from '@/components/bottom-nav'
import { LoginScreen } from '@/components/screens/login-screen'
import { DashboardScreen } from '@/components/screens/dashboard-screen'
import { MapScreen } from '@/components/screens/map-screen'
import { ReportScreen } from '@/components/screens/report-screen'
import { CommunityScreen } from '@/components/screens/community-screen'
import { ProfileScreen } from '@/components/screens/profile-screen'
import { PetDetailScreen } from '@/components/screens/pet-detail-screen'
import { AIMatchScreen } from '@/components/screens/ai-match-screen'
import { AIMatchListScreen } from '@/components/screens/ai-match-list-screen'
import { ChatScreen } from '@/components/screens/chat-screen'
import { NotificationsScreen } from '@/components/screens/notifications-screen'
import { SheltersScreen } from '@/components/screens/shelters-screen'
import { SearchScreen } from '@/components/screens/search-screen'
import { EditProfileScreen } from '@/components/screens/edit-profile-screen'
import { EditPetScreen } from '@/components/screens/edit-pet-screen'

function PawsConnectApp() {
  const { loading, error, refresh, configured, authenticated, demo } = useApp()
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard')
  const [screenData, setScreenData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const load = () => {
      const query = new URLSearchParams(window.location.search)
      const allowed = [
        'dashboard',
        'map',
        'report',
        'community',
        'profile',
        'petDetail',
        'aiMatch',
        'aiMatchList',
        'chat',
        'notifications',
        'shelters',
        'petRegistration',
        'search',
        'editProfile',
        'editPet',
        'login',
        'onboarding',
      ]
      const screen = query.get('screen') || 'dashboard'
      setCurrentScreen(allowed.includes(screen) ? (screen as ScreenName) : 'dashboard')
      setScreenData(Object.fromEntries(query.entries()))
    }
    load()
    window.addEventListener('popstate', load)
    return () => window.removeEventListener('popstate', load)
  }, [])
  const navigateTo = (screen: ScreenName, data?: Record<string, unknown>) => {
    if (
      !authenticated &&
      ['report', 'profile', 'editProfile', 'editPet', 'petRegistration', 'notifications'].includes(
        screen,
      )
    )
      screen = 'login'
    const url = new URL(window.location.href)
    url.search = new URLSearchParams({
      ...(demo ? { demo: '1' } : {}),
      screen,
      ...Object.fromEntries(Object.entries(data ?? {}).map(([k, v]) => [k, String(v)])),
    }).toString()
    window.history.pushState({}, '', url)

    setCurrentScreen(screen)
    setScreenData(data ?? {})
  }

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    navigateTo('dashboard')
  }

  // Screens without bottom nav
  const screensWithoutNav: ScreenName[] = ['login', 'onboarding', 'editProfile', 'editPet']
  const showBottomNav = !screensWithoutNav.includes(currentScreen)
  const isMapScreen = currentScreen === 'map'

  const renderScreen = () => {
    if (
      !authenticated &&
      ['report', 'profile', 'editProfile', 'editPet', 'petRegistration', 'notifications'].includes(
        currentScreen,
      )
    )
      return (
        <LoginScreen
          onLogin={() => navigateTo('dashboard')}
          onRegister={() => navigateTo('onboarding')}
        />
      )
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onLogin={() => navigateTo('dashboard')}
            onRegister={() => navigateTo('onboarding')}
          />
        )
      case 'onboarding':
        return (
          <LoginScreen
            register
            onLogin={() => navigateTo('dashboard')}
            onRegister={() => navigateTo('login')}
          />
        )
      case 'dashboard':
        return <DashboardScreen onNavigate={navigateTo} />
      case 'map':
        return <MapScreen onNavigate={navigateTo} />
      case 'report':
        return (
          <ReportScreen
            key={(screenData.editReportId as string) || 'new'}
            petId={screenData.editReportId as string}
            onNavigate={navigateTo}
            onBack={goBack}
          />
        )
      case 'community':
        return <CommunityScreen onNavigate={navigateTo} />
      case 'profile':
        return <ProfileScreen onNavigate={navigateTo} />
      case 'petDetail':
        return (
          <PetDetailScreen
            petId={screenData.petId as string}
            onNavigate={navigateTo}
            onBack={goBack}
          />
        )
      case 'aiMatch':
        return (
          <AIMatchScreen
            matchId={screenData.matchId as string}
            onNavigate={navigateTo}
            onBack={goBack}
          />
        )
      case 'aiMatchList':
        return <AIMatchListScreen onNavigate={navigateTo} onBack={goBack} />
      case 'chat':
        return (
          <ChatScreen
            reportId={screenData.petId as string}
            onNavigate={navigateTo}
            onBack={goBack}
          />
        )
      case 'notifications':
        return <NotificationsScreen onNavigate={navigateTo} onBack={goBack} />
      case 'shelters':
        return <SheltersScreen onNavigate={navigateTo} onBack={goBack} />
      case 'petRegistration':
        return <EditPetScreen onBack={goBack} />
      case 'search':
        return <SearchScreen onNavigate={navigateTo} onBack={goBack} />
      case 'editProfile':
        return <EditProfileScreen onBack={goBack} />
      case 'editPet':
        return <EditPetScreen petId={screenData.petId as string | undefined} onBack={goBack} />
      default:
        return <DashboardScreen onNavigate={navigateTo} />
    }
  }

  if (loading)
    return (
      <main className="grid min-h-screen place-items-center">
        <p role="status">Cargando PawsConnect…</p>
      </main>
    )
  if (error)
    return (
      <main className="grid min-h-screen place-items-center p-8">
        <div role="alert">
          <h1 className="text-xl font-bold">No pudimos cargar los reportes</h1>
          <p className="my-3">{error}</p>
          <button
            className="rounded-xl bg-primary px-5 py-3 text-white"
            onClick={() => void refresh().catch(() => {})}
          >
            Reintentar
          </button>
        </div>
      </main>
    )
  return (
    <div className="min-h-screen bg-background">
      {!configured && (
        <p className="relative z-50 bg-amber-100 p-3 text-center text-sm text-amber-950 md:ml-72">
          Demostración de solo lectura · Los reportes son ficticios.{' '}
          {demo && (
            <a href="/" className="ml-3 underline">
              Salir de la demostración
            </a>
          )}
        </p>
      )}

      {showBottomNav && <DesktopNav activeTab={currentScreen} onNavigate={navigateTo} />}
      <main
        className={
          showBottomNav
            ? `min-h-screen md:pl-72 ${isMapScreen ? '' : 'md:px-8 md:py-8'}`
            : 'min-h-screen'
        }
      >
        <div
          className={
            showBottomNav
              ? isMapScreen
                ? 'min-h-screen max-w-md mx-auto bg-background shadow-2xl md:max-w-none md:shadow-none'
                : 'min-h-screen max-w-md mx-auto bg-background shadow-2xl md:max-w-6xl md:rounded-2xl md:shadow-sm md:border md:border-border md:overflow-hidden'
              : 'min-h-screen w-full bg-background'
          }
        >
          {renderScreen()}
        </div>
      </main>
      {showBottomNav && <BottomNav activeTab={currentScreen} onNavigate={navigateTo} />}
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <PawsConnectApp />
    </AppProvider>
  )
}
