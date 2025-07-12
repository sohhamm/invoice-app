-- Users table for authentication
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Invoice status enum
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'pending', 'paid');

-- Invoices table
CREATE TABLE "invoices" (
	"id" varchar(10) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" date NOT NULL,
	"payment_due" date NOT NULL,
	"description" text NOT NULL,
	"payment_terms" integer NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"client_email" varchar(255) NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"sender_street" varchar(255) NOT NULL,
	"sender_city" varchar(255) NOT NULL,
	"sender_post_code" varchar(255) NOT NULL,
	"sender_country" varchar(255) NOT NULL,
	"client_street" varchar(255) NOT NULL,
	"client_city" varchar(255) NOT NULL,
	"client_post_code" varchar(255) NOT NULL,
	"client_country" varchar(255) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Invoice items table
CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" varchar(10) NOT NULL,
	"name" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Foreign key constraints
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;

-- Indexes
CREATE INDEX "email_idx" ON "users" USING btree ("email");
CREATE INDEX "invoice_user_id_idx" ON "invoices" USING btree ("user_id");
CREATE INDEX "invoice_status_idx" ON "invoices" USING btree ("status");
CREATE INDEX "invoice_created_at_idx" ON "invoices" USING btree ("created_at");
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items" USING btree ("invoice_id");