import {apiAxios} from '@/configs/axios'
import type {InvoiceStatus} from '@/types'

export class InvoiceService {
  async getAllInvoices(status?: InvoiceStatus) {
    const params = {
      status: status ?? undefined,
    }
    const res = await apiAxios.get('/invoices', {params})
    return res.data
  }
}
