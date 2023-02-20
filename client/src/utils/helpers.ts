export const currencyFormatter = ({amount, currency = 'GBP'}: {amount: number; currency?: any}) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: isFloat(amount) ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount)

const isFloat = (value: any) => {
  if (typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value)) {
    return true
  }

  return false
}
