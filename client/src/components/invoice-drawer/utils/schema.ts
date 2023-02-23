import * as Yup from 'yup'

export const invoiceSchema = Yup.object({
  street: Yup.string().required(),
  city: Yup.string().required(),
  postCode: Yup.string().required(),
  country: Yup.string().required(),
  clientName: Yup.string().required().min(3),
  clientEmail: Yup.string().email().required(),

  clientStreet: Yup.string().required(),
  clientCity: Yup.string().required(),
  clientPostCode: Yup.string().required(),
  clientCountry: Yup.string().required(),

  createdAt: Yup.date().required(),
  paymentDue: Yup.string().required(),

  paymentTerms: Yup.number().required(),

  description: Yup.string().required(),

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
