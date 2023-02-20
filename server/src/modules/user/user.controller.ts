import {FastifyRequest, FastifyReply} from 'fastify'
import {CreateUserInput} from './user.schema'
import {createUser} from './user.service'

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput
  }>,
  reply: FastifyReply,
) {
  const body = request.body

  try {
    const user = await createUser(body)

    return reply.code(201).send(user)
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}
