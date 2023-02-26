import {FastifyInstance} from 'fastify'
import {$ref} from './invoice.schema'
import {createInvoiceHandler} from './invoice.controller'

export default async function invoiceRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      // @ts-ignore
      onRequest: [server.authenticate],
      schema: {
        body: $ref('createInvoiceSchema'),
        // response: {
        //   200: $ref('createInvoiceResponseSchema'),
        // },
      },
    },
    createInvoiceHandler,
  )

  //   server.get(
  //     '/',
  //     {
  //       // @ts-ignore
  //       onRequest: [server.authenticate],
  //     },
  //     getAllInvoicesHandler,
  //   )

  //   server.get(
  //     '/:id',
  //     {
  //       // @ts-ignore
  //       onRequest: [server.authenticate],
  //       schema: {
  //         params: {
  //           id: {type: 'string'},
  //         },
  //       },
  //     },
  //     getAllInvoiceHandler,
  //   )
}
