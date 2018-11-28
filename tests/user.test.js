import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, getUsers, login, meQuery } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase, 10000)

test('Should create a new user', async () => {
  const response = await client.mutate({
    mutation: createUser,
    variables: {
      data: {
        name: 'John',
        email: 'john@example.com',
        password: 'MyPass123'
      }
    }
  })

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id
  })

  expect(exists).toBe(true)
})

test('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers })

  expect(response.data.users.length).toBe(2)
  expect(response.data.users[0].email).toBe(null)
})

test('Should not login with bad credentials', async () => {
  await expect(
    client.mutate({
      mutation: login,
      variables: { data: { email: 'jef@exmaple.com', password: 'asd123' } }
    })
  ).rejects.toThrow()
})

test('Should login with right credentials', async () => {
  const repsonse = await client.mutate({
    mutation: login,
    variables: { data: { email: 'jen@example.com', password: 'Red098123' } }
  })
  expect(repsonse.data.login.token).toBeDefined()
})

test('You cant sign up with short password credentials', async () => {
  await expect(
    client.mutate({
      mutation: createUser,
      variables: {
        data: { name: 'john', email: 'john@exmaple.com', password: '123' }
      }
    })
  ).rejects.toThrow()
})

test('Should fetch user proifle', async () => {
  const client = getClient(userOne.jwt)
  const { data } = await client.query({ query: meQuery })
  expect(data.me.id).toBe(userOne.user.id)
  expect(data.me.name).toBe(userOne.user.name)
  expect(data.me.email).toBe(userOne.user.email)
})
