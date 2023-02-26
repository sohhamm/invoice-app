import {FastifyInstance} from 'fastify'
import {$ref} from './user.schema'
import {
  getAllUsersHandler,
  getUserHandler,
  loginHandler,
  registerUserHandler,
} from './user.controller'

async function userRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
      },
    },
    registerUserHandler,
  )

  server.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema'),
        },
      },
    },
    loginHandler,
  )

  server.get(
    '/',
    {
      // @ts-ignore
      onRequest: [server.authenticate],
    },
    getAllUsersHandler,
  )

  server.get(
    '/:id',
    {
      // @ts-ignore
      onRequest: [server.authenticate],
      schema: {
        params: {
          id: {type: 'string'},
        },
      },
    },
    getUserHandler,
  )
}

export default userRoutes
