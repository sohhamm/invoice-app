import {
  UpdateInvoiceInput,
  UpdateAddressInput,
  UpdateItemInput,
} from '../modules/invoice/invoice.schema'

export type InvoiceStatus = 'DRAFT' | 'PAID' | 'PENDING'

export type InvoiceUpdate = {
  invoice: UpdateInvoiceInput
  senderAddress: UpdateAddressInput
  clientAddress: UpdateAddressInput
  items: UpdateItemInput[]
}
