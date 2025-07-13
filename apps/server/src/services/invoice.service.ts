import { sql } from '@/db/index';
import type { 
  FrontendInvoice, 
  CreateInvoiceInput, 
  FrontendInvoiceItem,
  Invoice,
  InvoiceItem 
} from '@/db/index';

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

function mapPaymentTermsToEnum(paymentTerms: number): 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'due_on_receipt' {
  switch (paymentTerms) {
    case 15: return 'net_15';
    case 30: return 'net_30';
    case 45: return 'net_45';
    case 60: return 'net_60';
    default: return 'due_on_receipt';
  }
}

function mapPaymentTermsFromEnum(paymentTerms: 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'due_on_receipt'): number {
  switch (paymentTerms) {
    case 'net_15': return 15;
    case 'net_30': return 30;
    case 'net_45': return 45;
    case 'net_60': return 60;
    case 'due_on_receipt': return 1;
    default: return 30;
  }
}

function mapStatusToFrontend(status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'): 'draft' | 'pending' | 'paid' {
  switch (status) {
    case 'sent':
    case 'overdue':
      return 'pending';
    case 'paid':
      return 'paid';
    case 'draft':
    case 'cancelled':
    default:
      return 'draft';
  }
}

function mapStatusToDatabase(status: 'draft' | 'pending' | 'paid'): 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' {
  switch (status) {
    case 'pending':
      return 'sent';
    case 'paid':
      return 'paid';
    case 'draft':
    default:
      return 'draft';
  }
}

async function convertDatabaseInvoiceToFrontend(dbInvoice: Invoice, dbItems: InvoiceItem[]): Promise<FrontendInvoice> {
  // Parse addresses from JSON strings stored in database
  const senderAddress = dbInvoice.client_address ? 
    JSON.parse(dbInvoice.client_address).sender || { street: '', city: '', postCode: '', country: '' } :
    { street: '', city: '', postCode: '', country: '' };
  
  const clientAddress = dbInvoice.client_address ? 
    JSON.parse(dbInvoice.client_address).client || { street: '', city: '', postCode: '', country: '' } :
    { street: '', city: '', postCode: '', country: '' };

  const items: FrontendInvoiceItem[] = dbItems.map(item => ({
    name: item.description,
    quantity: item.quantity,
    price: item.unit_price,
    total: item.line_total
  }));

  return {
    id: dbInvoice.invoice_number,
    createdAt: dbInvoice.invoice_date,
    paymentDue: dbInvoice.due_date,
    description: dbInvoice.notes || '',
    paymentTerms: mapPaymentTermsFromEnum(dbInvoice.payment_terms),
    clientName: dbInvoice.client_name,
    clientEmail: dbInvoice.client_email,
    status: mapStatusToFrontend(dbInvoice.status),
    senderAddress,
    clientAddress,
    items,
    total: dbInvoice.total_amount
  };
}

export async function createInvoice(data: CreateInvoiceInput): Promise<FrontendInvoice> {
  const invoiceNumber = generateInvoiceId();
  const createdAt = new Date().toISOString().split('T')[0];
  const paymentTerms = data.paymentTerms || 30;
  const paymentDue = calculatePaymentDue(createdAt, paymentTerms);
  
  // For now, use a default user_id (in real app, this would come from auth)
  const userId = '00000000-0000-0000-0000-000000000000';
  
  const items = data.items || [];
  const total = items.reduce((sum, item) => sum + item.total, 0);
  
  // Store addresses as JSON
  const addresses = JSON.stringify({
    sender: data.senderAddress || { street: '', city: '', postCode: '', country: '' },
    client: data.clientAddress || { street: '', city: '', postCode: '', country: '' }
  });

  // Insert invoice
  const [dbInvoice] = await sql<Invoice[]>`
    INSERT INTO invoices (
      user_id, invoice_number, client_name, client_email, client_address,
      invoice_date, due_date, payment_terms, status, subtotal, total_amount, notes
    ) VALUES (
      ${userId}, ${invoiceNumber}, ${data.clientName || ''}, ${data.clientEmail || ''}, ${addresses},
      ${createdAt}, ${paymentDue}, ${mapPaymentTermsToEnum(paymentTerms)}, 
      ${mapStatusToDatabase(data.status || 'draft')}, ${total}, ${total}, ${data.description || ''}
    ) RETURNING *
  `;

  // Insert invoice items
  const dbItems: InvoiceItem[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const [dbItem] = await sql<InvoiceItem[]>`
      INSERT INTO invoice_items (
        invoice_id, description, quantity, unit_price, line_total, sort_order
      ) VALUES (
        ${dbInvoice.id}, ${item.name}, ${item.quantity}, ${item.price}, ${item.total}, ${i}
      ) RETURNING *
    `;
    dbItems.push(dbItem);
  }

  return convertDatabaseInvoiceToFrontend(dbInvoice, dbItems);
}

export async function getAllInvoices(statusFilter?: string): Promise<FrontendInvoice[]> {
  let invoicesQuery;
  if (statusFilter) {
    const dbStatus = mapStatusToDatabase(statusFilter as 'draft' | 'pending' | 'paid');
    invoicesQuery = await sql<Invoice[]>`
      SELECT * FROM invoices WHERE status = ${dbStatus} ORDER BY created_at DESC
    `;
  } else {
    invoicesQuery = await sql<Invoice[]>`
      SELECT * FROM invoices ORDER BY created_at DESC
    `;
  }

  const frontendInvoices: FrontendInvoice[] = [];
  
  for (const invoice of invoicesQuery) {
    const items = await sql<InvoiceItem[]>`
      SELECT * FROM invoice_items WHERE invoice_id = ${invoice.id} ORDER BY sort_order
    `;
    const frontendInvoice = await convertDatabaseInvoiceToFrontend(invoice, items);
    frontendInvoices.push(frontendInvoice);
  }

  return frontendInvoices;
}

export async function getInvoiceById(invoiceNumber: string): Promise<FrontendInvoice | null> {
  const [dbInvoice] = await sql<Invoice[]>`
    SELECT * FROM invoices WHERE invoice_number = ${invoiceNumber}
  `;

  if (!dbInvoice) {
    return null;
  }

  const dbItems = await sql<InvoiceItem[]>`
    SELECT * FROM invoice_items WHERE invoice_id = ${dbInvoice.id} ORDER BY sort_order
  `;

  return convertDatabaseInvoiceToFrontend(dbInvoice, dbItems);
}

export async function updateInvoice(invoiceNumber: string, updateData: Partial<CreateInvoiceInput>): Promise<FrontendInvoice | null> {
  const [existingInvoice] = await sql<Invoice[]>`
    SELECT * FROM invoices WHERE invoice_number = ${invoiceNumber}
  `;
  
  if (!existingInvoice) {
    return null;
  }
  
  const items = updateData.items || [];
  const total = items.reduce((sum, item) => sum + (item.total || 0), 0);
  
  console.log('Update data:', {
    invoiceNumber,
    items: items.length,
    total,
    paymentTerms: updateData.paymentTerms,
    status: updateData.status
  });
  
  // Update payment due if payment terms changed
  let paymentDue = existingInvoice.due_date;
  if (updateData.paymentTerms && updateData.paymentTerms !== mapPaymentTermsFromEnum(existingInvoice.payment_terms)) {
    paymentDue = calculatePaymentDue(existingInvoice.invoice_date, updateData.paymentTerms);
  }

  // Store addresses as JSON
  const addresses = JSON.stringify({
    sender: updateData.senderAddress || { street: '', city: '', postCode: '', country: '' },
    client: updateData.clientAddress || { street: '', city: '', postCode: '', country: '' }
  });

  // Determine status - drafts become pending when updated with complete data
  const newStatus = updateData.status ? 
    mapStatusToDatabase(updateData.status) : 
    (existingInvoice.status === 'draft' ? 'sent' : existingInvoice.status);

  // Update invoice with explicit type casting
  try {
    const clientName = updateData.clientName || existingInvoice.client_name;
    const clientEmail = updateData.clientEmail || existingInvoice.client_email;
    const clientAddress = addresses;
    const dueDate = paymentDue;
    const paymentTermsEnum = updateData.paymentTerms ? mapPaymentTermsToEnum(updateData.paymentTerms) : existingInvoice.payment_terms;
    const statusEnum = newStatus;
    const totalAmount = total > 0 ? total : existingInvoice.total_amount;
    const subtotalAmount = total > 0 ? total : existingInvoice.subtotal;
    const notesText = updateData.description || existingInvoice.notes;
    
    console.log('Executing update query with params:', {
      clientName,
      clientEmail,
      clientAddress,
      dueDate,
      paymentTermsEnum,
      statusEnum,
      totalAmount,
      subtotalAmount,
      notesText
    });
    
    const [updatedInvoice] = await sql<Invoice[]>`
      UPDATE invoices SET
        client_name = ${clientName},
        client_email = ${clientEmail},
        client_address = ${clientAddress},
        due_date = ${dueDate},
        payment_terms = ${paymentTermsEnum}::payment_terms,
        status = ${statusEnum}::invoice_status,
        total_amount = ${totalAmount},
        subtotal = ${subtotalAmount},
        notes = ${notesText},
        updated_at = NOW()
      WHERE invoice_number = ${invoiceNumber}
      RETURNING *
    `;
  } catch (error) {
    console.error('Update query failed:', error);
    throw error;
  }

  // Update items if provided
  if (updateData.items && updateData.items.length > 0) {
    // Delete existing items
    await sql`DELETE FROM invoice_items WHERE invoice_id = ${existingInvoice.id}`;
    
    // Insert new items
    for (let i = 0; i < updateData.items.length; i++) {
      const item = updateData.items[i];
      await sql`
        INSERT INTO invoice_items (
          invoice_id, description, quantity, unit_price, line_total, sort_order
        ) VALUES (
          ${existingInvoice.id}, ${item.name}, ${item.quantity}, ${item.price}, ${item.total}, ${i}
        )
      `;
    }
  }

  const dbItems = await sql<InvoiceItem[]>`
    SELECT * FROM invoice_items WHERE invoice_id = ${existingInvoice.id} ORDER BY sort_order
  `;

  return convertDatabaseInvoiceToFrontend(updatedInvoice, dbItems);
}

export async function markInvoiceAsPaid(invoiceNumber: string): Promise<FrontendInvoice | null> {
  const [updatedInvoice] = await sql<Invoice[]>`
    UPDATE invoices SET
      status = 'paid',
      paid_at = NOW(),
      paid_amount = total_amount,
      updated_at = NOW()
    WHERE invoice_number = ${invoiceNumber}
    RETURNING *
  `;
  
  if (!updatedInvoice) {
    return null;
  }

  const dbItems = await sql<InvoiceItem[]>`
    SELECT * FROM invoice_items WHERE invoice_id = ${updatedInvoice.id} ORDER BY sort_order
  `;

  return convertDatabaseInvoiceToFrontend(updatedInvoice, dbItems);
}

export async function deleteInvoice(invoiceNumber: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM invoices WHERE invoice_number = ${invoiceNumber}
  `;
  
  return result.count > 0;
}