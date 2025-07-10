// Type definitions for invoice data structures

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
}

export interface ContactInfo {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface Invoice {
  from: ContactInfo;
  to: ContactInfo;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
  items: InvoiceItem[];
  discount?: number;
  notes?: string;
  terms?: string;
}

export interface InvoiceLabels {
  invoice: string;
  date: string;
  dueDate: string;
  from: string;
  to: string;
  description: string;
  quantity: string;
  unitPrice: string;
  tax: string;
  total: string;
  subtotal: string;
  discount: string;
  notes: string;
  terms: string;
  [key: string]: string; // Allow additional string keys for compatibility
}

export interface InvoiceOptions {
  layoutStyle?: 'default' | 'modern' | 'minimal' | 'creative';
  brandColor?: string;
  logoUrl?: string;
  labels?: InvoiceLabels;
}

export interface TestCase {
  name: string;
  invoice: Invoice;
  options: InvoiceOptions;
}

export interface CustomOptions {
  layoutStyle: 'default' | 'modern' | 'minimal' | 'creative';
  brandColor: string;
  logoUrl: string;
  customLabels: boolean;
  labels: InvoiceLabels;
}
