import prisma from '../../utils/prisma'
import bcrypt from 'bcrypt'
import {CreateUserInput} from './user.schema'

export async function createUser(input: CreateUserInput) {
  const {password, ...rest} = input

  // const saltKey = process.env['HASH_SALT'] as string

  const salt: any = await new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) reject(err)
      resolve(salt)
    })
  })

  const hash: string = await new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })

  const user = await prisma.user.create({
    data: {...rest, password: hash},
  })

  return user
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export async function findUserByID(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  })
}
