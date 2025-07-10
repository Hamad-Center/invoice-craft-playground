import React from 'react';
import type { Invoice, CustomOptions } from '../../types/invoice';

interface InvoicePreviewProps {
  customInvoice: Invoice;
  customOptions: CustomOptions;
}

// Calculate invoice totals
const calculatePreviewTotals = (invoice: Invoice) => {
  let subtotal = 0;
  let totalTax = 0;

  invoice.items.forEach(item => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;

    if (item.taxRate) {
      totalTax += itemTotal * item.taxRate;
    }
  });

  const discount = invoice.discount || 0;
  const total = subtotal + totalTax - discount;

  return {
    subtotal,
    totalTax,
    total
  };
};

// Modern preview component that matches the PDF output exactly
const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  customInvoice,
  customOptions
}) => {
  const totals = calculatePreviewTotals(customInvoice);
  const layoutStyle = customOptions.layoutStyle || 'default';
  const brandColor = customOptions.brandColor || '#3b82f6';
  
  // Get all item keys dynamically (same as PDF generation)
  const allItemKeys = Array.from(
    new Set(customInvoice.items.flatMap(item => Object.keys(item)))
  );

  // Modern styling that matches PDF output
  const getModernStyles = () => {
    const baseStyles = {
      companyName: { fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', color: brandColor },
      companyInfo: { fontSize: '11px', margin: '2px 0', color: '#64748b' },
      invoiceTitle: { fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0', color: brandColor },
      invoiceDetail: { fontSize: '12px', margin: '2px 0' },
      sectionTitle: { fontSize: '12px', fontWeight: '700', margin: '0 0 8px 0', color: brandColor },
      clientName: { fontSize: '14px', fontWeight: '700', margin: '0 0 5px 0' },
      clientInfo: { fontSize: '11px', margin: '2px 0', color: '#64748b' },
      totalLine: { fontSize: '12px', margin: '3px 0' },
      grandTotal: { fontSize: '16px', fontWeight: '700', margin: '10px 0 0 0', color: brandColor },
      notes: { fontSize: '11px', color: '#64748b' },
      terms: { fontSize: '10px', color: '#64748b' }
    };

    switch (layoutStyle) {
      case 'minimal':
        return {
          ...baseStyles,
          companyName: { ...baseStyles.companyName, fontSize: '20px' },
          invoiceTitle: { ...baseStyles.invoiceTitle, fontSize: '24px' }
        };
      case 'creative':
        return {
          ...baseStyles,
          companyName: { ...baseStyles.companyName, fontSize: '22px' },
          invoiceTitle: { ...baseStyles.invoiceTitle, fontSize: '30px' }
        };
      default:
        return baseStyles;
    }
  };

  const styles = getModernStyles();

  const getTableStyles = () => {
    const baseTable = {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginBottom: '30px'
    };

    const baseHeaderCell = {
      padding: '8px',
      textAlign: 'left' as const,
      fontSize: '11px',
      fontWeight: '700',
      color: 'white',
      backgroundColor: brandColor
    };

    const baseCell = {
      padding: '8px 8px',
      fontSize: '11px',
      border: 'none'
    };

    switch (layoutStyle) {
      case 'minimal':
        return {
          table: baseTable,
          headerCell: { ...baseHeaderCell, backgroundColor: '#f9fafb', color: '#000', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' },
          cell: { ...baseCell, padding: '8px 0' },
          alternateRow: { backgroundColor: 'transparent' }
        };
      case 'creative':
        return {
          table: baseTable,
          headerCell: { ...baseHeaderCell, backgroundColor: '#8b5cf6' },
          cell: baseCell,
          alternateRow: { backgroundColor: '#faf5ff' }
        };
      default:
        return {
          table: baseTable,
          headerCell: baseHeaderCell,
          cell: baseCell,
          alternateRow: { backgroundColor: '#f8fafc' }
        };
    }
  };

  const tableStyles = getTableStyles();

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(15px)',
      padding: '16px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Preview Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '2px solid rgba(59, 130, 246, 0.15)'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.4rem',
          fontWeight: '700',
          color: '#1f2937'
        }}>
          👁️ Live Preview ({layoutStyle})
        </h3>
      </div>

      {/* Modern PDF-Style Content - Scrollable */}
      <div style={{
        background: 'white',
        padding: '40px 50px',
        borderRadius: '8px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '11px',
        lineHeight: '1.4',
        color: '#000000',
        border: '1px solid #e5e7eb',
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#667eea rgba(255, 255, 255, 0.1)'
      }}>
        {/* Modern Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={styles.companyName}>
              {customInvoice.from.name || 'Your Company Name'}
            </h1>
            {customInvoice.from.address && <div style={styles.companyInfo}>{customInvoice.from.address}</div>}
            {customInvoice.from.email && <div style={styles.companyInfo}>{customInvoice.from.email}</div>}
            {customInvoice.from.phone && <div style={styles.companyInfo}>{customInvoice.from.phone}</div>}
          </div>
          {customOptions.logoUrl && (
            <div style={{
              width: '120px',
              height: '60px',
              background: '#f3f4f6',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#6b7280'
            }}>
              Logo
            </div>
          )}
        </div>

        {/* Modern Invoice Details Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={styles.invoiceTitle}>INVOICE</h2>
            <div style={styles.invoiceDetail}>Invoice #: {customInvoice.invoiceNumber || 'INV-001'}</div>
            <div style={styles.invoiceDetail}>Date: {customInvoice.invoiceDate || new Date().toLocaleDateString()}</div>
            {customInvoice.dueDate && <div style={styles.invoiceDetail}>Due Date: {customInvoice.dueDate}</div>}
          </div>
          <div style={{ width: '200px' }}>
            <h3 style={styles.sectionTitle}>TO</h3>
            <div style={styles.clientName}>{customInvoice.to.name || 'Customer Name'}</div>
            {customInvoice.to.address && <div style={styles.clientInfo}>{customInvoice.to.address}</div>}
            {customInvoice.to.email && <div style={styles.clientInfo}>{customInvoice.to.email}</div>}
            {customInvoice.to.phone && <div style={styles.clientInfo}>{customInvoice.to.phone}</div>}
          </div>
        </div>

        {/* Modern Items Table */}
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {allItemKeys.map((key, index) => (
                <th key={index} style={tableStyles.headerCell}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customInvoice.items.map((item, index) => (
              <tr key={index} style={index % 2 === 1 ? tableStyles.alternateRow : {}}>
                {allItemKeys.map((key, keyIndex) => (
                  <td key={keyIndex} style={tableStyles.cell}>
                    {item[key as keyof typeof item] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modern Totals Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}></div>
          <div style={{ width: '200px', textAlign: 'right' }}>
            <div style={styles.totalLine}>Subtotal: {customInvoice.currency || 'USD'} {totals.subtotal.toFixed(2)}</div>
            {customInvoice.discount && (
              <div style={styles.totalLine}>Discount: {customInvoice.currency || 'USD'} {customInvoice.discount.toFixed(2)}</div>
            )}
            {totals.totalTax > 0 && (
              <div style={styles.totalLine}>Tax: {customInvoice.currency || 'USD'} {totals.totalTax.toFixed(2)}</div>
            )}
            <div style={styles.grandTotal}>
              Total: {customInvoice.currency || 'USD'} {totals.total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {customInvoice.notes && (
          <div style={{ marginTop: '20px' }}>
            <div style={styles.notes}>Notes: {customInvoice.notes}</div>
          </div>
        )}

        {customInvoice.terms && (
          <div style={{ marginTop: '10px' }}>
            <div style={styles.terms}>Terms: {customInvoice.terms}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;
