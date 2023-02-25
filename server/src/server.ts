import fastify, {FastifyReply, FastifyRequest} from 'fastify'
import jwt from '@fastify/jwt'

import userRoutes from './modules/user/user.route'
import {userSchemas} from './modules/user/user.schema'

export function buildServer() {
  const server = fastify()

  server.register(jwt, {secret: 'supersecret'})

  server.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  server.get('/api/health', async function () {
    return {status: 'OK'}
  })

  for (const schema of [...userSchemas]) {
    server.addSchema(schema)
  }

  server.register(userRoutes, {prefix: 'api/users'})

  return server
}
