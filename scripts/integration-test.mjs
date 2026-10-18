import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import nextEnv from '@next/env'
import { neon } from '@neondatabase/serverless'
nextEnv.loadEnvConfig(process.cwd())
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000'
if (!new URL(base).hostname.match(/^(127\.0\.0\.1|localhost)$/))
  throw new Error(
    'Las pruebas de escritura solo se ejecutan en localhost, conectado a una base de desarrollo.',
  )
const sql = neon(process.env.DATABASE_URL)
const run = randomBytes(8).toString('hex')
const accounts = []
let checks = 0
async function request(path, { method = 'GET', body, cookie, origin = base } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  return {
    status: response.status,
    body: await response.json(),
    cookie: response.headers.get('set-cookie')?.split(';')[0],
  }
}
function expect(value, expected) {
  assert.deepEqual(value, expected)
  checks++
}
async function account(number) {
  const email = `integration-${run}-${number}@example.invalid`,
    password = randomBytes(18).toString('hex')
  accounts.push(email)
  const result = await request('/api/auth', {
    method: 'POST',
    body: { action: 'register', name: `Integration ${number}`, email, password },
  })
  expect(result.status, 200)
  assert.ok(result.cookie?.startsWith('paws_session='))
  checks++
  return { email, password, cookie: result.cookie }
}
try {
  expect((await request('/api/state')).body.configured, true)
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        body: { action: 'createRegisteredPet', data: {} },
        origin: 'https://attacker.invalid',
      })
    ).status,
    403,
  )
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        body: { action: 'createRegisteredPet', data: {} },
      })
    ).status,
    401,
  )
  const a = await account(1),
    b = await account(2)
  const state = await request('/api/state', { cookie: a.cookie })
  expect(state.body.user.email, a.email)
  expect(state.body.registeredPets.length, 0)
  expect(
    (
      await request('/api/auth', {
        method: 'POST',
        body: { action: 'login', email: a.email, password: 'incorrect-password' },
      })
    ).status,
    401,
  )
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        cookie: a.cookie,
        body: {
          action: 'profile',
          data: {
            name: 'Integration Owner',
            phone: '',
            location: 'Costa Rica',
            bio: 'Test profile',
            avatar: '/avatar.svg',
            points: 999,
          },
        },
      })
    ).status,
    200,
  )
  expect((await request('/api/state', { cookie: a.cookie })).body.user.points, 0)
  const pet = {
    name: 'Integration Pet',
    species: 'dog',
    breed: 'Labrador',
    age: '3',
    image: '/pet-placeholder.svg',
  }
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        cookie: a.cookie,
        body: { action: 'createRegisteredPet', data: pet },
      })
    ).status,
    200,
  )
  const registered = (await request('/api/state', { cookie: a.cookie })).body.registeredPets[0]
  expect(registered.name, pet.name)
  expect((await request('/api/state', { cookie: b.cookie })).body.registeredPets.length, 0)
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        cookie: b.cookie,
        body: { action: 'updateRegisteredPet', id: registered.id, data: pet },
      })
    ).status,
    404,
  )
  const data = {
    ...pet,
    name: `Integration ${run}`,
    color: 'cafe',
    size: 'medium',
    gender: 'unknown',
    status: 'lost',
    description: 'Reporte temporal de prueba automatizada',
    location: 'San José',
    lat: 9.93,
    lng: -84.09,
    contactPhone: '+506 0000-0000',
  }
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        cookie: a.cookie,
        body: { action: 'createReport', data: { ...data, lat: 999 } },
      })
    ).status,
    400,
  )
  const report = await request('/api/actions', {
    method: 'POST',
    cookie: a.cookie,
    body: { action: 'createReport', data },
  })
  expect(report.status, 200)
  const id = report.body.result.id
  const saved = (await request('/api/state', { cookie: a.cookie })).body
  expect(saved.pets.find((p) => p.id === id).name, data.name)
  const post = saved.posts.find((p) => p.petId === id)
  assert.ok(post)
  checks++
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        cookie: b.cookie,
        body: { action: 'deleteReport', id },
      })
    ).status,
    404,
  )
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        cookie: b.cookie,
        body: { action: 'resolveReport', id },
      })
    ).status,
    404,
  )
  for (let i = 0; i < 2; i++)
    expect(
      (
        await request('/api/actions', {
          method: 'POST',
          cookie: b.cookie,
          body: { action: 'like', id: post.id, data: { liked: true } },
        })
      ).status,
      200,
    )
  expect(
    (await request('/api/state', { cookie: b.cookie })).body.posts.find((p) => p.id === post.id)
      .likes,
    1,
  )
  expect(
    (
      await request('/api/messages', {
        method: 'POST',
        cookie: b.cookie,
        body: { reportId: id, content: 'Vi una mascota similar cerca del parque.' },
      })
    ).status,
    200,
  )
  expect((await request(`/api/messages?reportId=${id}`)).body.messages.length, 1)
  const notifications = (await request('/api/state', { cookie: a.cookie })).body.notifications
  expect(notifications.length, 1)
  expect(notifications[0].reportId, id)
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        cookie: a.cookie,
        body: { action: 'readNotification', id: notifications[0].id },
      })
    ).status,
    200,
  )
  expect((await request('/api/state', { cookie: a.cookie })).body.notifications[0].read, true)
  expect(
    (
      await request('/api/actions', {
        method: 'POST',
        cookie: a.cookie,
        body: { action: 'resolveReport', id },
      })
    ).status,
    200,
  )
  expect(
    (
      await request('/api/messages', {
        method: 'POST',
        cookie: b.cookie,
        body: { reportId: id, content: 'Caso cerrado' },
      })
    ).status,
    404,
  )
  const login = await request('/api/auth', {
    method: 'POST',
    body: { action: 'login', email: a.email, password: a.password },
  })
  expect(login.status, 200)
  expect((await request('/api/auth', { method: 'DELETE', cookie: login.cookie })).status, 200)
  expect((await request('/api/state', { cookie: login.cookie })).body.user, null)
  const [dbReport] = await sql`SELECT data->>'name' AS name FROM reports WHERE id=${id}`
  expect(dbReport.name, data.name)
  console.log(
    `Integration: ${checks} checks passed against real Neon, including persistence, authentication, ownership, likes, messages, notifications and logout.`,
  )
} finally {
  // Only randomly named accounts created by this run; FK cascades remove their disposable fixtures.
  for (const email of accounts)
    await sql`DELETE FROM app_users WHERE email=${email} AND email LIKE 'integration-%@example.invalid'`
  for (const email of accounts) await sql`DELETE FROM rate_limits WHERE key=${`auth:${email}`}`
  console.log('Disposable integration fixtures cleaned up.')
}
