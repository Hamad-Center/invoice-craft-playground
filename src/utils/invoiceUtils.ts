import type { Invoice } from '../types/invoice';

// Calculate totals for preview
export const calculatePreviewTotals = (invoice: Invoice) => {
  let subtotal = 0;
  let totalTax = 0;

  invoice.items.forEach((item) => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;
    if (item.taxRate) {
      totalTax += itemTotal * item.taxRate;
    }
  });

  const discount = invoice.discount || 0;
  const total = subtotal + totalTax - discount;

  return { subtotal, totalTax, discount, total };
};

// Validate invoice data
export const validateInvoice = (invoice: Invoice): string | null => {
  if (!invoice.from.name.trim()) {
    return 'From company name is required';
  }
  if (!invoice.to.name.trim()) {
    return 'To customer name is required';
  }
  if (!invoice.invoiceNumber.trim()) {
    return 'Invoice number is required';
  }
  if (!invoice.invoiceDate.trim()) {
    return 'Invoice date is required';
  }
  if (invoice.items.length === 0) {
    return 'At least one item is required';
  }

  // Validate items
  for (let i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    if (!item.description.trim()) {
      return `Item ${i + 1}: Description is required`;
    }
    if (item.quantity <= 0) {
      return `Item ${i + 1}: Quantity must be greater than 0`;
    }
    if (item.unitPrice < 0) {
      return `Item ${i + 1}: Unit price cannot be negative`;
    }
  }

  return null;
};
