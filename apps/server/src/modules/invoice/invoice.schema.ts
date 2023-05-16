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
  senderAddress: addressInput,
  clientAddress: addressInput,
  clientName: z.string(),
  clientEmail: z.string().email('Invalid email provided'),
  invoiceDate: z.date(),
  paymentTerms: z.number(),
  description: z.string(),
  items: z.array(itemInput).optional(),
})

const updateInvoiceSchema = z.object({
  id: z.number(),
  clientName: z.string(),
  clientEmail: z.string().email('Invalid email provided'),
  invoiceDate: z.date(),
  paymentTerms: z.number(),
  description: z.string(),
  status: z.string(),
})

const updateAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postCode: z.string(),
  country: z.string(),
})

const updateItemSchema = z.object({
  invoiceId: z.number(),
  itemId: z.number().optional(),
  quantity: z.number(),
  item: z.object({
    id: z.number().optional(),
    name: z.string(),
    price: z.number(),
  }),
})

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>

export const {schemas: invoiceSchema, $ref} = buildJsonSchemas(
  {
    createInvoiceSchema,
  },
  {$id: 'InvoiceSchema'},
)
