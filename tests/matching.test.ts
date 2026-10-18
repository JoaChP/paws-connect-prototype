import { test } from 'node:test'
import assert from 'node:assert/strict'
import { distanceKm, findMatches } from '../lib/matching'
import type { Pet } from '../lib/types'
const lost: Pet = {
  id: 'lost',
  name: 'Luna',
  species: 'dog',
  breed: 'Labrador',
  color: 'Café',
  size: 'medium',
  age: '3',
  gender: 'female',
  status: 'lost',
  description: 'Collar rojo',
  location: 'San José',
  lat: 9.93,
  lng: -84.09,
  image: '',
  reportedBy: 'Test',
  reportedAt: '',
}
const found: Pet = { ...lost, id: 'found', status: 'found', color: 'cafe' }
test('matches declared characteristics without accents and explains weighted score', () => {
  const [match] = findMatches([lost, found])
  assert.equal(match.matchPercentage, 100)
  assert.equal(match.features.length, 5)
})
test('does not match different species, same status or resolved cases', () => {
  assert.equal(findMatches([lost, { ...found, species: 'cat' }]).length, 0)
  assert.equal(findMatches([lost, { ...found, status: 'lost' }]).length, 0)
  assert.equal(findMatches([{ ...lost, resolvedAt: new Date().toISOString() }, found]).length, 0)
})
test('unknown breeds do not artificially increase similarity', () => {
  const [match] = findMatches([
    { ...lost, breed: 'desconocida' },
    { ...found, breed: 'desconocida' },
  ])
  assert.equal(match.matchPercentage, 75)
})
test('distant reports receive no proximity points', () => {
  const [match] = findMatches([lost, { ...found, lat: 0, lng: 0 }])
  assert.equal(match.matchPercentage, 85)
  assert.equal(distanceKm(lost, lost), 0)
  assert.ok(
    Math.abs(distanceKm(lost, { lat: 0, lng: 0 }) - distanceKm({ lat: 0, lng: 0 }, lost)) < 0.001,
  )
})
