import { z } from 'zod'

const text = (max = 200) => z.string().trim().max(max)
export const imageSchema = z
  .string()
  .max(500_000)
  .refine(
    (value) =>
      !value ||
      ['/avatar.svg', '/pet-placeholder.svg'].includes(value) ||
      /^https:\/\//.test(value) ||
      /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value),
    'Imagen no válida',
  )
export const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  password: z.string().min(10, 'Usa al menos 10 caracteres').max(128),
  name: text(80).min(2).optional(),
})
export const profileSchema = z.object({
  name: text(80).min(2),
  phone: text(30),
  location: text(),
  bio: text(500),
  avatar: imageSchema,
})
export const registeredPetSchema = z.object({
  name: text(80).min(1),
  species: z.enum(['dog', 'cat', 'other']),
  breed: text(80),
  age: text(40),
  image: imageSchema,
  microchip: text(40).optional(),
})
export const reportSchema = registeredPetSchema.extend({
  color: text(80).min(1),
  size: z.enum(['small', 'medium', 'large']),
  gender: z.enum(['male', 'female', 'unknown']),
  status: z.enum(['lost', 'found', 'shelter']),
  description: text(2000).min(10, 'Describe la mascota con al menos 10 caracteres'),
  location: text().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  contactPhone: text(30)
    .regex(/^[+\d\s()-]{8,30}$/, 'Indica un teléfono de contacto válido')
    .refine((value) => {
      const length = value.replace(/\D/g, '').length
      return length >= 8 && length <= 15
    }, 'Indica entre 8 y 15 dígitos'),
  contactEmail: z.string().email().optional(),
  collar: text().optional(),
  reward: z.number().min(0).max(10000000).optional(),
  lastSeen: text().optional(),
})
export const messageSchema = z.object({ reportId: z.string().uuid(), content: text(1500).min(1) })
