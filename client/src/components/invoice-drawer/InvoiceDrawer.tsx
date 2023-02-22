import * as React from 'react'
import * as yup from 'yup'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import Button from '@/components/ui/button'
import classes from './invoice-drawer.module.css'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import {MdDelete} from 'react-icons/md'

const schema = yup
  .object({
    street: yup.string().required(),
    city: yup.string().required(),
    postCode: yup.string().required(),
    country: yup.string().required(),
    clientName: yup.string().required(),
    clientEmail: yup.string().email().required(),

    clientStreet: yup.string().required(),
    clientCity: yup.string().required(),
    clientPostCode: yup.string().required(),
    clientCountry: yup.string().required(),

    createdAt: yup.date().required(),
    paymentDue: yup.string().required(),

    paymentTerms: yup.number().required(),

    description: yup.string().required(),

    items: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string(),
          quantity: yup.string(),
          price: yup.string(),
          total: yup.string(),
        }),
      )
      .required(),
  })
  .required()

type FormData = yup.InferType<typeof schema>

interface InvoiceDrawerProps {
  invoice?: any
  handleEditInvoice?: any
  isEdit?: boolean
}

export default function InvoiceDrawer({
  invoice,
  handleEditInvoice,
  isEdit = false,
}: InvoiceDrawerProps) {
  const [open, setOpen] = React.useState(false)

  const defaultValues: FormData = {
    street: invoice?.senderAddress.street || '',
    city: invoice?.senderAddress.city || '',
    postCode: invoice?.senderAddress.postCode || '',
    country: invoice?.senderAddress.country || '',
    clientName: invoice?.clientName || '',
    clientEmail: invoice?.clientEmail || '',
    clientStreet: invoice?.clientAddress.street || '',
    clientCity: invoice?.clientAddress.city || '',
    clientPostCode: invoice?.clientAddress.postCode || '',
    clientCountry: invoice?.clientAddress.country || '',
    createdAt: invoice?.createdAt ? new Date(invoice?.createdAt) : new Date(),
    paymentDue: invoice?.paymentDue ? new Date(invoice?.paymentDue).toString() : '',
    paymentTerms: invoice?.paymentTerms || '',
    description: invoice?.description || '',
    items: invoice?.items || [],
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
    getValues,
    setValue,
  } = useForm<FormData>({resolver: yupResolver(schema), defaultValues})

  console.log(getValues)

  const onSubmit = (data: FormData) => {
    console.log(data)

    const payload = data
    handleEditInvoice(payload)
    setOpen(false)
  }

  const handleDeleteItem = (idx: number) => {
    const items = [...getValues('items')]

    const newItems = items.splice(idx, 1)

    setValue('items', newItems)
  }

  const handleAddNewItem = () => {
    const items = [
      ...getValues('items'),
      {
        name: '',
        quantity: '',
        price: '',
        total: '',
      },
    ]

    setValue('items', items)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div>
          {isEdit ? <Button variant='edit'>Edit</Button> : <Button hasAddIcon>New Invoice</Button>}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={classes.DialogOverlay} />

        <Dialog.Content className={classes.DialogContent}>
          <Dialog.Title className={classes.DialogTitle}>
            {isEdit ? (
              <>
                Edit <span>#</span>
                {invoice.id}
              </>
            ) : (
              'New Invoice'
            )}
          </Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className={classes.section}>Bill From</p>

            <label className={classes.Label} htmlFor='street'>
              Street
            </label>
            <input className={classes.Input} id='street' {...register('street')} />
            <p>{errors.street?.message}</p>

            <div className={classes.inlineFlex} style={{marginBottom: '24px'}}>
              <div>
                <label className={classes.Label} htmlFor='city'>
                  City
                </label>
                <input
                  className={clsx(classes.Input, classes.smallInput)}
                  id='city'
                  {...register('city')}
                />
                <p>{errors.city?.message}</p>
              </div>

              <div>
                <label className={classes.Label} htmlFor='postCode'>
                  Post code
                </label>
                <input
                  className={clsx(classes.Input, classes.smallInput)}
                  id='postCode'
                  {...register('postCode')}
                />
                <p>{errors.postCode?.message}</p>
              </div>

              <div>
                <label className={classes.Label} htmlFor='country'>
                  Country
                </label>
                <input
                  className={clsx(classes.Input, classes.smallInput)}
                  id='country'
                  {...register('country')}
                />
                <p>{errors.country?.message}</p>
              </div>
            </div>

            <p className={classes.section}>Bill To</p>

            <label className={classes.Label} htmlFor='clientName'>
              Client's Name
            </label>
            <input className={classes.Input} id='clientName' {...register('clientName')} />
            <p>{errors.clientName?.message}</p>

            <label className={classes.Label} htmlFor='clientEmail'>
              Client's Email
            </label>
            <input className={classes.Input} id='clientEmail' {...register('clientEmail')} />
            <p>{errors.clientEmail?.message}</p>

            <label className={classes.Label} htmlFor='clientStreet'>
              Street
            </label>
            <input className={classes.Input} id='clientStreet' {...register('clientStreet')} />
            <p>{errors.clientStreet?.message}</p>

            <div className={classes.inlineFlex}>
              <div>
                <label className={classes.Label} htmlFor='clientCity'>
                  City
                </label>
                <input
                  className={clsx(classes.Input, classes.smallInput)}
                  id='clientCity'
                  {...register('clientCity')}
                />
                <p>{errors.clientCity?.message}</p>
              </div>

              <div>
                <label className={classes.Label} htmlFor='clientPostCode'>
                  Post code
                </label>
                <input
                  className={clsx(classes.Input, classes.smallInput)}
                  id='clientPostCode'
                  {...register('clientPostCode')}
                />
                <p>{errors.clientPostCode?.message}</p>
              </div>

              <div>
                <label className={classes.Label} htmlFor='clientCountry'>
                  Country
                </label>
                <input
                  className={clsx(classes.Input, classes.smallInput)}
                  id='clientCountry'
                  {...register('clientCountry')}
                />
                <p>{errors.clientCountry?.message}</p>
              </div>
            </div>

            <div className={classes.inlineFlex} style={{marginTop: '24px', marginBottom: '0px'}}>
              <div>
                <label className={classes.Label} htmlFor='createdAt'>
                  Invoice Date
                </label>
                <input
                  className={clsx(classes.Input, classes.mdInput)}
                  id='createdAt'
                  type='date'
                  {...register('createdAt')}
                />
                <p>{errors.createdAt?.message}</p>
              </div>

              <div>
                <label className={classes.Label} htmlFor='paymentTerms'>
                  Payment Terms
                </label>
                <input
                  className={clsx(classes.Input, classes.mdInput)}
                  id='paymentTerms'
                  {...register('paymentTerms')}
                />
                <p>{errors.paymentTerms?.message}</p>
              </div>
            </div>

            <label className={classes.Label} htmlFor='description'>
              Project Description
            </label>
            <input
              className={classes.Input}
              id='description'
              {...register('description')}
              style={{marginBottom: '32px'}}
            />

            <p className={classes.sectionLg}>Item List</p>

            <div className={classes.itemLabels}>
              <label className={classes.Label}>Item Name</label>
              <label className={classes.Label}>Qty.</label>
              <label className={classes.Label}>Price</label>
              <label className={classes.Label}>Total</label>
            </div>

            <div className={classes.itemFields}>
              {invoice?.items?.map((item: any, idx: number) => (
                <div key={item.name + idx.toString()} className={classes.itemBox}>
                  <input
                    className={classes.Input}
                    id='name'
                    {...register(`items.${idx}.name`)}
                    style={{marginBottom: 0}}
                  />
                  <input
                    className={classes.Input}
                    id='quantity'
                    {...register(`items.${idx}.quantity`)}
                    style={{marginBottom: 0}}
                  />
                  <input
                    className={classes.Input}
                    id='price'
                    {...register(`items.${idx}.price`)}
                    style={{marginBottom: 0}}
                  />
                  <input
                    className={classes.Input}
                    id='total'
                    {...register(`items.${idx}.total`)}
                    style={{marginBottom: 0, border: 'none', color: '#888EB0', marginRight: '22px'}}
                  />

                  <MdDelete
                    color='#888EB0'
                    size={40}
                    className={classes.delIcon}
                    onClick={() => handleDeleteItem(idx)}
                  />
                </div>
              ))}
            </div>

            <Button variant='large' onClick={handleAddNewItem}>
              + Add New Item
            </Button>

            <div className={classes.footer}>
              <Dialog.Close asChild>
                <div>
                  <Button variant='edit'>Cancel</Button>
                </div>
              </Dialog.Close>

              <Dialog.Close asChild>
                <div>
                  <Button hasAddIcon={false} onClick={handleSubmit(onSubmit)}>
                    Save changes
                  </Button>
                </div>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
