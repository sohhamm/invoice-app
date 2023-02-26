import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

// user input
// const invoiceInput ={}
// generated
export const invoiceGenerated = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// CREATE, UPDATE
const createInvoiceSchema = z.object({
  senderAddressID: z.number(),
  clientAddressID: z.number(),
  clientName: z.string(),
  clientEmail: z.string().email('Invalid email provided'),
  paymentTerms: z.number(),
  description: z.string(),
  items: z.array(z.string()),
})

const createInvoiceResponseSchema = z.object({})

// READ
const getInvoiceSchema = z.object({})

const getInvoicesSchema = z.array(getInvoiceSchema)

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>

export const {schemas: invoiceSchema, $ref} = buildJsonSchemas({
  createInvoiceSchema,
  createInvoiceResponseSchema,
  getInvoiceSchema,
  getInvoicesSchema,
})
