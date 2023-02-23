import * as React from 'react'
import Button from '@/components/ui/button'
import Invoice from '@/components/invoice'
import InvoiceFilter from '@/components/invoice-filter'
import empty from '@/assets/empty-invoice.svg'
import classes from './styles.module.css'
import type {IInvoice, Option} from '@/types'

import invoices from '../../../data.json'
import InvoiceDrawer from '@/components/invoice-drawer/InvoiceDrawer'

// const invoices: any = []

export default function Invoices() {
  const [opts, setOpts] = React.useState<Option>({
    draft: false,
    pending: false,
    paid: false,
  })

  const fetchingInvoices = false

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
              Create an invoice by clicking the <br /> <span>New Invoice </span>
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

// const d = [
//   {
//     id: 'RT3080',
//     createdAt: '2021-08-18',
//     paymentDue: '2021-08-19',
//     description: 'Re-branding',
//     paymentTerms: 1,
//     clientName: 'Jensen Huang',
//     clientEmail: 'jensenh@mail.com',
//     status: 'paid',
//     senderAddress: {
//       street: '19 Union Terrace',
//       city: 'London',
//       postCode: 'E1 3EZ',
//       country: 'United Kingdom',
//     },
//     clientAddress: {
//       street: '106 Kendell Street',
//       city: 'Sharrington',
//       postCode: 'NR24 5WQ',
//       country: 'United Kingdom',
//     },
//     items: [
//       {
//         name: 'Brand Guidelines',
//         quantity: 1,
//         price: 1800.9,
//         total: 1800.9,
//       },
//     ],
//     total: 1800.9,
//   },
//   {
//     id: 'XM9141',
//     createdAt: '2021-08-21',
//     paymentDue: '2021-09-20',
//     description: 'Graphic Design',
//     paymentTerms: 30,
//     clientName: 'Alex Grim',
//     clientEmail: 'alexgrim@mail.com',
//     status: 'pending',
//     senderAddress: {
//       street: '19 Union Terrace',
//       city: 'London',
//       postCode: 'E1 3EZ',
//       country: 'United Kingdom',
//     },
//     clientAddress: {
//       street: '84 Church Way',
//       city: 'Bradford',
//       postCode: 'BD1 9PB',
//       country: 'United Kingdom',
//     },
//     items: [
//       {
//         name: 'Banner Design',
//         quantity: 1,
//         price: 156.0,
//         total: 156.0,
//       },
//       {
//         name: 'Email Design',
//         quantity: 2,
//         price: 200.0,
//         total: 400.0,
//       },
//     ],
//     total: 556.0,
//   },
// ]
