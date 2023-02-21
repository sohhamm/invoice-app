import * as React from 'react'
import clsx from 'clsx'
import Status from '@/components/status'
import DeleteConfirm from '@/components/delete-confirm'
import Button from '@/components/ui/button'
import classes from './styles.module.css'
import {format} from 'date-fns'
import {Link, useParams} from 'react-router-dom'
import {HiChevronLeft} from 'react-icons/hi2'
import {INVOICES, currencyFormatter} from '@/utils'
import d from '../../../data.json'

export default function InvoiceDetails() {
  const {id} = useParams()

  const invoice: any = d.find(i => i.id === id)

  const onDelete = () => {}

  const handlePaid = () => {}

  const handleEdit = () => {}

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
          <Button variant='edit' onClick={handleEdit}>
            Edit
          </Button>
          <DeleteConfirm onDelete={onDelete} invoiceId={invoice.id} />
          <Button hasAddIcon={false} onClick={handlePaid}>
            Mark as Paid
          </Button>
        </div>
      </div>

      <div className={clsx(classes.details, 'card')}>
        <div className={classes.top}>
          <div className={classes.topLeft}>
            <h4>
              <span>#</span>
              {invoice.id}
            </h4>
            <p>{invoice.description}</p>
          </div>

          <div className={classes.topRight}>
            <div>{invoice.senderAddress.street}</div>
            <div>{invoice.senderAddress.city}</div>
            <div>{invoice.senderAddress.postCode}</div>
            <div>{invoice.senderAddress.country}</div>
          </div>
        </div>

        <div className={classes.middle}>
          <div>
            <div className={classes.middleLeftTop}>
              <p className={classes.middleLeftTopTitle}>Invoice Date</p>
              <p className={classes.middleLeftTopDate}>
                {format(new Date(invoice.createdAt), 'dd MMM yyyy')}
              </p>
            </div>

            <div>
              <p className={classes.middleLeftBottomTitle}>Payment Due</p>
              <p className={classes.middleLeftBottomDate}>
                {format(new Date(invoice.paymentDue), 'dd MMM yyyy')}
              </p>
            </div>
          </div>

          <div className={classes.middleCenter}>
            <p className={classes.middleCenterLabel}>Bill To</p>
            <p className={classes.clientName}>{invoice.clientName}</p>
            <p className={classes.clientAddress}>
              <div>{invoice.clientAddress.street}</div>
              <div>{invoice.clientAddress.city}</div>
              <div>{invoice.clientAddress.postCode}</div>
              <div>{invoice.clientAddress.country}</div>
            </p>
          </div>

          <div>
            <p className={classes.middleRightLabel}>Sent To</p>
            <p className={classes.clientEmail}>{invoice.clientEmail}</p>
          </div>
        </div>

        <table className={classes.items}>
          <thead>
            <tr className={classes.headerRow}>
              <th className={classes.itemLabel} style={{textAlign: 'start'}}>
                Item Name
              </th>
              <th className={classes.itemLabel} style={{textAlign: 'center'}}>
                QTY.
              </th>
              <th className={classes.itemLabel}>Price</th>
              <th className={classes.itemLabel}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any) => (
              <tr className={classes.item}>
                <td className={classes.itemBody} style={{textAlign: 'start'}}>
                  {item.name}
                </td>
                <td className={classes.itemBody} style={{textAlign: 'center', color: '#7E88C3'}}>
                  {item.quantity}
                </td>
                <td className={classes.itemBody} style={{color: '#7E88C3'}}>
                  {currencyFormatter({amount: item.price})}
                </td>
                <td className={classes.itemBody}> {currencyFormatter({amount: item.total})}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={classes.priceSummary}>
          <p>Amount Due</p>

          <h1>{currencyFormatter({amount: getTotalPrice(invoice.items)})}</h1>
        </div>
      </div>
    </div>
  )
}

const getTotalPrice = (items: any[]) => {
  return items.reduce((acc, curr) => (acc += curr.total), 0)
}
