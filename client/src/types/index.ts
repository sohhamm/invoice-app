export type test = string | number

export type Option = {
  draft: boolean
  pending: boolean
  paid: boolean
}

export interface IInvoice {
  id: string
  createdAt: string
  paymentDue: string
  description: string
  paymentTerms: number
  clientName: string
  clientEmail: string
  status: string
  senderAddress: IAddress
  clientAddress: IAddress
  items: IItem[]
  total: number
}

export interface IAddress {
  street: string
  city: string
  postCode: string
  country: string
}

export interface IItem {
  name: string
  quantity: number
  price: number
  total: number
}
