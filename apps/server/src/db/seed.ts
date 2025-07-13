import { sql } from './index';
import { Logger } from '@/utils/logger';
import { PasswordUtils } from '@/utils/password';
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

    // Create demo users
    const demoUserId = '00000000-0000-0000-0000-000000000000';
    const demoPassword = await PasswordUtils.hashPassword('demo123456');
    
    // Check if demo user exists, if not create one, otherwise update
    const [existingDemoUser] = await sql`
      SELECT id FROM users WHERE id = ${demoUserId} OR email = 'demo@example.com'
    `;

    if (!existingDemoUser) {
      await sql`
        INSERT INTO users (id, name, email, password_hash, role, is_active)
        VALUES (${demoUserId}, 'Demo User', 'demo@example.com', ${demoPassword}, 'user', true)
      `;
      Logger.info('Created demo user: demo@example.com');
    } else {
      // Update existing user with correct credentials
      await sql`
        UPDATE users 
        SET name = 'Demo User', email = 'demo@example.com', password_hash = ${demoPassword}
        WHERE id = ${demoUserId}
      `;
      Logger.info('Updated demo user credentials: demo@example.com');
    }

    // Also create the default user if needed
    const [existingDefaultUser] = await sql`
      SELECT id FROM users WHERE email = 'user@example.com'
    `;

    if (!existingDefaultUser) {
      const defaultPassword = await PasswordUtils.hashPassword('password123');
      await sql`
        INSERT INTO users (name, email, password_hash, role, is_active)
        VALUES ('Default User', 'user@example.com', ${defaultPassword}, 'user', true)
      `;
      Logger.info('Created default user: user@example.com');
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
          ${demoUserId}, 
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