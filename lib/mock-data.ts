// PawsConnect Mock Data

export type PetType = 'perro' | 'gato' | 'otro'
export type PetSize = 'pequeno' | 'mediano' | 'grande'
export type PetStatus = 'perdido' | 'encontrado' | 'adopcion' | 'activo'
export type PetColor = 'negro' | 'cafe' | 'blanco' | 'gris' | 'naranja' | 'mixto'

export interface Pet {
  id: string
  name: string
  type: PetType
  breed: string
  color: PetColor
  size: PetSize
  status: PetStatus
  image: string
  description: string
  lastSeen: string
  distance: string
  location: { lat: number; lng: number }
  owner: {
    name: string
    phone: string
    avatar: string
  }
  caseNumber?: string
  createdAt: string
}

export interface AIMatch {
  id: string
  lostPet: Pet
  foundPet: Pet
  matchPercentage: number
  features: {
    label: string
    match: boolean
    detail: string
  }[]
}

export interface Shelter {
  id: string
  name: string
  location: string
  pets: number
  verified: boolean
  coordinates: { lat: number; lng: number }
  logo: string
}

export interface Notification {
  id: string
  type: 'ai_match' | 'sighting' | 'message' | 'confirmation' | 'alert'
  title: string
  description: string
  time: string
  read: boolean
}

export interface ChatMessage {
  id: string
  sender: 'me' | 'other'
  content: string
  time: string
  type: 'text' | 'location' | 'image'
  location?: { lat: number; lng: number }
}

export interface CommunityPost {
  id: string
  type: 'lost' | 'found' | 'adoption'
  title: string
  description: string
  image: string
  likes: number
  comments: number
  pet?: Pet
  author: {
    name: string
    avatar: string
  }
  createdAt: string
}

export interface TimelineEvent {
  id: string
  type: 'created' | 'sighting' | 'ai_match' | 'pending' | 'found'
  title: string
  description: string
  time: string
  location?: string
  percentage?: number
}

// Mock Pets
export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Luna',
    type: 'perro',
    breed: 'Golden Retriever',
    color: 'naranja',
    size: 'mediano',
    status: 'activo',
    image: 'https://picsum.photos/seed/luna/400/400',
    description: 'Collar azul con placa. Muy amigable.',
    lastSeen: 'Hace 20 min',
    distance: '350m',
    location: { lat: 9.9281, lng: -84.0907 },
    owner: {
      name: 'Roberto Araya',
      phone: '+506 8888-1234',
      avatar: 'https://picsum.photos/seed/maria/100/100'
    },
    caseNumber: '2847',
    createdAt: 'Hace 3 días'
  },
  {
    id: '2',
    name: 'Max',
    type: 'perro',
    breed: 'Labrador',
    color: 'negro',
    size: 'grande',
    status: 'perdido',
    image: 'https://picsum.photos/seed/max/400/400',
    description: 'Sin collar. Tiene una mancha blanca en el pecho.',
    lastSeen: 'Hace 2h',
    distance: '1.2km',
    location: { lat: 9.9350, lng: -84.0850 },
    owner: {
      name: 'Carlos Mora',
      phone: '+506 8888-5678',
      avatar: 'https://picsum.photos/seed/carlos/100/100'
    },
    caseNumber: '2846',
    createdAt: 'Hace 5 días'
  },
  {
    id: '3',
    name: 'Milo',
    type: 'gato',
    breed: 'Siamés',
    color: 'cafe',
    size: 'pequeno',
    status: 'encontrado',
    image: 'https://picsum.photos/seed/milo/400/400',
    description: 'Encontrado cerca del parque central.',
    lastSeen: 'Hace 1h',
    distance: '800m',
    location: { lat: 9.9200, lng: -84.0950 },
    owner: {
      name: 'Ana López',
      phone: '+506 8888-9012',
      avatar: 'https://picsum.photos/seed/ana/100/100'
    },
    caseNumber: '2845',
    createdAt: 'Hace 1 día'
  },
  {
    id: '4',
    name: 'Rocky',
    type: 'perro',
    breed: 'Bulldog Francés',
    color: 'cafe',
    size: 'pequeno',
    status: 'perdido',
    image: 'https://picsum.photos/seed/rocky/400/400',
    description: 'Collar rojo. Responde a su nombre.',
    lastSeen: 'Hace 4h',
    distance: '2.5km',
    location: { lat: 9.9400, lng: -84.0800 },
    owner: {
      name: 'Pedro Jiménez',
      phone: '+506 8888-3456',
      avatar: 'https://picsum.photos/seed/pedro/100/100'
    },
    caseNumber: '2844',
    createdAt: 'Hace 2 días'
  },
  {
    id: '5',
    name: 'Mia',
    type: 'gato',
    breed: 'Persa',
    color: 'blanco',
    size: 'pequeno',
    status: 'encontrado',
    image: 'https://picsum.photos/seed/mia/400/400',
    description: 'Muy cariñosa. Collar rosa.',
    lastSeen: 'Hace 30 min',
    distance: '500m',
    location: { lat: 9.9250, lng: -84.0920 },
    owner: {
      name: 'Laura Vargas',
      phone: '+506 8888-7890',
      avatar: 'https://picsum.photos/seed/laura/100/100'
    },
    caseNumber: '2843',
    createdAt: 'Hace 6 horas'
  },
  {
    id: '6',
    name: 'Toby',
    type: 'perro',
    breed: 'Beagle',
    color: 'mixto',
    size: 'mediano',
    status: 'adopcion',
    image: 'https://picsum.photos/seed/toby/400/400',
    description: '2 años. Vacunado y esterilizado.',
    lastSeen: 'N/A',
    distance: '3km',
    location: { lat: 9.9150, lng: -84.1000 },
    owner: {
      name: 'Refugio Zaguates',
      phone: '+506 2222-1111',
      avatar: 'https://picsum.photos/seed/refugio/100/100'
    },
    createdAt: 'Hace 1 semana'
  }
]

// Mock AI Matches
export const mockAIMatches: AIMatch[] = [
  {
    id: '1',
    lostPet: mockPets[0],
    foundPet: {
      ...mockPets[0],
      id: '1-found',
      status: 'encontrado',
      image: 'https://picsum.photos/seed/luna-found/400/400'
    },
    matchPercentage: 92,
    features: [
      { label: 'Color similar', match: true, detail: 'Dorado' },
      { label: 'Tamaño similar', match: true, detail: 'Mediano' },
      { label: 'Raza probable', match: true, detail: 'Golden Retriever' },
      { label: 'Mancha en lomo', match: false, detail: 'Pendiente confirmar' }
    ]
  },
  {
    id: '2',
    lostPet: mockPets[1],
    foundPet: {
      ...mockPets[1],
      id: '2-found',
      status: 'encontrado',
      image: 'https://picsum.photos/seed/max-found/400/400'
    },
    matchPercentage: 87,
    features: [
      { label: 'Color similar', match: true, detail: 'Negro' },
      { label: 'Tamaño similar', match: true, detail: 'Grande' },
      { label: 'Raza probable', match: true, detail: 'Labrador' },
      { label: 'Mancha blanca', match: true, detail: 'Confirmada' }
    ]
  },
  {
    id: '3',
    lostPet: mockPets[2],
    foundPet: {
      ...mockPets[2],
      id: '3-found',
      status: 'encontrado',
      image: 'https://picsum.photos/seed/milo-found/400/400'
    },
    matchPercentage: 75,
    features: [
      { label: 'Color similar', match: true, detail: 'Café' },
      { label: 'Tamaño similar', match: true, detail: 'Pequeño' },
      { label: 'Raza probable', match: false, detail: 'No determinada' },
      { label: 'Ojos azules', match: true, detail: 'Confirmado' }
    ]
  }
]

// Mock Shelters
export const mockShelters: Shelter[] = [
  {
    id: '1',
    name: 'ZAGUATES DE COSTA RICA',
    location: 'Desamparados, San José',
    pets: 48,
    verified: true,
    coordinates: { lat: 9.9000, lng: -84.0700 },
    logo: 'https://picsum.photos/seed/zaguates/100/100'
  },
  {
    id: '2',
    name: 'Refugio Esperanza Animal',
    location: 'Heredia Centro',
    pets: 32,
    verified: true,
    coordinates: { lat: 9.9980, lng: -84.1200 },
    logo: 'https://picsum.photos/seed/esperanza/100/100'
  },
  {
    id: '3',
    name: 'Patitas Sin Hogar',
    location: 'Cartago',
    pets: 25,
    verified: false,
    coordinates: { lat: 9.8650, lng: -83.9200 },
    logo: 'https://picsum.photos/seed/patitas/100/100'
  }
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'ai_match',
    title: 'Nueva coincidencia IA - 92%',
    description: 'Luna',
    time: 'Hace 5 min',
    read: false
  },
  {
    id: '2',
    type: 'sighting',
    title: 'Avistamiento cerca de ti',
    description: '350m',
    time: 'Hace 20 min',
    read: false
  },
  {
    id: '3',
    type: 'message',
    title: 'Carlos M. te envió un mensaje',
    description: '',
    time: 'Hace 1h',
    read: false
  },
  {
    id: '4',
    type: 'confirmation',
    title: 'Tu reporte fue confirmado',
    description: 'Por 3 usuarios',
    time: 'Ayer',
    read: true
  },
  {
    id: '5',
    type: 'alert',
    title: 'Nueva mascota perdida en tu zona',
    description: '',
    time: 'Ayer',
    read: true
  }
]

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'other',
    content: 'Hola, vi tu publicación. Creo que vi a Luna esta mañana cerca del parque',
    time: '10:30 AM',
    type: 'text'
  },
  {
    id: '2',
    sender: 'me',
    content: '¡Gracias! ¿Recuerdas dónde exactamente?',
    time: '10:32 AM',
    type: 'text'
  },
  {
    id: '3',
    sender: 'other',
    content: 'Ubicación compartida',
    time: '10:33 AM',
    type: 'location',
    location: { lat: 9.9281, lng: -84.0907 }
  },
  {
    id: '4',
    sender: 'me',
    content: 'Voy para allá ahora mismo',
    time: '10:35 AM',
    type: 'text'
  }
]

// Mock Community Posts
export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    type: 'lost',
    title: 'Se busca: Rocky, Bulldog Francés, zona Escazú',
    description: 'Se perdió ayer por la noche. Lleva collar rojo.',
    image: 'https://picsum.photos/seed/rocky/400/300',
    likes: 12,
    comments: 4,
    pet: mockPets[3],
    author: {
      name: 'Pedro Jiménez',
      avatar: 'https://picsum.photos/seed/pedro/100/100'
    },
    createdAt: 'Hace 2h'
  },
  {
    id: '2',
    type: 'found',
    title: '¡Encontrada! Gracias a la comunidad se encontró a Mia',
    description: 'Gracias a todos los que compartieron y ayudaron.',
    image: 'https://picsum.photos/seed/mia/400/300',
    likes: 45,
    comments: 12,
    pet: mockPets[4],
    author: {
      name: 'Laura Vargas',
      avatar: 'https://picsum.photos/seed/laura/100/100'
    },
    createdAt: 'Hace 6h'
  },
  {
    id: '3',
    type: 'adoption',
    title: 'En adopción: 3 cachorros Labrador, 2 meses',
    description: 'Buscan hogar responsable. Vacunados.',
    image: 'https://picsum.photos/seed/puppies/400/300',
    likes: 28,
    comments: 8,
    author: {
      name: 'Refugio Zaguates',
      avatar: 'https://picsum.photos/seed/refugio/100/100'
    },
    createdAt: 'Hace 1 día'
  }
]

// Mock Timeline Events
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'created',
    title: 'Reporte creado',
    description: 'Caso iniciado',
    time: 'Hace 3 días'
  },
  {
    id: '2',
    type: 'sighting',
    title: 'Avistamiento confirmado',
    description: 'Vista en Plaza Mayor',
    time: 'Hace 2 días',
    location: 'Plaza Mayor'
  },
  {
    id: '3',
    type: 'ai_match',
    title: 'Coincidencia IA detectada',
    description: 'Posible coincidencia encontrada',
    time: 'Hace 1 día',
    percentage: 87
  },
  {
    id: '4',
    type: 'pending',
    title: 'En revisión',
    description: 'Esperando confirmación',
    time: 'Ahora'
  }
]

// User Data
export const mockUser = {
  id: '1',
  name: 'María Rodríguez',
  email: 'maria@email.com',
  location: 'San José, CR',
  avatar: 'https://picsum.photos/seed/maria/200/200',
  pets: 2,
  reports: 5,
  reputation: 340,
  badge: 'Rescatista Comunitario'
}
