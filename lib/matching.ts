import type { Pet } from './types'
export const normalize = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
export function distanceKm(a: Pick<Pet, 'lat' | 'lng'>, b: Pick<Pet, 'lat' | 'lng'>) {
  const rad = (v: number) => (v * Math.PI) / 180
  const x =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(Math.max(0, 1 - x)))
}
export function findMatches(pets: Pet[]) {
  return pets
    .filter((p) => p.status === 'lost' && !p.resolvedAt)
    .flatMap((lostPet) =>
      pets
        .filter((p) => p.status === 'found' && !p.resolvedAt && p.species === lostPet.species)
        .map((foundPet) => {
          const distance = distanceKm(lostPet, foundPet)
          const features = [
            {
              label: 'Especie',
              match: true,
              detail:
                lostPet.species === 'dog'
                  ? 'Perro'
                  : lostPet.species === 'cat'
                    ? 'Gato'
                    : 'Otra especie',
              weight: 20,
            },
            {
              label: 'Raza declarada',
              match:
                !!lostPet.breed &&
                !['desconocida', 'mestizo', 'unknown'].includes(normalize(lostPet.breed)) &&
                normalize(lostPet.breed) === normalize(foundPet.breed),
              detail: `${lostPet.breed || 'Sin dato'} / ${foundPet.breed || 'Sin dato'}`,
              weight: 25,
            },
            {
              label: 'Color declarado',
              match:
                !!lostPet.color &&
                !['unknown', 'desconocido'].includes(normalize(lostPet.color)) &&
                normalize(lostPet.color) === normalize(foundPet.color),
              detail: `${lostPet.color} / ${foundPet.color}`,
              weight: 25,
            },
            {
              label: 'Tamaño',
              match: lostPet.size === foundPet.size,
              detail: lostPet.size === foundPet.size ? 'Mismo tamaño' : 'Tamaño diferente',
              weight: 15,
            },
            {
              label: 'Proximidad',
              match: distance <= 10,
              detail: `${distance.toFixed(1)} km entre reportes`,
              weight: 15,
            },
          ]
          return {
            id: `${lostPet.id}_${foundPet.id}`,
            lostPet,
            foundPet,
            features,
            matchPercentage: features.reduce((total, f) => total + (f.match ? f.weight : 0), 0),
          }
        }),
    )
    .filter((m) => m.matchPercentage >= 50)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
}
