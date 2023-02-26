import * as Yup from 'yup'

const emptyMsg = `can't be empty`

export const invoiceSchema = Yup.object({
  street: Yup.string().required(emptyMsg),
  city: Yup.string().required(emptyMsg),
  postCode: Yup.string().required(emptyMsg),
  country: Yup.string().required(emptyMsg),
  clientName: Yup.string().required(emptyMsg).min(2, 'Minimum 2 characters are required'),
  clientEmail: Yup.string().email('Invalid email provided').required(emptyMsg),

  clientStreet: Yup.string().required(emptyMsg),
  clientCity: Yup.string().required(emptyMsg),
  clientPostCode: Yup.string().required(emptyMsg),
  clientCountry: Yup.string().required(emptyMsg),

  createdAt: Yup.date().required(),
  paymentDue: Yup.string().required(),

  paymentTerms: Yup.number().required(),

  description: Yup.string().required(emptyMsg),

  items: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string(),
        quantity: Yup.string(),
        price: Yup.string(),
        total: Yup.string(),
      }),
    )
    .required(),
}).required()
