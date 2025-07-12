export interface InvoiceAddress {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: 'draft' | 'pending' | 'paid';
  senderAddress: InvoiceAddress;
  clientAddress: InvoiceAddress;
  items: InvoiceItem[];
  total: number;
}

export interface CreateInvoiceInput {
  description?: string;
  paymentTerms?: number;
  clientName?: string;
  clientEmail?: string;
  senderAddress?: InvoiceAddress;
  clientAddress?: InvoiceAddress;
  items?: Omit<InvoiceItem, 'total'>[];
  status?: 'draft' | 'pending';
  isDraft?: boolean;
}

export interface UpdateInvoiceInput extends Omit<CreateInvoiceInput, 'isDraft'> {
  id: string;
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}