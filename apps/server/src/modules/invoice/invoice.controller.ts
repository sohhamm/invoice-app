import {InvoiceStatus, InvoiceUpdate} from '../../types'
import {CreateInvoiceInput} from './invoice.schema'
import {createInvoice, findAllInvoices, findInvoiceByID, updateInvoiceByID} from './invoice.service'
import type {FastifyReply, FastifyRequest} from 'fastify'

export async function createInvoiceHandler(
  request: FastifyRequest<{
    Body: CreateInvoiceInput
  }>,
  reply: FastifyReply,
) {
  const body = request.body
  // @ts-ignore
  const userId = request.user.id

  try {
    const invoice = await createInvoice({...body, userId})
    return reply.code(200).send(invoice)
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}

export async function getAllInvoicesHandler(
  request: FastifyRequest<{
    Querystring: {
      status?: InvoiceStatus
    }
  }>,
  reply: FastifyReply,
) {
  // @ts-ignore
  const userId = request.user.id

  const {status} = request.query

  try {
    const invoices = await findAllInvoices(userId, status)
    return reply.code(200).send(invoices)
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}

export async function getInvoiceByIdHandler(
  request: FastifyRequest<{
    Params: {
      id: string
    }
  }>,
  reply: FastifyReply,
) {
  const {id} = request.params

  try {
    const invoice = await findInvoiceByID(+id)
    return reply.code(200).send(invoice)
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}

export async function updateInvoiceByIdHandler(
  request: FastifyRequest<{
    Params: {
      id: string
    }
    Body: InvoiceUpdate
  }>,
  reply: FastifyReply,
) {
  const {id} = request.params
  const payload = request.body

  if (!id) reply.code(500).send({msg: 'No ID provided'})

  try {
    const invoice = await updateInvoiceByID(+id, payload)
    return reply.code(200).send(invoice)
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}
