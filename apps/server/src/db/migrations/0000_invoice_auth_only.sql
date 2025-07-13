-- Users table for authentication
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Create ENUMs for invoices
CREATE TYPE "payment_terms_enum" AS ENUM('net_15', 'net_30', 'net_45', 'net_60', 'due_on_receipt');
CREATE TYPE "invoice_status_enum" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled');

-- Invoices table
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"invoice_number" varchar(10) UNIQUE NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"client_email" varchar(255) NOT NULL,
	"client_address" jsonb,
	"client_phone" varchar(20),
	"invoice_date" date NOT NULL,
	"due_date" date NOT NULL,
	"payment_terms" payment_terms_enum DEFAULT 'net_30' NOT NULL,
	"status" invoice_status_enum DEFAULT 'draft' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax_rate" numeric(5, 2) DEFAULT 0,
	"tax_amount" numeric(10, 2) DEFAULT 0,
	"discount_rate" numeric(5, 2) DEFAULT 0,
	"discount_amount" numeric(10, 2) DEFAULT 0,
	"total_amount" numeric(10, 2) NOT NULL,
	"paid_amount" numeric(10, 2) DEFAULT 0,
	"notes" text,
	"terms_conditions" text,
	"sent_at" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Invoice items table
CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"line_total" numeric(10, 2) NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Foreign key constraints
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;

-- Indexes for performance
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");
CREATE INDEX "invoices_user_id_idx" ON "invoices" USING btree ("user_id");
CREATE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");
CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");
CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items" USING btree ("invoice_id");