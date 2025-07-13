import { Logger } from '../utils/logger';
import { sql } from './index';

const migrations = [
  {
    id: '001_create_users_table',
    sql: `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
    `,
  },
  {
    id: '002_create_invoices_table',
    sql: `
      DO $$ BEGIN
        CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      DO $$ BEGIN
        CREATE TYPE payment_terms AS ENUM ('net_15', 'net_30', 'net_45', 'net_60', 'due_on_receipt');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invoice_number VARCHAR(100) NOT NULL UNIQUE,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_address TEXT,
        client_phone VARCHAR(50),
        invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
        due_date DATE NOT NULL,
        payment_terms payment_terms NOT NULL DEFAULT 'net_30',
        status invoice_status NOT NULL DEFAULT 'draft',
        subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
        tax_rate DECIMAL(5, 2) DEFAULT 0,
        tax_amount DECIMAL(12, 2) DEFAULT 0,
        discount_rate DECIMAL(5, 2) DEFAULT 0,
        discount_amount DECIMAL(12, 2) DEFAULT 0,
        total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        paid_amount DECIMAL(12, 2) DEFAULT 0,
        notes TEXT,
        terms_conditions TEXT,
        sent_at TIMESTAMP,
        paid_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
      CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
      CREATE INDEX IF NOT EXISTS idx_invoices_client_email ON invoices(client_email);
      CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);
      CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
    `,
  },
  {
    id: '003_create_invoice_items_table',
    sql: `
      CREATE TABLE IF NOT EXISTS invoice_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
        unit_price DECIMAL(10, 2) NOT NULL,
        line_total DECIMAL(12, 2) NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
      CREATE INDEX IF NOT EXISTS idx_invoice_items_sort_order ON invoice_items(sort_order);
    `,
  },
  {
    id: '004_create_migrations_table',
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `,
  },
];

async function runMigrations() {
  try {
    Logger.info('Starting database migrations...');

    // Create migrations table first
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    // Get executed migrations
    const executedMigrations = await sql`
      SELECT id FROM migrations;
    `;

    const executedIds = new Set(executedMigrations.map((m) => m.id));

    // Run pending migrations
    for (const migration of migrations) {
      if (!executedIds.has(migration.id)) {
        Logger.info(`Running migration: ${migration.id}`);

        await sql.begin(async (sql) => {
          // Execute the migration SQL
          await sql.unsafe(migration.sql);

          // Record the migration as executed
          await sql`
            INSERT INTO migrations (id) VALUES (${migration.id});
          `;
        });

        Logger.info(`Completed migration: ${migration.id}`);
      } else {
        Logger.info(`Skipping already executed migration: ${migration.id}`);
      }
    }

    Logger.info('All migrations completed successfully');
  } catch (error) {
    Logger.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run migrations if called directly
if (import.meta.main) {
  runMigrations();
}

export { runMigrations };
