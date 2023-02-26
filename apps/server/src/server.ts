import fastify, {FastifyReply, FastifyRequest} from 'fastify'
import jwt from '@fastify/jwt'
import userRoutes from './modules/user/user.route'
import invoiceRoutes from './modules/invoice/invoice.route'
import {userSchemas} from './modules/user/user.schema'
import {invoiceSchema} from './modules/invoice/invoice.schema'

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

  server.get('/api/health', function () {
    return {status: 'OK'}
  })

  // server.addHook('preHandler', (req: FastifyRequest, _, next) => {
  //   // @ts-ignore
  //   req.jwt = server.jwt
  //   return next()
  // })

  for (const schema of [...userSchemas, ...invoiceSchema]) {
    server.addSchema(schema)
  }

  server.register(userRoutes, {prefix: 'api/users'})
  server.register(invoiceRoutes, {prefix: 'api/invoices'})

  return server
}
