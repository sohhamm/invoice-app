import * as React from 'react'
import clsx from 'clsx'
import classes from './invoice.module.css'
import {format} from 'date-fns'
import {HiChevronRight} from 'react-icons/hi2'
import {RxDotFilled} from 'react-icons/rx'
import {Link} from 'react-router-dom'
import {currencyFormatter, GET_INVOICE_DETAILS} from '@/utils'
import type {IInvoice} from '@/types'

interface InvoiceProps {
  invoice: IInvoice
}

export default function Invoice({invoice}: InvoiceProps) {
  return (
    <Link to={GET_INVOICE_DETAILS(invoice.id)}>
      <div className={classes.box}>
        <div className={classes.leftBox}>
          <div className={classes.id}>
            <span>#</span>
            {invoice.id}
          </div>

          <div className={classes.due}>
            Due {format(new Date(invoice.paymentDue), 'dd MMM yyyy')}
          </div>

          <div className={classes.client}>{invoice.clientName}</div>
        </div>

        <div className={classes.rightBox}>
          <div className={classes.price}>{currencyFormatter({amount: invoice.total})}</div>

          <div className={classes.flexer}>
            <div
              className={clsx(
                classes.tag,
                invoice.status === 'draft' && classes.tagDraft,
                invoice.status === 'pending' && classes.tagPending,
                invoice.status === 'paid' && classes.tagPaid,
              )}
            >
              <RxDotFilled size={24} />
              <span>{invoice.status}</span>
            </div>

            <HiChevronRight color='#7C5DFA' size={12} strokeWidth={3} />
          </div>
        </div>
      </div>
    </Link>
  )
}
