import fastify from 'fastify'
import userRoutes from './modules/user/user.route'
import {userSchemas} from './modules/user/user.schema'

export function buildServer() {
  const server = fastify()

  server.get('/health', async function () {
    return {status: 'OK'}
  })

  for (const schema of [...userSchemas]) {
    server.addSchema(schema)
  }

  server.register(userRoutes, {prefix: 'api/users'})

  return server
}
