import jwt from 'jsonwebtoken'

const getUserId = (request, requireAuth = true) => {
  const Authorization = request.request
    ? request.request.get('Authorization')
    : request.connection.context.Authorization

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return decoded.userId
  }

  if (requireAuth) {
    throw new Error('Authorization required')
  }

  return null
}

export { getUserId as default }
