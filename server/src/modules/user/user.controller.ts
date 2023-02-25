import bcrypt from 'bcrypt'
import {FastifyRequest, FastifyReply} from 'fastify'
import {CreateUserInput, LoginInput} from './user.schema'
import {createUser, findUserByEmail, findUserByID, findUsers} from './user.service'

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

export async function loginHandler(
  request: FastifyRequest<{Body: LoginInput}>,
  reply: FastifyReply,
) {
  const {email, password} = request.body
  try {
    // find user
    const user = await findUserByEmail(email)

    const msg = 'Invalid email or password'

    if (!user) {
      return reply.code(404).send({msg})
    }

    // check if password matches
    const matches = await bcrypt.compare(password, user.password)

    if (!matches) {
      return reply.code(404).send({msg})
    }

    const accessToken = await reply.jwtSign(user)
    // if it matches sign jwt and send it back
    return reply.send({accessToken})
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}

export async function getAllUsersHandler(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await findUsers()
    return reply.code(200).send(users)
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}

export async function getUserHandler(request: FastifyRequest, reply: FastifyReply) {
  const params = request.params as {id: string}

  const id = Number(params.id)

  try {
    const user = await findUserByID(id)

    if (!user) {
      return reply.code(404).send({msg: 'User not found'})
    }

    return reply.code(200).send(user)
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}
