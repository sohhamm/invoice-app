import prisma from '../../utils/prisma'
import bcrypt from 'bcryptjs'
import {CreateUserInput} from './user.schema'

export async function createUser(input: CreateUserInput) {
  const {password, ...rest} = input

  const saltKey = process.env['HASH_SALT'] as string

  const salt: any = await new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) reject(err)
      resolve(salt)
    })
  })

  const hash: string = await new Promise((resolve, reject) => {
    bcrypt.hash(saltKey, salt, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    })
  })

  const user = await prisma.user.create({
    data: {...rest, password: hash},
  })

  return user
}
