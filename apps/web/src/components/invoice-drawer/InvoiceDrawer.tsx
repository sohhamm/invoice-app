import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import Button from '@/components/ui/button'
import classes from './invoice-drawer.module.css'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from 'react-hook-form'
import {MdDelete} from 'react-icons/md'
import {invoiceSchema} from './utils/schema'
import {InvoiceFormKey} from './utils'
import {useMobile} from '@/utils/hooks/use-media-query'
import {InvoiceFormActionType} from '@/types'
import type {InvoiceFormData} from '@/types'
import {Link} from 'react-router-dom'
import {BackBtn} from '@/pages/invoice-details'

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
  const [tempItems, setTempItems] = React.useState(invoice?.items || [])
  const {isMobile} = useMobile()

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
    formState: {errors, isValid},
    setValue,
  } = useForm<InvoiceFormData>({resolver: yupResolver(invoiceSchema), defaultValues})
  const onSubmit = async (data: InvoiceFormData, action: InvoiceFormActionType) => {
    console.log('HII')
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

  const isError = (key: string) => {
    const _errors = errors as any
    return {msg: _errors[key]?.message, error: !!_errors[key]?.message}
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div>
          {isEdit ? (
            <Button variant='edit'>Edit</Button>
          ) : (
            <Button hasAddIcon>{isMobile ? 'New' : 'New Invoice'}</Button>
          )}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={classes.DialogOverlay} />

        <Dialog.Content className={classes.DialogContent}>
          <Dialog.Title className={classes.dialogTitle}>
            {isMobile && (
              <div onClick={() => setOpen(false)}>
                <BackBtn styles={{marginBottom: '24px', color: '#0C0E16'}} />
              </div>
            )}
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

            <div className={classes.labelBox}>
              <label
                className={clsx(
                  classes.label,
                  isError(InvoiceFormKey.STREET).error && classes.labelError,
                )}
                htmlFor={InvoiceFormKey.STREET}
              >
                Street Address
              </label>

              <p className={classes.error}>{isError(InvoiceFormKey.STREET).msg}</p>
            </div>
            <input
              className={clsx(
                classes.input,
                isError(InvoiceFormKey.STREET).error && classes.inputError,
              )}
              id={InvoiceFormKey.STREET}
              {...register(InvoiceFormKey.STREET)}
            />

            <div className={classes.inlineFlex} style={{marginBottom: '24px'}}>
              <div>
                <div className={classes.labelBox}>
                  <label
                    className={clsx(
                      classes.label,
                      isError(InvoiceFormKey.CITY).error && classes.labelError,
                    )}
                    htmlFor={InvoiceFormKey.CITY}
                  >
                    City
                  </label>
                  <p className={classes.error}>{isError(InvoiceFormKey.CITY).msg}</p>
                </div>
                <input
                  className={clsx(
                    classes.input,
                    classes.smallInput,
                    isError(InvoiceFormKey.CITY).error && classes.inputError,
                  )}
                  id={InvoiceFormKey.CITY}
                  {...register(InvoiceFormKey.CITY)}
                />
              </div>

              <div>
                <div className={classes.labelBox}>
                  <label
                    className={clsx(
                      classes.label,
                      isError(InvoiceFormKey.POSTCODE).error && classes.labelError,
                    )}
                    htmlFor={InvoiceFormKey.POSTCODE}
                  >
                    Post code
                  </label>
                  <p className={classes.error}>{isError(InvoiceFormKey.POSTCODE).msg}</p>
                </div>
                <input
                  className={clsx(
                    classes.input,
                    classes.smallInput,
                    isError(InvoiceFormKey.POSTCODE).error && classes.inputError,
                  )}
                  id={InvoiceFormKey.POSTCODE}
                  {...register(InvoiceFormKey.POSTCODE)}
                />
              </div>

              <div className={classes.fullWidth}>
                <div className={classes.labelBox}>
                  <label
                    className={clsx(
                      classes.label,
                      isError(InvoiceFormKey.COUNTRY).error && classes.labelError,
                    )}
                    htmlFor={InvoiceFormKey.COUNTRY}
                  >
                    Country
                  </label>
                  <p className={classes.error}>{isError(InvoiceFormKey.COUNTRY).msg}</p>
                </div>
                <input
                  className={clsx(
                    classes.input,
                    classes.smallInput,
                    isError(InvoiceFormKey.COUNTRY).error && classes.inputError,
                    classes.fullWidth,
                  )}
                  id={InvoiceFormKey.COUNTRY}
                  {...register(InvoiceFormKey.COUNTRY)}
                />
              </div>
            </div>

            <p className={classes.section}>Bill To</p>
            <div className={classes.labelBox}>
              <label
                className={clsx(
                  classes.label,
                  isError(InvoiceFormKey.CLIENT_NAME).error && classes.labelError,
                )}
                htmlFor={InvoiceFormKey.CLIENT_NAME}
              >
                Client's Name
              </label>
              <p className={classes.error}>{isError(InvoiceFormKey.CLIENT_NAME).msg}</p>
            </div>
            <input
              className={clsx(
                classes.input,
                isError(InvoiceFormKey.CLIENT_NAME).error && classes.inputError,
              )}
              id={InvoiceFormKey.CLIENT_NAME}
              {...register(InvoiceFormKey.CLIENT_NAME)}
            />

            {/* client email start */}
            <div className={classes.labelBox}>
              <label
                className={clsx(
                  classes.label,
                  isError(InvoiceFormKey.CLIENT_EMAIL).error && classes.labelError,
                )}
                htmlFor={InvoiceFormKey.CLIENT_EMAIL}
              >
                Client's Email
              </label>
              <p className={classes.error}>{isError(InvoiceFormKey.CLIENT_EMAIL).msg}</p>
            </div>
            <input
              className={clsx(
                classes.input,
                isError(InvoiceFormKey.CLIENT_EMAIL).error && classes.inputError,
              )}
              id={InvoiceFormKey.CLIENT_EMAIL}
              {...register(InvoiceFormKey.CLIENT_EMAIL)}
            />
            {/* client email end */}

            {/* client street start */}
            <div className={classes.labelBox}>
              <label
                className={clsx(
                  classes.label,
                  isError(InvoiceFormKey.CLIENT_STREET).error && classes.labelError,
                )}
                htmlFor={InvoiceFormKey.CLIENT_STREET}
              >
                Street Address
              </label>
              <p className={classes.error}>{isError(InvoiceFormKey.CLIENT_STREET).msg}</p>
            </div>
            <input
              className={clsx(
                classes.input,
                isError(InvoiceFormKey.CLIENT_STREET).error && classes.inputError,
              )}
              id={InvoiceFormKey.CLIENT_STREET}
              {...register(InvoiceFormKey.CLIENT_STREET)}
            />
            {/* client street end */}

            <div className={classes.inlineFlex}>
              <div>
                <div className={classes.labelBox}>
                  <label
                    className={clsx(
                      classes.label,
                      isError(InvoiceFormKey.CLIENT_CITY).error && classes.labelError,
                    )}
                    htmlFor={InvoiceFormKey.CLIENT_CITY}
                  >
                    City
                  </label>
                  <p className={classes.error}>{isError(InvoiceFormKey.CLIENT_CITY).msg}</p>
                </div>
                <input
                  className={clsx(
                    classes.input,
                    classes.smallInput,
                    isError(InvoiceFormKey.CLIENT_CITY).error && classes.inputError,
                  )}
                  id={InvoiceFormKey.CLIENT_CITY}
                  {...register(InvoiceFormKey.CLIENT_CITY)}
                />
              </div>

              <div>
                <div className={classes.labelBox}>
                  <label
                    className={clsx(
                      classes.label,
                      isError(InvoiceFormKey.CLIENT_POSTCODE).error && classes.labelError,
                    )}
                    htmlFor={InvoiceFormKey.CLIENT_POSTCODE}
                  >
                    Post code
                  </label>
                  <p className={classes.error}>{isError(InvoiceFormKey.CLIENT_POSTCODE).msg}</p>
                </div>
                <input
                  className={clsx(
                    classes.input,
                    classes.smallInput,
                    isError(InvoiceFormKey.CLIENT_POSTCODE).error && classes.inputError,
                  )}
                  id={InvoiceFormKey.CLIENT_POSTCODE}
                  {...register(InvoiceFormKey.CLIENT_POSTCODE)}
                />
              </div>

              <div className={classes.fullWidth}>
                <div className={classes.labelBox}>
                  <label
                    className={clsx(
                      classes.label,
                      isError(InvoiceFormKey.CLIENT_COUNTRY).error && classes.labelError,
                    )}
                    htmlFor={InvoiceFormKey.CLIENT_COUNTRY}
                  >
                    Country
                  </label>
                  <p className={classes.error}>{isError(InvoiceFormKey.CLIENT_COUNTRY).msg}</p>
                </div>
                <input
                  className={clsx(
                    classes.input,
                    classes.smallInput,
                    isError(InvoiceFormKey.CLIENT_COUNTRY).error && classes.inputError,
                    classes.fullWidth,
                  )}
                  id={InvoiceFormKey.CLIENT_COUNTRY}
                  {...register(InvoiceFormKey.CLIENT_COUNTRY)}
                />
              </div>
            </div>

            <div className={classes.inlineFlex} style={{marginTop: '24px', marginBottom: '0px'}}>
              <div className={classes.fullWidth}>
                <div className={classes.labelBox}>
                  <label
                    className={clsx(
                      classes.label,
                      isError(InvoiceFormKey.CREATED_AT).error && classes.labelError,
                    )}
                    htmlFor={InvoiceFormKey.CREATED_AT}
                  >
                    Invoice Date
                  </label>

                  <p className={classes.error}>{isError(InvoiceFormKey.CREATED_AT).msg}</p>
                </div>
                <input
                  className={clsx(classes.input, classes.mdInput, classes.fullWidth)}
                  id={InvoiceFormKey.CREATED_AT}
                  type='date'
                  {...register(InvoiceFormKey.CREATED_AT)}
                />
              </div>

              {/* payment terms start */}
              <div className={classes.fullWidth}>
                <div className={classes.labelBox}>
                  <label
                    className={clsx(
                      classes.label,
                      isError(InvoiceFormKey.PAYMENT_TERMS).error && classes.labelError,
                    )}
                    htmlFor={InvoiceFormKey.PAYMENT_TERMS}
                  >
                    Payment Terms
                  </label>
                  <p className={classes.error}>{isError(InvoiceFormKey.PAYMENT_TERMS).msg}</p>
                </div>
                <input
                  className={clsx(classes.input, classes.mdInput, classes.fullWidth)}
                  id={InvoiceFormKey.PAYMENT_TERMS}
                  {...register(InvoiceFormKey.PAYMENT_TERMS)}
                />
              </div>
            </div>
            {/* payment terms end */}

            {/* description start */}
            <div className={classes.labelBox}>
              <label
                className={clsx(
                  classes.label,
                  isError(InvoiceFormKey.DESCRIPTION).error && classes.labelError,
                )}
                htmlFor={InvoiceFormKey.DESCRIPTION}
              >
                Project Description
              </label>
              <p className={classes.error}>{isError(InvoiceFormKey.DESCRIPTION).msg}</p>
            </div>
            <input
              className={classes.input}
              id={InvoiceFormKey.DESCRIPTION}
              {...register(InvoiceFormKey.DESCRIPTION)}
              style={{marginBottom: '32px'}}
            />
            {/* description end */}

            <p className={classes.sectionLg}>Item List</p>

            <div className={classes.itemLabels}>
              <label className={classes.label}>Item Name</label>
              <label className={classes.label}>Qty.</label>
              <label className={classes.label}>Price</label>
              <label className={classes.label}>Total</label>
            </div>

            <div className={classes.itemFields}>
              {tempItems?.map((item: any, idx: number) => (
                <div key={item.name + idx.toString()} className={classes.itemBox}>
                  <input
                    className={classes.input}
                    id='name'
                    // @ts-ignore
                    {...register(`items.${idx}.name`)}
                    style={{marginBottom: 0}}
                  />
                  <input
                    className={classes.input}
                    id='quantity'
                    // @ts-ignore
                    {...register(`items.${idx}.quantity`)}
                    style={{marginBottom: 0}}
                  />
                  <input
                    className={classes.input}
                    id='price'
                    // @ts-ignore
                    {...register(`items.${idx}.price`)}
                    style={{marginBottom: 0}}
                  />
                  <input
                    className={classes.input}
                    id='total'
                    // @ts-ignore
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

            {!isValid && (
              <div className={classes.footerError}>
                <div className={clsx(classes.error)}>- All fields must be added</div>
                <div className={clsx(classes.error)}>- An item must be added</div>
              </div>
            )}

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
