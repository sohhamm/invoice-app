import classes from './invoices.module.css'
import Button from '../../components/ui/button'
import InvoiceFilter from '@/components/invoice-filter/InvoiceFilter'

export default function Invoices() {
  const invoiceCount = 7
  return (
    <div>
      <div className={classes.header}>
        <div>
          <h1>Invoices</h1>
          <p>There are {invoiceCount}total invoices</p>
        </div>

        <div className={classes.ctaBox}>
          <InvoiceFilter />
          <Button hasAddIcon>New Invoice</Button>
        </div>
      </div>
    </div>
  )
}
