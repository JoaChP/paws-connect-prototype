export type PetStatus = 'lost' | 'found' | 'shelter'

export interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
}

export interface Pet {
  id: string
  ownerId?: string
  resolvedAt?: string | null
  name: string
  species: 'dog' | 'cat' | 'other'
  breed: string
  color: string
  size: 'small' | 'medium' | 'large'
  age: string
  gender: 'male' | 'female' | 'unknown'
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
  species: 'dog' | 'cat' | 'other'
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
  type: 'lost' | 'found' | 'tip' | 'success' | 'adoption'
  content: string
  location: string
  likes: number
  comments: number
  liked: boolean
  createdAt: string
}

export interface Notification {
  reportId?: string
  id: string
  type: 'match' | 'sighting' | 'message' | 'alert'
  title: string
  message: string
  image?: string
  read: boolean
  createdAt: string
}

export interface Activity {
  id: string
  type: 'report' | 'found' | 'helped'
  description: string
  date: string
}
