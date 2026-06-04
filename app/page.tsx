'use client'

import { useState } from 'react'
import { AppProvider } from '@/lib/app-context'
import { BottomNav, DesktopNav, type ScreenName } from '@/components/bottom-nav'
import { LoginScreen } from '@/components/screens/login-screen'
import { OnboardingScreen } from '@/components/screens/onboarding-screen'
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
import { PetRegistrationScreen } from '@/components/screens/pet-registration-screen'
import { SearchScreen } from '@/components/screens/search-screen'
import { EditProfileScreen } from '@/components/screens/edit-profile-screen'
import { EditPetScreen } from '@/components/screens/edit-pet-screen'

function PawsConnectApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('login')
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>(['login'])
  const [screenData, setScreenData] = useState<Record<string, unknown>>({})

  const navigateTo = (screen: ScreenName, data?: Record<string, unknown>) => {
    setScreenHistory((prev) => [...prev, screen])
    setCurrentScreen(screen)
    if (data) {
      setScreenData((prev) => ({ ...prev, ...data }))
    }
  }

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory]
      newHistory.pop()
      setScreenHistory(newHistory)
      setCurrentScreen(newHistory[newHistory.length - 1])
    }
  }

  // Screens without bottom nav
  const screensWithoutNav: ScreenName[] = ['login', 'onboarding', 'editProfile', 'editPet']
  const showBottomNav = !screensWithoutNav.includes(currentScreen)
  const isMapScreen = currentScreen === 'map'

  const renderScreen = () => {
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
          <OnboardingScreen
            onGetStarted={() => navigateTo('dashboard')}
            onLogin={() => navigateTo('login')}
          />
        )
      case 'dashboard':
        return <DashboardScreen onNavigate={navigateTo} />
      case 'map':
        return <MapScreen onNavigate={navigateTo} />
      case 'report':
        return <ReportScreen onNavigate={navigateTo} onBack={goBack} />
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
        return <ChatScreen onNavigate={navigateTo} onBack={goBack} />
      case 'notifications':
        return <NotificationsScreen onNavigate={navigateTo} onBack={goBack} />
      case 'shelters':
        return <SheltersScreen onNavigate={navigateTo} onBack={goBack} />
      case 'petRegistration':
        return <PetRegistrationScreen onNavigate={navigateTo} onBack={goBack} />
      case 'search':
        return <SearchScreen onNavigate={navigateTo} onBack={goBack} />
      case 'editProfile':
        return <EditProfileScreen onBack={goBack} />
      case 'editPet':
        return (
          <EditPetScreen
            petId={screenData.editPetId as string | undefined}
            onBack={goBack}
          />
        )
      default:
        return <DashboardScreen onNavigate={navigateTo} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {showBottomNav && (
        <DesktopNav activeTab={currentScreen} onNavigate={navigateTo} />
      )}
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
              : 'min-h-screen max-w-md mx-auto bg-background shadow-2xl'
          }
        >
          {renderScreen()}
        </div>
      </main>
      {showBottomNav && (
        <BottomNav activeTab={currentScreen} onNavigate={navigateTo} />
      )}
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
