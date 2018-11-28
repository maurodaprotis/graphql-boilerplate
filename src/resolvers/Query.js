import getUserId from '../utils/getUserId'

const Query = {
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    return prisma.query.user({ where: { id: userId } }, info)
  },
  users(parent, args, { prisma }, info) {
    const { query, skip, first, after, orderBy } = args
    return prisma.query.users(
      {
        where: {
          name_contains: query
        },
        skip,
        first,
        after,
        orderBy
      },
      info
    )
  }
}

export { Query as default }
