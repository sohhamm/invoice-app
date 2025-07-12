import * as React from 'react'
import Invoice from '@/components/invoice'
import InvoiceFilter from '@/components/invoice-filter'
import InvoiceDrawer from '@/components/invoice-drawer'
import empty from '@/assets/empty-invoice.svg'
import classes from './styles.module.css'
import {useMobile} from '@/utils/hooks/use-media-query'
import type {IInvoice, Option, InvoiceStatus} from '@/types'
import {useGetInvoices, useCreateInvoice} from '@/services/invoices/invoice.data'

export default function Invoices() {
  const [opts, setOpts] = React.useState<Option>({
    draft: false,
    pending: false,
    paid: false,
  })
  const {isMobile} = useMobile()

  // Get the appropriate status filter based on selected options
  const getStatusFilter = (): InvoiceStatus | undefined => {
    const activeOptions = Object.entries(opts).filter(([_, value]) => value).map(([key]) => key)
    if (activeOptions.length === 1) {
      return activeOptions[0] as InvoiceStatus
    }
    return undefined // Return all if multiple or none selected
  }

  const statusFilter = getStatusFilter()
  const {invoices, fetchingInvoices} = useGetInvoices(statusFilter)
  const createInvoiceMutation = useCreateInvoice()

  // Filter invoices based on multiple selections when no single status filter applies
  const filteredInvoices = React.useMemo(() => {
    if (statusFilter) return invoices // Already filtered by API
    
    if (!opts.draft && !opts.pending && !opts.paid) return invoices // Show all
    
    return invoices.filter(invoice => {
      if (opts.draft && invoice.status === 'draft') return true
      if (opts.pending && invoice.status === 'pending') return true
      if (opts.paid && invoice.status === 'paid') return true
      return false
    })
  }, [invoices, opts, statusFilter])

  const transformFormToPayload = (formData: any, isDraft: boolean) => {
    return {
      description: formData.description,
      paymentTerms: Number(formData.paymentTerms),
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      senderAddress: {
        street: formData.street,
        city: formData.city,
        postCode: formData.postCode,
        country: formData.country,
      },
      clientAddress: {
        street: formData.clientStreet,
        city: formData.clientCity,
        postCode: formData.clientPostCode,
        country: formData.clientCountry,
      },
      items: formData.items.map((item: any) => ({
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      isDraft,
    }
  }

  const handleNewInvoice = async (formData: any) => {
    const payload = transformFormToPayload(formData, false)
    createInvoiceMutation.mutate(payload)
  }
  
  const handleDraftInvoice = async (formData: any) => {
    const payload = transformFormToPayload(formData, true)
    createInvoiceMutation.mutate(payload)
  }

  return (
    <div>
      <div className={classes.header}>
        <div>
          <h1>Invoices</h1>
          <p>{getFilteredText(filteredInvoices, opts)}</p>
        </div>

        <div className={classes.ctaBox}>
          <InvoiceFilter opts={opts} setOpts={setOpts} />

          <InvoiceDrawer
            handleNewInvoice={handleNewInvoice}
            handleDraftInvoice={handleDraftInvoice}
          />
        </div>
      </div>

      <div className={classes.body}>
        {fetchingInvoices ? (
          <div className={classes.emptyBox}>
            <p>Loading invoices...</p>
          </div>
        ) : !filteredInvoices.length ? (
          <div className={classes.emptyBox}>
            <img src={empty} alt='Empty' />

            <h2>There is nothing here</h2>
            <p>
              Create an invoice by clicking the <br />{' '}
              <span>{isMobile ? 'New' : 'New Invoice'} </span>
              button and get started
            </p>
          </div>
        ) : (
          filteredInvoices.map((invoice: IInvoice) => <Invoice key={invoice.id} invoice={invoice} />)
        )}
      </div>
    </div>
  )
}

const getFilteredText = (data: any, opts: Option) => {
  if (!data) return ''
  if (data.length === 0) return 'No invoices'

  if (!opts.draft && !opts.pending && !opts.paid) return `There are ${data.length} total invoices`
  if (opts.draft && opts.pending && opts.paid) return `There are ${data.length} total invoices`

  if (opts.draft && !opts.pending && !opts.paid) return `There are ${data.length} drafted invoices`
  if (!opts.draft && opts.pending && !opts.paid) return `There are ${data.length} pending invoices`
  if (!opts.draft && !opts.pending && opts.paid) return `There are ${data.length} paid invoices`

  if (opts.draft && opts.pending && !opts.paid)
    return `There are ${data.length} drafted & pending invoices`
  if (!opts.draft && opts.pending && opts.paid)
    return `There are ${data.length} pending & paid invoices`
  if (opts.draft && !opts.pending && opts.paid)
    return `There are ${data.length} drafted & paid invoices`
}
