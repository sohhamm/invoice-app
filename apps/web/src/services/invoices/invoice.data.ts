import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { InvoiceService, CreateInvoicePayload, UpdateInvoicePayload } from './invoice.service'
import { InvoiceStatus, IInvoice } from '@/types'

const svc = new InvoiceService()

export const QUERY_KEYS = {
  invoices: ['invoices'] as const,
  invoice: (id: string) => ['invoices', id] as const,
  invoicesByStatus: (status?: InvoiceStatus) => ['invoices', { status }] as const,
}

// Query hooks
export const useGetInvoices = (status?: InvoiceStatus) => {
  const queryKey = status ? QUERY_KEYS.invoicesByStatus(status) : QUERY_KEYS.invoices
  
  const query = useQuery({
    queryKey,
    queryFn: () => svc.getAllInvoices(status),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    invoices: query.data || [],
    fetchingInvoices: query.isLoading,
    invoicesError: query.error,
    refetchInvoices: query.refetch,
    ...query,
  }
}

export const useGetInvoiceById = (id: string, enabled: boolean = true) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.invoice(id),
    queryFn: () => svc.getInvoiceById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    invoice: query.data,
    fetchingInvoice: query.isLoading,
    invoiceError: query.error,
    refetchInvoice: query.refetch,
    ...query,
  }
}

// Mutation hooks
export const useCreateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateInvoicePayload) => svc.createInvoice(data),
    onSuccess: (newInvoice: IInvoice) => {
      // Invalidate and refetch invoices
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices })
      
      // Add the new invoice to the cache
      queryClient.setQueryData(QUERY_KEYS.invoice(newInvoice.id), newInvoice)
    },
  })
}

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoicePayload }) => 
      svc.updateInvoice(id, data),
    onSuccess: (updatedInvoice: IInvoice) => {
      // Update the specific invoice in the cache
      queryClient.setQueryData(QUERY_KEYS.invoice(updatedInvoice.id), updatedInvoice)
      
      // Invalidate the invoices list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices })
    },
  })
}

export const useMarkInvoiceAsPaid = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => svc.markInvoiceAsPaid(id),
    onSuccess: (updatedInvoice: IInvoice) => {
      // Update the specific invoice in the cache
      queryClient.setQueryData(QUERY_KEYS.invoice(updatedInvoice.id), updatedInvoice)
      
      // Invalidate the invoices list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices })
    },
  })
}

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => svc.deleteInvoice(id),
    onSuccess: (_, deletedId: string) => {
      // Remove the invoice from the cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.invoice(deletedId) })
      
      // Invalidate the invoices list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices })
    },
  })
}

// Optimistic update hooks for better UX
export const useOptimisticStatusUpdate = () => {
  const queryClient = useQueryClient()

  const updateInvoiceStatus = (id: string, newStatus: InvoiceStatus) => {
    // Optimistically update the cache
    queryClient.setQueryData(QUERY_KEYS.invoice(id), (oldData: IInvoice | undefined) => {
      if (!oldData) return oldData
      return { ...oldData, status: newStatus }
    })

    // Also update in the invoices list
    queryClient.setQueryData(QUERY_KEYS.invoices, (oldData: IInvoice[] | undefined) => {
      if (!oldData) return oldData
      return oldData.map(invoice => 
        invoice.id === id ? { ...invoice, status: newStatus } : invoice
      )
    })
  }

  return { updateInvoiceStatus }
}

// Custom hook for invoice statistics
export const useInvoiceStats = () => {
  const { invoices, fetchingInvoices } = useGetInvoices()

  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paidAmount: invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0),
    pendingAmount: invoices
      .filter(inv => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.total, 0),
  }

  return {
    stats,
    isLoading: fetchingInvoices,
  }
}