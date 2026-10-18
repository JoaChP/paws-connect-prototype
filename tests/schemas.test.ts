import { test } from 'node:test'
import assert from 'node:assert/strict'
import { credentialsSchema, imageSchema, reportSchema, profileSchema } from '../lib/schemas'
const report = {
  name: 'Luna',
  species: 'dog',
  breed: 'Labrador',
  color: 'cafe',
  size: 'medium',
  age: '3',
  gender: 'unknown',
  status: 'lost',
  description: 'Mascota con collar rojo',
  location: 'San José',
  lat: 9.93,
  lng: -84.09,
  image: '/pet-placeholder.svg',
  contactPhone: '+506 8888-1234',
}
test('validates report coordinates, phone and meaningful descriptions', () => {
  assert.ok(reportSchema.safeParse(report).success)
  for (const input of [
    { ...report, lat: 91 },
    { ...report, lng: -181 },
    { ...report, contactPhone: 'x' },
    { ...report, description: 'hola' },
    { ...report, status: 'invented' },
  ])
    assert.equal(reportSchema.safeParse(input).success, false)
})
test('does not accept client-supplied ownership or artificial statistics', () => {
  const parsed = reportSchema.parse({ ...report, userId: 'someone-else' })
  assert.equal('userId' in parsed, false)
  const profile = profileSchema.parse({
    name: 'Test User',
    phone: '',
    location: '',
    bio: '',
    avatar: '/avatar.svg',
    points: 999,
    email: 'other@example.com',
  })
  assert.equal('points' in profile, false)
  assert.equal('email' in profile, false)
})
test('rejects executable, SVG, oversized and insecure image inputs', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:image/svg+xml;base64,PHN2Zz4=',
    'http://example.com/pet.png',
    'x'.repeat(500001),
  ])
    assert.equal(imageSchema.safeParse(value).success, false)
})
test('normalizes login email and rejects short passwords', () => {
  assert.equal(
    credentialsSchema.parse({ email: ' TEST@example.com ', password: '0123456789' }).email,
    'test@example.com',
  )
  assert.equal(credentialsSchema.safeParse({ email: 'bad', password: 'short' }).success, false)
})
