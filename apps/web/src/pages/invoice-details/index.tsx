import * as React from 'react'
import clsx from 'clsx'
import InvoiceDrawer from '@/components/invoice-drawer'
import Status from '@/components/status'
import DeleteConfirm from '@/components/delete-confirm'
import Button from '@/components/ui/button'
import classes from './styles.module.css'
import {format} from 'date-fns'
import {Link, useParams} from 'react-router-dom'
import {HiChevronLeft} from 'react-icons/hi2'
import {INVOICES, currencyFormatter} from '@/utils'
import {useMobile} from '@/utils/hooks/use-media-query'
import d from '../../../data.json'

export default function InvoiceDetails() {
  const {id} = useParams()

  const {isMobile} = useMobile()

  const invoice: any = d.find(i => i.id === id)

  const onDelete = () => {}

  const handlePaid = () => {}

  const handleEditInvoice = (payload: any) => {}

  return (
    <div className={classes.box}>
      <Link to={INVOICES}>
        <BackBtn />
      </Link>

      <div className={clsx(classes.header, 'card')}>
        <div className={classes.status}>
          <p>Status</p>

          <Status invoice={invoice} />
        </div>

        {!isMobile && (
          <CTAs
            invoice={invoice}
            handleEditInvoice={handleEditInvoice}
            onDelete={onDelete}
            handlePaid={handlePaid}
          />
        )}
      </div>

      <div className={clsx(classes.details, 'card')}>
        <div className={classes.invoiceHeader}>
          <div className={classes.invoiceId}>
            <h4>
              <span>#</span>
              {invoice.id}
            </h4>
            <p>{invoice.description}</p>
          </div>

          <div className={classes.address}>
            <div>{invoice.senderAddress.street}</div>
            <div>{invoice.senderAddress.city}</div>
            <div>{invoice.senderAddress.postCode}</div>
            <div>{invoice.senderAddress.country}</div>
          </div>
        </div>

        <div className={classes.invoiceDetails}>
          <div>
            <div className={classes.invoiceDetailsDate}>
              <p className={classes.invoiceDetailsDateTitle}>Invoice Date</p>
              <p className={classes.invoiceDetailsDateValue}>
                {format(new Date(invoice.createdAt), 'dd MMM yyyy')}
              </p>
            </div>

            <div>
              <p className={classes.invoiceDetailsDue}>Payment Due</p>
              <p className={classes.invoiceDetailsDueValue}>
                {format(new Date(invoice.paymentDue), 'dd MMM yyyy')}
              </p>
            </div>
          </div>

          <div className={classes.clientAddress}>
            <p className={classes.clientAddressLabel}>Bill To</p>
            <p className={classes.clientName}>{invoice.clientName}</p>
            <div className={classes.clientAddress}>
              <div>{invoice.clientAddress.street}</div>
              <div>{invoice.clientAddress.city}</div>
              <div>{invoice.clientAddress.postCode}</div>
              <div>{invoice.clientAddress.country}</div>
            </div>
          </div>

          <div className={classes.clientEmailLabel}>
            <p className={classes.clientEmailLabel}>Sent To</p>
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
              <tr className={classes.item} key={item.name}>
                {isMobile ? (
                  <div className={classes.itemMobile}>
                    <td className={classes.itemInfo}>
                      <div>{item.name}</div>

                      <div>
                        {item.quantity} x {currencyFormatter({amount: item.price})}
                      </div>
                    </td>

                    <td className={classes.itemTotal}>{currencyFormatter({amount: item.total})}</td>
                  </div>
                ) : (
                  <>
                    <td className={classes.itemBody} style={{textAlign: 'start'}}>
                      {item.name}
                    </td>
                    <td
                      className={classes.itemBody}
                      style={{textAlign: 'center', color: '#7E88C3'}}
                    ></td>
                    <td className={classes.itemBody} style={{color: '#7E88C3'}}>
                      {currencyFormatter({amount: item.price})}
                    </td>
                    <td className={classes.itemBody}> {currencyFormatter({amount: item.total})}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className={classes.priceSummary}>
          <p>{isMobile ? 'Grand Total' : 'Amount Due'}</p>

          <h1>{currencyFormatter({amount: getTotalPrice(invoice.items)})}</h1>
        </div>
      </div>

      {isMobile && (
        <CTAs
          invoice={invoice}
          handleEditInvoice={handleEditInvoice}
          onDelete={onDelete}
          handlePaid={handlePaid}
        />
      )}
    </div>
  )
}

const getTotalPrice = (items: any[]) => {
  return items.reduce((acc, curr) => (acc += curr.total), 0)
}

function CTAs({invoice, handleEditInvoice, onDelete, handlePaid}: any) {
  return (
    <div className={classes.cta}>
      <InvoiceDrawer invoice={invoice} handleEditInvoice={handleEditInvoice} isEdit={true} />
      <DeleteConfirm onDelete={onDelete} invoiceId={invoice.id} />
      <Button hasAddIcon={false} onClick={handlePaid}>
        Mark as Paid
      </Button>
    </div>
  )
}

export function BackBtn({styles = {}}: {styles?: React.CSSProperties}) {
  return (
    <div className={classes.back} style={{...styles}}>
      <HiChevronLeft color='#7C5DFA' size={12} strokeWidth={3} />
      Go back
    </div>
  )
}
