import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const { email, password } = args.data
    const user = await prisma.query.user({ where: { email } })
    if (!user) throw new Error('User not exist')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Invalid password')
    return {
      user,
      token: generateToken({ userId: user.id, permissions: ['ADMIN'] })
    }
  },
  async createUser(parent, args, { prisma }, info) {
    const { email, password: plainPassword, ...data } = args.data
    const password = await hashPassword(plainPassword)
    const emailTaken = await prisma.exists.User({ email })
    if (emailTaken) throw new Error('Email taken.')

    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        email,
        password
      }
    })

    const token = generateToken({ userId: user.id })
    return {
      user,
      token
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const userExists = await prisma.exists.User({ id: userId })
    if (!userExists) throw new Error('User not found')
    return prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    )
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    if (args.data.password) {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    )
  }
}

export { Mutation as default }
