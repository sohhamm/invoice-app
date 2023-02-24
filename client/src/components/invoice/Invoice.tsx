import clsx from 'clsx'
import Status from '../status'
import classes from './invoice.module.css'
import {format} from 'date-fns'
import {HiChevronRight} from 'react-icons/hi2'
import {Link} from 'react-router-dom'
import {currencyFormatter, GET_INVOICE_DETAILS} from '@/utils'
import {useMobile} from '@/utils/hooks/use-media-query'
import type {IInvoice} from '@/types'

interface InvoiceProps {
  invoice: IInvoice
}

export default function Invoice({invoice}: InvoiceProps) {
  const {isMobile} = useMobile()

  const due = format(new Date(invoice.paymentDue), 'dd MMM yyyy')
  const price = currencyFormatter({amount: invoice.total})

  return (
    <Link to={GET_INVOICE_DETAILS(invoice.id)}>
      {!isMobile ? (
        <div className={clsx(classes.box, 'card')}>
          <div className={classes.leftBox}>
            <div className={classes.id}>
              <span>#</span>
              {invoice.id}
            </div>

            <div className={classes.due}>Due {due}</div>

            <div className={classes.client}>{invoice.clientName}</div>
          </div>

          <div className={classes.rightBox}>
            <div className={classes.price}>{price}</div>

            <div className={classes.flexer}>
              <Status invoice={invoice} />

              <HiChevronRight color='#7C5DFA' size={12} strokeWidth={3} />
            </div>
          </div>
        </div>
      ) : (
        <div className={clsx(classes.box, 'card')}>
          <div className={classes.leftBox}>
            <div className={classes.id}>
              <span>#</span>
              {invoice.id}
            </div>
            <div>
              <div className={classes.due}>Due {due}</div>
              <div className={classes.price}>{price}</div>
            </div>
          </div>

          <div className={classes.rightBox}>
            <div className={classes.client}>{invoice.clientName}</div>

            <Status invoice={invoice} />
          </div>
        </div>
      )}
    </Link>
  )
}
