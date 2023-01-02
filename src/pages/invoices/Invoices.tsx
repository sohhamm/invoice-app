import classes from './invoices.module.css'

export default function Invoices() {
  const invoiceCount = 7
  return (
    <div>
      <div className={classes.header}>
        <div>
          <h1>Invoices</h1>
          <p>There are {invoiceCount}total invoices</p>
        </div>

        <div>button</div>
      </div>
    </div>
  )
}
