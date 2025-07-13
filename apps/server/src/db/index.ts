// Use Bun's native SQL API with connection pooling
import { SQL } from 'bun';
import { Logger } from '@/utils/logger';

const createConnection = () => {
  try {
    return new SQL({
      url: process.env.DATABASE_URL!,
      // Connection pool configuration
      max: 20, // Maximum connections in pool
      min: 2,  // Minimum connections in pool
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 2000, // 2s timeout for new connections
    });
  } catch (error) {
    Logger.error('Failed to create database connection', { error });
    throw error;
  }
};

export const sql = createConnection();

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    Logger.error('Database health check failed', { error });
    return false;
  }
};

// Graceful database shutdown
export const closeDatabase = async (): Promise<void> => {
  try {
    await sql.end();
    Logger.info('Database connections closed successfully');
  } catch (error) {
    Logger.error('Error closing database connections', { error });
  }
};

// Type definitions for our database tables
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address?: string;
  client_phone?: string;
  invoice_date: string;
  due_date: string;
  payment_terms: 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'due_on_receipt';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_rate?: number;
  tax_amount?: number;
  discount_rate?: number;
  discount_amount?: number;
  total_amount: number;
  paid_amount?: number;
  notes?: string;
  terms_conditions?: string;
  sent_at?: Date;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order?: number;
  created_at: Date;
  updated_at: Date;
}

// Frontend-compatible types (matching data.json structure)
export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface FrontendInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface FrontendInvoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: 'draft' | 'pending' | 'paid';
  senderAddress: Address;
  clientAddress: Address;
  items: FrontendInvoiceItem[];
  total: number;
}

export interface CreateInvoiceInput {
  description?: string;
  paymentTerms?: number;
  clientName?: string;
  clientEmail?: string;
  status?: 'draft' | 'pending' | 'paid';
  senderAddress?: Address;
  clientAddress?: Address;
  items?: FrontendInvoiceItem[];
}
