import {CreateInvoiceInput} from './invoice.schema'
import prisma from '../../utils/prisma'

export function createInvoice(data: CreateInvoiceInput & {userId: number}) {
  const invoice = {
    paymentTerms: data.paymentTerms,
    invoiceDate: data.invoiceDate,
    description: data.description,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    // items: data.items,
  }

  const senderAddress = {
    ...data.senderAddress,
  }

  const clientAddress = {
    ...data.clientAddress,
  }

  const newData = {
    ...invoice,
    user: {connect: {id: data.userId}},
    senderAddress: {create: senderAddress},
    clientAddress: {create: clientAddress},
  }

  console.log(newData)

  // connect user_id to user
  return prisma.invoice.create({
    data: newData,
    // where: {
    //   userId: data.userId,
    //   senderAddressId: data.senderAddressId,
    //   clientAddressId: data.senderAddressId,
    // },
  })
}

// const d = {
//     userId: 1,
//     description: 'Re-branding',
//     paymentTerms: 7,
//     invoiceDate: '2023-02-15T13:37:27+00:00',
//     senderAddress: {
//       country: 'United Kingdom',
//       postCode: 'E1 3EZ',
//       city: 'London',
//       street: '19 Union Terrace',
//     },
//     clientAddress: {
//       country: 'United Kingdom',
//       postCode: 'NR24 5WQ',
//       city: 'Sharrington',
//       street: '106 Kendell Street',
//     },
//     clientEmail: 'jensenh@mail.com',
//     clientName: 'Jensen Huang',
//   }
