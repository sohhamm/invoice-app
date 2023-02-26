import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

// user input
// const invoiceInput ={}
// generated

const addressInput = z.object({
  street: z.string(),
  city: z.string(),
  postCode: z.string(),
  country: z.string(),
})

const itemInput = z.object({
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
})

// const addressGenerated = z.object({
//   id: z.number(),
// })

export const invoiceGenerated = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// CREATE, UPDATE
const createInvoiceSchema = z.object({
  userId: z.number(),
  senderAddress: addressInput,
  clientAddress: addressInput,
  clientName: z.string(),
  clientEmail: z.string().email('Invalid email provided'),
  invoiceDate: z.date(),
  paymentTerms: z.number(),
  description: z.string(),
  items: z.array(itemInput).optional(),
})

// const createInvoiceResponseSchema = z.object({
//   data: z.object({invoice_id: z.number()}),
//   status: z.string(),
//   error: z.boolean(),
// })

// READ
// const getInvoiceSchema = z.object({})

// const getInvoicesSchema = z.array(getInvoiceSchema)

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>

export const {schemas: invoiceSchema, $ref} = buildJsonSchemas(
  {
    createInvoiceSchema,
    // createInvoiceResponseSchema,
    // getInvoiceSchema,
    // getInvoicesSchema,
  },
  {$id: 'InvoiceSchema'},
)
