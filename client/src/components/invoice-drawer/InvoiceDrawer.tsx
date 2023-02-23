import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import Button from '@/components/ui/button'
import classes from './invoice-drawer.module.css'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import {MdDelete} from 'react-icons/md'
import {invoiceSchema} from './utils/schema'
import {InvoiceFormActionType, InvoiceFormData} from '@/types'

type InvoiceDrawerProps =
  | {
      invoice?: any
      handleEditInvoice?: any
      handleNewInvoice: any
      handleDraftInvoice: any
      isEdit?: boolean
    }
  | {
      invoice?: any
      handleEditInvoice: any
      handleNewInvoice?: any
      handleDraftInvoice?: any
      isEdit?: boolean
    }

export default function InvoiceDrawer({
  invoice,
  handleEditInvoice,
  handleNewInvoice,
  handleDraftInvoice,
  isEdit = false,
}: InvoiceDrawerProps) {
  const [open, setOpen] = React.useState(false)

  const [tempItems, setTempItems] = React.useState(invoice?.items)

  const defaultValues: InvoiceFormData = {
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
    formState: {errors},
    getValues,
    setValue,
  } = useForm<InvoiceFormData>({resolver: yupResolver(invoiceSchema), defaultValues})

  const onSubmit = async (data: InvoiceFormData, action: InvoiceFormActionType) => {
    console.log(data, 'data')
    const payload = data

    if (action === InvoiceFormActionType.EDIT) {
      await handleEditInvoice(payload)
    }
    if (action === InvoiceFormActionType.NEW) {
      await handleNewInvoice(payload)
    }
    if (action === InvoiceFormActionType.DRAFT) {
      await handleDraftInvoice(payload)
    }
    setOpen(false)
  }

  const handleDeleteItem = (idx: number) => {
    setTempItems((oldState: any) => {
      const items = [...oldState]
      items.splice(idx, 1)
      setValue('items', items)
      return items
    })
  }

  const handleAddNewItem = () => {
    const items = [
      ...tempItems,
      {
        name: '',
        quantity: '',
        price: '',
        total: '',
      },
    ]
    setTempItems(items)
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
          <form>
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
              {tempItems?.map((item: any, idx: number) => (
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

            {isEdit ? (
              <div className={clsx(classes.footer, classes.editFooter)}>
                <Dialog.Close asChild>
                  <div>
                    <Button variant='edit'>Cancel</Button>
                  </div>
                </Dialog.Close>

                <Dialog.Close asChild>
                  <div>
                    <Button
                      hasAddIcon={false}
                      onClick={handleSubmit(data => onSubmit(data, InvoiceFormActionType.EDIT))}
                    >
                      Save changes
                    </Button>
                  </div>
                </Dialog.Close>
              </div>
            ) : (
              <div className={clsx(classes.footer, classes.newFooter)}>
                <Button variant='edit' overrideStyles={{width: '97px'}}>
                  Discard
                </Button>
                <div className={classes.newFooterGroup}>
                  <Dialog.Close asChild>
                    <div>
                      <Button
                        variant='draft'
                        onClick={handleSubmit(data => onSubmit(data, InvoiceFormActionType.DRAFT))}
                      >
                        Save as Draft
                      </Button>
                    </div>
                  </Dialog.Close>

                  <Dialog.Close asChild>
                    <div>
                      <Button
                        hasAddIcon={false}
                        onClick={handleSubmit(data => onSubmit(data, InvoiceFormActionType.NEW))}
                      >
                        Save & Send
                      </Button>
                    </div>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
