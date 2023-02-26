import {
  UpdateInvoiceInput,
  UpdateAddressInput,
  UpdateItemInput,
} from '../modules/invoice/invoice.schema'

export type InvoiceStatus = 'DRAFT' | 'PAID' | 'PAID'

export type InvoiceUpdate = {
  invoice: UpdateInvoiceInput
  senderAddress: UpdateAddressInput
  clientAddress: UpdateAddressInput
  items: UpdateItemInput[]
}
