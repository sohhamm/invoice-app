import * as React from 'react'
import clsx from 'clsx'
import classes from './status.module.css'
import {RxDotFilled} from 'react-icons/rx'
import type {IInvoice} from '../../types/index'

interface StatusProps {
  invoice: IInvoice
}

export default function Status({invoice}: StatusProps) {
  return (
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
  )
}
