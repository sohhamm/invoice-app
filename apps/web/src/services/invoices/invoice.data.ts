import {QueryKey, useQuery} from '@tanstack/react-query'
import {InvoiceService} from './invoice.service'
import {InvoiceStatus} from '@/types'
import {apiAxios} from '@/configs/axios'

const svc = new InvoiceService()

export const useGetInvoices = (status?: InvoiceStatus) => {
  //   const resp = useQuery({queryKey: ['invoices'], queryFn: () => svc.getAllInvoices(status)})
  const resp = useQuery({
    queryKey: ['invoices'],
    queryFn: () => svc.getAllInvoices(status),
    enabled: true,
  })

  //   console.log({resp})

  return {invoices: resp.data, fetchingInvoices: resp.isLoading, ...resp}
}
