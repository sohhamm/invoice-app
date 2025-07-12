import fs from 'fs/promises';
import path from 'path';
import type { Invoice, CreateInvoiceInput, InvoiceItem } from '@personal-finance-app/shared-types';

// In-memory storage for invoices (in production, this would be a database)
let invoices: Invoice[] = [];

// Load initial data from data.json
async function loadInitialData() {
  try {
    const dataPath = path.join(process.cwd(), '../web/data.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    invoices = JSON.parse(data);
  } catch (error) {
    // If data.json doesn't exist or can't be read, start with empty array
    invoices = [];
  }
}

// Initialize data on module load
loadInitialData();

function generateInvoiceId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetters = Array.from(
    { length: 2 }, 
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join('');
  const randomNumbers = Array.from(
    { length: 4 }, 
    () => Math.floor(Math.random() * 10)
  ).join('');
  return randomLetters + randomNumbers;
}

function calculatePaymentDue(createdAt: string, paymentTerms: number): string {
  const dueDate = new Date(createdAt);
  dueDate.setDate(dueDate.getDate() + paymentTerms);
  return dueDate.toISOString().split('T')[0];
}

function calculateItemTotal(quantity: number, price: number): number {
  return quantity * price;
}

function calculateTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

export async function createInvoice(data: CreateInvoiceInput): Promise<Invoice> {
  const id = generateInvoiceId();
  const createdAt = new Date().toISOString().split('T')[0];
  const paymentTerms = data.paymentTerms || 30;
  const paymentDue = calculatePaymentDue(createdAt, paymentTerms);
  
  // Process items and calculate totals
  const items: InvoiceItem[] = (data.items || []).map(item => ({
    ...item,
    total: calculateItemTotal(item.quantity, item.price)
  }));
  
  const total = calculateTotal(items);
  
  const invoice: Invoice = {
    id,
    createdAt,
    paymentDue,
    description: data.description || '',
    paymentTerms,
    clientName: data.clientName || '',
    clientEmail: data.clientEmail || '',
    status: data.status || 'pending',
    senderAddress: data.senderAddress || {
      street: '',
      city: '',
      postCode: '',
      country: ''
    },
    clientAddress: data.clientAddress || {
      street: '',
      city: '',
      postCode: '',
      country: ''
    },
    items,
    total
  };
  
  invoices.push(invoice);
  return invoice;
}

export async function getAllInvoices(statusFilter?: string): Promise<Invoice[]> {
  if (statusFilter) {
    return invoices.filter(invoice => invoice.status === statusFilter);
  }
  return invoices;
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  return invoices.find(invoice => invoice.id === id) || null;
}

export async function updateInvoice(id: string, updateData: Partial<CreateInvoiceInput>): Promise<Invoice | null> {
  const index = invoices.findIndex(invoice => invoice.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const existingInvoice = invoices[index];
  
  // Process items and calculate totals
  const items: InvoiceItem[] = (updateData.items || existingInvoice.items).map(item => ({
    ...item,
    total: calculateItemTotal(item.quantity, item.price)
  }));
  
  const total = calculateTotal(items);
  
  // Recalculate payment due if payment terms changed
  let paymentDue = existingInvoice.paymentDue;
  if (updateData.paymentTerms && updateData.paymentTerms !== existingInvoice.paymentTerms) {
    paymentDue = calculatePaymentDue(existingInvoice.createdAt, updateData.paymentTerms);
  }
  
  const updatedInvoice: Invoice = {
    ...existingInvoice,
    ...updateData,
    paymentDue,
    items,
    total,
    // If invoice was draft, update to pending
    status: existingInvoice.status === 'draft' ? 'pending' : existingInvoice.status
  };
  
  invoices[index] = updatedInvoice;
  return updatedInvoice;
}

export async function markInvoiceAsPaid(id: string): Promise<Invoice | null> {
  const index = invoices.findIndex(invoice => invoice.id === id);
  
  if (index === -1) {
    return null;
  }
  
  invoices[index].status = 'paid';
  return invoices[index];
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const index = invoices.findIndex(invoice => invoice.id === id);
  
  if (index === -1) {
    return false;
  }
  
  invoices.splice(index, 1);
  return true;
}