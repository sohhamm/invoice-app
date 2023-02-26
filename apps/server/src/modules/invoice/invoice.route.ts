import {FastifyInstance} from 'fastify'
import {$ref} from './invoice.schema'
import {
  createInvoiceHandler,
  getAllInvoicesHandler,
  getInvoiceByIdHandler,
  updateInvoiceByIdHandler,
} from './invoice.controller'

export default async function invoiceRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      // @ts-ignore
      onRequest: [server.authenticate],
      schema: {
        body: $ref('createInvoiceSchema'),
      },
    },
    createInvoiceHandler,
  )

  server.get(
    '/',
    {
      // @ts-ignore
      onRequest: [server.authenticate],
    },
    getAllInvoicesHandler,
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
    getInvoiceByIdHandler,
  )

  server.put(
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
    updateInvoiceByIdHandler,
  )
}
