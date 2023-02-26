import {CreateInvoiceInput} from './invoice.schema'
import prisma from '../../utils/prisma'

export function createInvoice(data: CreateInvoiceInput & {userId: number}) {
  const items = data.items?.map(item => ({
    quantity: item.quantity,
    item: {
      create: {
        name: item.name,
        price: item.price,
      },
    },
  }))
  return prisma.invoice.create({
    data: {
      paymentTerms: data.paymentTerms,
      invoiceDate: data.invoiceDate,
      description: data.description,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      user: {connect: {id: data.userId}},
      senderAddress: {create: data.senderAddress},
      clientAddress: {create: data.clientAddress},
      items: {create: items},
    },
  })
}

export function findAllInvoices(userId: number) {
  return prisma.invoice.findMany({
    where: {userId},
    include: {
      clientAddress: true,
      senderAddress: true,
      items: {
        include: {
          item: true,
        },
      },
    },
  })
}

export function findInvoiceByID(invoiceId: number) {
  return prisma.invoice.findUnique({
    where: {id: invoiceId},
    include: {
      clientAddress: true,
      senderAddress: true,
      items: {
        include: {
          item: true,
        },
      },
    },
  })
}

// ? edit items: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/working-with-many-to-many-relations

//  items?: ItemInvoicesCreateNestedManyWithoutInvoiceInput
