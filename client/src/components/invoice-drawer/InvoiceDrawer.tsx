import * as React from 'react'
import * as yup from 'yup'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import Button from '@/components/ui/button'
import classes from './invoice-drawer.module.css'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'

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

    createdAt: yup.string().required(),
    paymentDue: yup.string().required(),

    paymentTerms: yup.number().required(),

    description: yup.string().required(),
  })
  .required()

type FormData = yup.InferType<typeof schema>

interface InvoiceDrawerProps {
  invoice: any
  handleEditInvoice?: any
  isEdit?: boolean
}

export default function InvoiceDrawer({
  invoice,
  handleEditInvoice,
  isEdit = false,
}: InvoiceDrawerProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<FormData>({resolver: yupResolver(schema)})

  const onSubmit = (data: FormData) => {
    console.log(data)

    const payload = data
    handleEditInvoice(payload)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div>
          <Button variant='edit'>Edit</Button>
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

            <div className={classes.inlineFlex}>
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

            <div className={classes.inlineFlex} style={{marginTop: '48px', marginBottom: '32px'}}>
              <div>
                <label className={classes.Label} htmlFor='createdAt'>
                  Invoice Date
                </label>
                <input
                  className={clsx(classes.Input, classes.mdInput)}
                  id='createdAt'
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
            <input className={classes.Input} id='description' {...register('description')} />

            <p className={classes.sectionLg}>Item List</p>
          </form>

          <div className={classes.footer}>
            <Dialog.Close asChild>
              <div>
                <Button variant='edit'>Cancel</Button>
              </div>
            </Dialog.Close>
            <Dialog.Close asChild>
              <div>
                <Button hasAddIcon={false}>Save changes</Button>
              </div>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
