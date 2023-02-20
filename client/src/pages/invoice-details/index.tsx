import * as React from 'react'
import clsx from 'clsx'
import Status from '@/components/status'
import classes from './styles.module.css'
import {HiChevronLeft} from 'react-icons/hi2'
import {Link, useParams} from 'react-router-dom'

import d from '../../../data.json'
import Button from '@/components/ui/button'
import {INVOICES} from '@/utils'

export default function InvoiceDetails() {
  const {id} = useParams()

  const invoice: any = d.find(i => i.id === id)

  return (
    <div className={classes.box}>
      <Link to={INVOICES}>
        <div className={classes.back}>
          <HiChevronLeft color='#7C5DFA' size={12} strokeWidth={3} />
          Go back
        </div>
      </Link>

      <div className={clsx(classes.header, 'card')}>
        <div className={classes.status}>
          <p>Status</p>

          <Status invoice={invoice} />
        </div>

        <div className={classes.cta}>
          <Button variant='edit'>Edit</Button>
          <Button variant='delete'>Delete</Button>
          <Button hasAddIcon={false}>Mark as Paid</Button>
        </div>
      </div>

      <div className={classes.details}>
        <div></div>
      </div>
    </div>
  )
}
