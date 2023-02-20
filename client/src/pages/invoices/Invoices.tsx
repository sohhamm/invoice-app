import classes from './invoices.module.css'
import Button from '../../components/ui/button'

export default function Invoices() {
  const invoiceCount = 7
  return (
    <div>
      <div className={classes.header}>
        <div>
          <h1>Invoices</h1>
          <p>There are {invoiceCount}total invoices</p>
        </div>

        <Button hasAddIcon>New Invoice</Button>
      </div>
    </div>
  )
}
