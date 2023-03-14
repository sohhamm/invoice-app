import prisma from '../../utils/prisma'
import {CreateInvoiceInput} from './invoice.schema'
import type {InvoiceStatus, InvoiceUpdate} from '../../types'

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

export function findAllInvoices(userId: number, status?: InvoiceStatus) {
  // todo format the response better for items, remove nesting
  return prisma.invoice.findMany({
    where: {userId, status: status},
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

export async function updateInvoiceByID(invoiceId: number, payload: InvoiceUpdate) {
  const {invoice, senderAddress, clientAddress, items} = payload

  if (items) {
    const res = await updateInvoiceItems(invoiceId, items)

    console.log(res)
  }

  const data = {
    invoiceDate: invoice.invoiceDate ?? undefined,
    paymentTerms: invoice.paymentTerms ?? undefined,
    description: invoice.description ?? undefined,
    clientName: invoice.clientName ?? undefined,
    clientEmail: invoice.clientEmail ?? undefined,
    // todo enforce this in backend later on
    status: (invoice.status as InvoiceStatus) ?? undefined,
    senderAddress: {
      update: senderAddress,
    },
    clientAddress: {
      update: clientAddress,
    },
    // items: {
    //   upsertMany: updateItemInvoice,
    // },
  }

  // todo try updating the items in the same mutation
  return prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data,
  })
}

type Item = {
  quantity: number
  id: number
  item: {
    id: number
    name: string
    price: number
  }
  itemId: number
  invoiceId: number
}

async function updateInvoiceItems(invoiceId: number, items: Item[]) {
  const updateItemTransactions = items?.map(item =>
    prisma.itemInvoices.upsert({
      where: {
        invoiceId_itemId: {
          invoiceId: item.invoiceId,
          // -1 signifies prisma that this record does not exist
          itemId: item.itemId ?? -1,
        },
      },
      update: {
        quantity: item.quantity,
        item: {
          update: {
            name: item.item.name,
            price: item.item.price,
          },
          connectOrCreate: {
            where: {
              id: item.item.id,
            },
            create: {
              name: item.item.name,
              price: item.item.price,
            },
          },
        },
      },
      create: {
        invoice: {
          connect: {
            id: invoiceId,
          },
        },
        quantity: item.quantity,
        item: {
          create: {
            name: item.item.name,
            price: item.item.price,
          },
        },
      },
    }),
  )

  if (updateItemTransactions.length) {
    await prisma.$transaction(updateItemTransactions)
  }
}
