import {CreateInvoiceInput} from './invoice.schema'
import {createInvoice} from './invoice.service'
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

    return reply.code(201).send(invoice)
  } catch (err) {
    console.error(err)
    return reply.code(500).send(err)
  }
}
