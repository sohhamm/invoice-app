import { apiAxios } from '@/configs/axios'
import type { InvoiceStatus, IInvoice, IAddress, IItem } from '@/types'

export interface CreateInvoicePayload {
  description: string
  paymentTerms: number
  clientName: string
  clientEmail: string
  senderAddress: IAddress
  clientAddress: IAddress
  items: Omit<IItem, 'total'>[]
  isDraft?: boolean
}

export interface UpdateInvoicePayload extends Omit<CreateInvoicePayload, 'isDraft'> {
  // All fields are required for updates
}

export class InvoiceService {
  async getAllInvoices(status?: InvoiceStatus): Promise<IInvoice[]> {
    const params = status ? { status } : {}
    const res = await apiAxios.get('/invoices', { params })
    return res.data
  }

  async getInvoiceById(id: string): Promise<IInvoice> {
    const res = await apiAxios.get(`/invoices/${id}`)
    return res.data
  }

  async createInvoice(data: CreateInvoicePayload): Promise<IInvoice> {
    const res = await apiAxios.post('/invoices', data)
    return res.data
  }

  async updateInvoice(id: string, data: UpdateInvoicePayload): Promise<IInvoice> {
    const res = await apiAxios.put(`/invoices/${id}`, data)
    return res.data
  }

  async markInvoiceAsPaid(id: string): Promise<IInvoice> {
    const res = await apiAxios.patch(`/invoices/${id}/mark-paid`)
    return res.data
  }

  async deleteInvoice(id: string): Promise<void> {
    await apiAxios.delete(`/invoices/${id}`)
  }
}