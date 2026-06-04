"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type PetStatus = "lost" | "found" | "shelter"

export interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
}

export interface Pet {
  id: string
  name: string
  species: "dog" | "cat" | "other"
  breed: string
  color: string
  size: "small" | "medium" | "large"
  age: string
  gender: "male" | "female" | "unknown"
  status: PetStatus
  description: string
  location: string
  lat: number
  lng: number
  image: string
  reportedBy: string
  reportedAt: string
  caseNumber?: string
  lastSeen?: string
  contactPhone?: string
  contactEmail?: string
  microchip?: string
  collar?: string
  reward?: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  location: string
  bio: string
  petsCount: number
  reportsCount: number
  points: number
  badge: string
  joinedAt: string
}

export interface RegisteredPet {
  id: string
  name: string
  species: "dog" | "cat" | "other"
  breed: string
  age: string
  image: string
  microchip?: string
}

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  petId?: string
  petName?: string
  petImage?: string
  type: "lost" | "found" | "tip" | "success"
  content: string
  location: string
  likes: number
  comments: number
  liked: boolean
  createdAt: string
}

export interface Notification {
  id: string
  type: "match" | "sighting" | "message" | "alert"
  title: string
  message: string
  image?: string
  read: boolean
  createdAt: string
}

export interface Activity {
  id: string
  type: "report" | "found" | "helped"
  description: string
  date: string
}

interface AppContextType {
  // User
  user: UserProfile
  updateUser: (updates: Partial<UserProfile>) => void
  
  // Pets (reports)
  pets: Pet[]
  addPet: (pet: Omit<Pet, "id" | "reportedAt">) => Pet
  updatePet: (id: string, updates: Partial<Pet>) => void
  deletePet: (id: string) => void
  
  // Registered pets (user's own pets)
  registeredPets: RegisteredPet[]
  addRegisteredPet: (pet: Omit<RegisteredPet, "id">) => void
  updateRegisteredPet: (id: string, updates: Partial<RegisteredPet>) => void
  deleteRegisteredPet: (id: string) => void
  
  // Community
  posts: CommunityPost[]
  addPost: (post: Omit<CommunityPost, "id" | "createdAt" | "likes" | "comments" | "liked">) => void
  toggleLike: (postId: string) => void
  
  // Notifications
  notifications: Notification[]
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  
  // Activities
  activities: Activity[]
  addActivity: (activity: Omit<Activity, "id">) => void

  // Location
  userLocation: UserLocation | null
  setUserLocation: (location: UserLocation | null) => void
  isLocating: boolean
  locationError: string | null
  requestUserLocation: () => Promise<UserLocation | null>
  
  // Filters
  statusFilter: PetStatus | "all"
  setStatusFilter: (filter: PetStatus | "all") => void
  speciesFilter: "dog" | "cat" | "other" | "all"
  setSpeciesFilter: (filter: "dog" | "cat" | "other" | "all") => void
  colorFilter: string | "all"
  setColorFilter: (filter: string | "all") => void
  sizeFilter: "small" | "medium" | "large" | "all"
  setSizeFilter: (filter: "small" | "medium" | "large" | "all") => void
  radiusFilter: number
  setRadiusFilter: (filter: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Filtered data
  filteredPets: Pet[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Initial mock data
const initialPets: Pet[] = [
  {
    id: "1",
    name: "Luna",
    species: "dog",
    breed: "Golden Retriever",
    color: "Dorado",
    size: "large",
    age: "3 años",
    gender: "female",
    status: "lost",
    description: "Luna es muy cariñosa, tiene un collar rojo con su nombre. Se perdió cerca del parque central.",
    location: "San José, Escazú",
    lat: 9.9281,
    lng: -84.0907,
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    reportedBy: "María García",
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('es-ES'),
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleString('es-ES'),
    contactPhone: "+506 8888-1234",
    reward: 50000,
  },
  {
    id: "2",
    name: "Max",
    species: "dog",
    breed: "Labrador",
    color: "Negro",
    size: "large",
    age: "5 años",
    gender: "male",
    status: "found",
    description: "Encontrado cerca del supermercado. Muy amigable, parece bien cuidado.",
    location: "Heredia Centro",
    lat: 9.9985,
    lng: -84.1196,
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    reportedBy: "Carlos Rodríguez",
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString('es-ES'),
    contactPhone: "+506 8888-5678",
  },
  {
    id: "3",
    name: "Milo",
    species: "cat",
    breed: "Siamés",
    color: "Crema y marrón",
    size: "small",
    age: "2 años",
    gender: "male",
    status: "lost",
    description: "Gato siamés con ojos azules. Muy tímido con extraños.",
    location: "Cartago, Tres Ríos",
    lat: 9.9063,
    lng: -83.9856,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    reportedBy: "Ana Jiménez",
    reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('es-ES'),
    lastSeen: new Date(Date.now() - 26 * 60 * 60 * 1000).toLocaleString('es-ES'),
    contactPhone: "+506 8888-9012",
  },
  {
    id: "4",
    name: "Coco",
    species: "dog",
    breed: "Poodle",
    color: "Blanco",
    size: "small",
    age: "4 años",
    gender: "female",
    status: "shelter",
    description: "Poodle rescatada, muy juguetona. Busca un hogar amoroso.",
    location: "Refugio Amigos de los Animales",
    lat: 9.9347,
    lng: -84.0875,
    image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop",
    reportedBy: "Refugio Central",
    reportedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
  {
    id: "5",
    name: "Rocky",
    species: "dog",
    breed: "Pastor Alemán",
    color: "Negro y café",
    size: "large",
    age: "6 años",
    gender: "male",
    status: "lost",
    description: "Pastor alemán muy leal. Tiene chip de identificación.",
    location: "Alajuela Centro",
    lat: 10.0162,
    lng: -84.2117,
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=400&fit=crop",
    reportedBy: "Pedro Mora",
    reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleString('es-ES'),
    microchip: "985141234567890",
    reward: 100000,
  },
  {
    id: "6",
    name: "Whiskers",
    species: "cat",
    breed: "Persa",
    color: "Gris",
    size: "medium",
    age: "1 año",
    gender: "female",
    status: "found",
    description: "Gata persa encontrada en jardín. Muy tranquila.",
    location: "Santa Ana",
    lat: 9.9328,
    lng: -84.1823,
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
    reportedBy: "Laura Sánchez",
    reportedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
]

const initialUser: UserProfile = {
  id: "user-1",
  name: "María García",
  email: "maria@email.com",
  phone: "+506 8888-1234",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  location: "San José, Costa Rica",
  bio: "Amante de los animales. Voluntaria en refugio local.",
  petsCount: 2,
  reportsCount: 5,
  points: 340,
  badge: "Rescatista Comunitario",
  joinedAt: new Date(2024, 0, 15).toLocaleString('es-ES'),
}

const initialRegisteredPets: RegisteredPet[] = [
  {
    id: "reg-1",
    name: "Toby",
    species: "dog",
    breed: "Beagle",
    age: "4 años",
    image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=200&h=200&fit=crop",
    microchip: "985141234567891",
  },
  {
    id: "reg-2",
    name: "Michi",
    species: "cat",
    breed: "Mestizo",
    age: "2 años",
    image: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop",
  },
]

const initialPosts: CommunityPost[] = [
  {
    id: "post-1",
    userId: "user-2",
    userName: "Carlos Rodríguez",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    petId: "1",
    petName: "Luna",
    petImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    type: "lost",
    content: "Por favor ayúdennos a encontrar a Luna. Se perdió ayer cerca del parque de Escazú. Es muy cariñosa y tiene collar rojo.",
    location: "San José, Escazú",
    likes: 24,
    comments: 8,
    liked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
  {
    id: "post-2",
    userId: "user-3",
    userName: "Ana Jiménez",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    type: "tip",
    content: "Consejo: Siempre mantengan actualizada la foto de su mascota y tengan a mano su información médica. ¡Puede hacer la diferencia!",
    location: "Heredia",
    likes: 45,
    comments: 12,
    liked: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
  {
    id: "post-3",
    userId: "user-4",
    userName: "Pedro Mora",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    petId: "2",
    petName: "Max",
    petImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    type: "found",
    content: "Encontré a este perrito cerca del supermercado en Heredia. Parece bien cuidado. ¿Alguien lo reconoce?",
    location: "Heredia Centro",
    likes: 18,
    comments: 5,
    liked: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
  {
    id: "post-4",
    userId: "user-5",
    userName: "Laura Sánchez",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    type: "success",
    content: "¡Gracias a todos! Encontramos a Pelusa después de 3 días gracias a la comunidad de PawsConnect. ¡No pierdan la esperanza!",
    location: "Cartago",
    likes: 156,
    comments: 32,
    liked: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
]

const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "match",
    title: "¡Posible coincidencia!",
    message: "Alguien reportó un perro similar a Luna cerca de tu zona.",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toLocaleString('es-ES'),
  },
  {
    id: "notif-2",
    type: "sighting",
    title: "Nuevo avistamiento",
    message: "Un usuario reportó ver a un Golden Retriever en Escazú.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
  {
    id: "notif-3",
    type: "message",
    title: "Nuevo mensaje",
    message: "Carlos te envió un mensaje sobre Luna.",
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
]

const initialActivities: Activity[] = [
  {
    id: "act-1",
    type: "report",
    description: "Reportaste a Luna como perdida",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
  {
    id: "act-2",
    type: "helped",
    description: "Ayudaste a encontrar a Pelusa",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
  {
    id: "act-3",
    type: "found",
    description: "Reportaste mascota encontrada",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toLocaleString('es-ES'),
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  // User state
  const [user, setUser] = useState<UserProfile>(initialUser)
  
  // Pets state
  const [pets, setPets] = useState<Pet[]>(initialPets)
  
  // Registered pets state
  const [registeredPets, setRegisteredPets] = useState<RegisteredPet[]>(initialRegisteredPets)
  
  // Community posts state
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts)
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  
  // Activities state
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<PetStatus | "all">("all")
  const [speciesFilter, setSpeciesFilter] = useState<"dog" | "cat" | "other" | "all">("all")
  const [colorFilter, setColorFilter] = useState<string | "all">("all")
  const [sizeFilter, setSizeFilter] = useState<"small" | "medium" | "large" | "all">("all")
  const [radiusFilter, setRadiusFilter] = useState(50)
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const requestUserLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      const message = "Tu navegador no permite usar ubicacion."
      setLocationError(message)
      return Promise.resolve(null)
    }

    setIsLocating(true)
    setLocationError(null)

    return new Promise<UserLocation | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }

          setUserLocation(location)
          setIsLocating(false)
          resolve(location)
        },
        (error) => {
          const message =
            error.code === error.PERMISSION_DENIED
              ? "Permiso de ubicacion denegado."
              : "No pudimos obtener tu ubicacion actual."

          setLocationError(message)
          setIsLocating(false)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      )
    })
  }, [])

  // User functions
  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }, [])

  // Pet functions
  const addPet = useCallback((pet: Omit<Pet, "id" | "reportedAt">) => {
    const newPet: Pet = {
      ...pet,
      id: `pet-${Date.now()}`,
      reportedAt: new Date().toLocaleString('es-ES'),
      caseNumber: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    }
    setPets(prev => [newPet, ...prev])
    
    // Update user stats
    setUser(prev => ({
      ...prev,
      reportsCount: prev.reportsCount + 1,
      points: prev.points + 20,
    }))
    
    // Add activity
    setActivities(prev => [{
      id: `act-${Date.now()}`,
      type: pet.status === "found" ? "found" : "report",
      description: pet.status === "found" 
        ? `Reportaste a ${pet.name} como encontrado/a`
        : `Reportaste a ${pet.name} como perdido/a`,
      date: new Date().toLocaleString('es-ES'),
    }, ...prev])
    
    // Add notification for others (simulated)
    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      type: "alert",
      title: pet.status === "found" ? "Mascota encontrada" : "Nueva alerta",
      message: `Se reportó ${pet.status === "found" ? "encontrado" : "perdido"}: ${pet.name} en ${pet.location}`,
      image: pet.image,
      read: false,
      createdAt: new Date().toLocaleString('es-ES'),
    }, ...prev])
    
    return newPet
  }, [])

  const updatePet = useCallback((id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(pet => 
      pet.id === id ? { ...pet, ...updates } : pet
    ))
  }, [])

  const deletePet = useCallback((id: string) => {
    setPets(prev => prev.filter(pet => pet.id !== id))
  }, [])

  // Registered pet functions
  const addRegisteredPet = useCallback((pet: Omit<RegisteredPet, "id">) => {
    const newPet: RegisteredPet = {
      ...pet,
      id: `reg-${Date.now()}`,
    }
    setRegisteredPets(prev => [...prev, newPet])
    setUser(prev => ({ ...prev, petsCount: prev.petsCount + 1 }))
  }, [])

  const updateRegisteredPet = useCallback((id: string, updates: Partial<RegisteredPet>) => {
    setRegisteredPets(prev => prev.map(pet =>
      pet.id === id ? { ...pet, ...updates } : pet
    ))
  }, [])

  const deleteRegisteredPet = useCallback((id: string) => {
    setRegisteredPets(prev => prev.filter(pet => pet.id !== id))
    setUser(prev => ({ ...prev, petsCount: Math.max(0, prev.petsCount - 1) }))
  }, [])

  // Community functions
  const addPost = useCallback((post: Omit<CommunityPost, "id" | "createdAt" | "likes" | "comments" | "liked">) => {
    const newPost: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      likes: 0,
      comments: 0,
      liked: false,
      createdAt: new Date().toLocaleString('es-ES'),
    }
    setPosts(prev => [newPost, ...prev])
  }, [])

  const toggleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
        }
      }
      return post
    }))
  }, [])

  // Notification functions
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }, [])

  // Activity functions
  const addActivity = useCallback((activity: Omit<Activity, "id">) => {
    setActivities(prev => [{
      ...activity,
      id: `act-${Date.now()}`,
    }, ...prev])
  }, [])

  // Filtered pets
  const normalizeText = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

  const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180)
    const earthRadiusKm = 6371
    const dLat = toRadians(lat2 - lat1)
    const dLng = toRadians(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) ** 2

    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const searchOrigin = userLocation ?? { lat: 9.9281, lng: -84.0907 }

  const filteredPets = pets.filter(pet => {
    if (statusFilter !== "all" && pet.status !== statusFilter) return false
    if (speciesFilter !== "all" && pet.species !== speciesFilter) return false
    if (sizeFilter !== "all" && pet.size !== sizeFilter) return false
    if (colorFilter !== "all" && !normalizeText(pet.color).includes(colorFilter)) return false
    if (getDistanceKm(searchOrigin.lat, searchOrigin.lng, pet.lat, pet.lng) > radiusFilter) return false
    if (searchQuery) {
      const query = normalizeText(searchQuery)
      return (
        normalizeText(pet.name).includes(query) ||
        normalizeText(pet.breed).includes(query) ||
        normalizeText(pet.location).includes(query) ||
        normalizeText(pet.description).includes(query)
      )
    }
    return true
  })

  return (
    <AppContext.Provider value={{
      user,
      updateUser,
      pets,
      addPet,
      updatePet,
      deletePet,
      registeredPets,
      addRegisteredPet,
      updateRegisteredPet,
      deleteRegisteredPet,
      posts,
      addPost,
      toggleLike,
      notifications,
      markAsRead,
      markAllAsRead,
      activities,
      addActivity,
      userLocation,
      setUserLocation,
      isLocating,
      locationError,
      requestUserLocation,
      statusFilter,
      setStatusFilter,
      speciesFilter,
      setSpeciesFilter,
      colorFilter,
      setColorFilter,
      sizeFilter,
      setSizeFilter,
      radiusFilter,
      setRadiusFilter,
      searchQuery,
      setSearchQuery,
      filteredPets,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
