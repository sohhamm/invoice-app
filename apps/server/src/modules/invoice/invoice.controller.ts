import {CreateInvoiceInput} from './invoice.schema'
import {createInvoice, findAllInvoices, findInvoiceByID} from './invoice.service'
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

export async function getAllInvoicesHandler(request: FastifyRequest, reply: FastifyReply) {
  // @ts-ignore
  const userId = request.user.id

  try {
    const invoices = await findAllInvoices(userId)
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
