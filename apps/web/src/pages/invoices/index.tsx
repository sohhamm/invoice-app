import * as React from 'react'
import Invoice from '@/components/invoice'
import InvoiceFilter from '@/components/invoice-filter'
import InvoiceDrawer from '@/components/invoice-drawer'
import empty from '@/assets/empty-invoice.svg'
import classes from './styles.module.css'
import {useMobile} from '@/utils/hooks/use-media-query'
import type {IInvoice, Option} from '@/types'
import invoices from '../../../data.json'
import {useGetInvoices} from '@/services/invoices/invoice.data'
// const invoices: any = []

export default function Invoices() {
  const [opts, setOpts] = React.useState<Option>({
    draft: false,
    pending: false,
    paid: false,
  })
  const {isMobile} = useMobile()

  const {invoices: _in, fetchingInvoices} = useGetInvoices()

  // console.log(_in)

  const handleNewInvoice = (payload: any) => {}
  const handleDraftInvoice = (payload: any) => {}

  return (
    <div>
      <div className={classes.header}>
        <div>
          <h1>Invoices</h1>
          <p>{getFilteredText(invoices, opts)}</p>
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
        {!fetchingInvoices && !invoices.length ? (
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
          invoices.map((invoice: IInvoice) => <Invoice key={invoice.id} invoice={invoice} />)
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
