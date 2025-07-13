import { sql } from './index';
import { Logger } from '@/utils/logger';
import fs from 'fs/promises';
import path from 'path';

interface MockInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface MockAddress {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

interface MockInvoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: 'draft' | 'pending' | 'paid';
  senderAddress: MockAddress;
  clientAddress: MockAddress;
  items: MockInvoiceItem[];
  total: number;
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

async function seedDatabase() {
  try {
    Logger.info('Starting database seeding...');

    // Load mock data
    const dataPath = path.join(process.cwd(), '../web/data.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const mockInvoices: MockInvoice[] = JSON.parse(data);

    // Create a default user for the invoices
    const userId = '00000000-0000-0000-0000-000000000000';
    
    // Check if user exists, if not create one
    const [existingUser] = await sql`
      SELECT id FROM users WHERE id = ${userId}
    `;

    if (!existingUser) {
      await sql`
        INSERT INTO users (id, name, email, password_hash, role, is_active)
        VALUES (${userId}, 'Default User', 'user@example.com', 'hashed_password', 'user', true)
      `;
      Logger.info('Created default user');
    }

    // Clear existing invoice data
    await sql`DELETE FROM invoice_items`;
    await sql`DELETE FROM invoices`;
    Logger.info('Cleared existing invoice data');

    // Insert mock invoices
    for (const mockInvoice of mockInvoices) {
      // Store addresses as JSON
      const addresses = JSON.stringify({
        sender: mockInvoice.senderAddress,
        client: mockInvoice.clientAddress
      });

      // Insert invoice
      const [dbInvoice] = await sql`
        INSERT INTO invoices (
          user_id, invoice_number, client_name, client_email, client_address,
          invoice_date, due_date, payment_terms, status, subtotal, total_amount, notes
        ) VALUES (
          ${userId}, 
          ${mockInvoice.id}, 
          ${mockInvoice.clientName}, 
          ${mockInvoice.clientEmail}, 
          ${addresses},
          ${mockInvoice.createdAt}, 
          ${mockInvoice.paymentDue}, 
          ${mapPaymentTermsToEnum(mockInvoice.paymentTerms)}, 
          ${mapStatusToDatabase(mockInvoice.status)}, 
          ${mockInvoice.total}, 
          ${mockInvoice.total}, 
          ${mockInvoice.description}
        ) RETURNING id
      `;

      // Insert invoice items
      for (let i = 0; i < mockInvoice.items.length; i++) {
        const item = mockInvoice.items[i];
        await sql`
          INSERT INTO invoice_items (
            invoice_id, description, quantity, unit_price, line_total, sort_order
          ) VALUES (
            ${dbInvoice.id}, ${item.name}, ${item.quantity}, ${item.price}, ${item.total}, ${i}
          )
        `;
      }

      Logger.info(`Seeded invoice: ${mockInvoice.id}`);
    }

    Logger.info(`Successfully seeded ${mockInvoices.length} invoices`);
  } catch (error) {
    Logger.error('Error seeding database:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run seeding if called directly
if (import.meta.main) {
  seedDatabase();
}

export { seedDatabase };