import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {id: number} // payload type is used for signing and verifying
    user: {
      id: number
      createdAt: Date
      updatedAt: Date
      email: string
      name: string
      password: string
      iat: number
    }
  }
}
