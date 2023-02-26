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
  items: z.array(z.string()).optional(),
})

const createInvoiceResponseSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number(),
  senderAddress: addressInput,
  senderAddressId: z.number(),
  clientAddress: addressInput,
  clientAddressId: z.number(),
  clientName: z.string(),
  clientEmail: z.string().email('Invalid email provided'),
  invoiceDate: z.date(),
  paymentTerms: z.number(),
  description: z.string(),
  items: z.array(z.string()).optional(),
})

// READ
// const getInvoiceSchema = z.object({})

// const getInvoicesSchema = z.array(getInvoiceSchema)

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>

export const {schemas: invoiceSchema, $ref} = buildJsonSchemas(
  {
    createInvoiceSchema,
    createInvoiceResponseSchema,
    // getInvoiceSchema,
    // getInvoicesSchema,
  },
  {$id: 'InvoiceSchema'},
)
