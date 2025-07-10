import React from 'react';
import type { Invoice } from '../../types/invoice';

interface InvoiceDetailsSectionProps {
  customInvoice: Invoice;
  onUpdateRootField: (field: string, value: any) => void;
}

const InvoiceDetailsSection: React.FC<InvoiceDetailsSectionProps> = ({
  customInvoice,
  onUpdateRootField
}) => {
  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(209, 213, 219, 0.5)',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    boxSizing: 'border-box' as const
  };

  const requiredInputStyle = (hasValue: boolean) => ({
    ...inputStyle,
    border: hasValue ? '2px solid #10b981' : '1px solid rgba(209, 213, 219, 0.5)'
  });

  const labelStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
    gap: '4px'
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.15)'
      }}>
        <h4 style={{
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 Invoice Details
        </h4>
      </div>

      <div style={{
        background: 'rgba(139, 92, 246, 0.06)',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid rgba(139, 92, 246, 0.15)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>
              🔢 Invoice Number *
            </label>
            <input
              type="text"
              placeholder="INV-2024-001"
              value={customInvoice.invoiceNumber}
              onChange={(e) => onUpdateRootField('invoiceNumber', e.target.value)}
              style={requiredInputStyle(!!customInvoice.invoiceNumber)}
            />
          </div>
          <div>
            <label style={labelStyle}>
              📅 Invoice Date *
            </label>
            <input
              type="date"
              value={customInvoice.invoiceDate}
              onChange={(e) => onUpdateRootField('invoiceDate', e.target.value)}
              style={requiredInputStyle(!!customInvoice.invoiceDate)}
            />
          </div>
          <div>
            <label style={labelStyle}>
              ⏰ Due Date
            </label>
            <input
              type="date"
              value={customInvoice.dueDate || ''}
              onChange={(e) => onUpdateRootField('dueDate', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>
              💰 Currency
            </label>
            <select
              value={customInvoice.currency}
              onChange={(e) => onUpdateRootField('currency', e.target.value)}
              style={{
                ...inputStyle,
                cursor: 'pointer'
              }}
            >
              <option value="USD">🇺🇸 USD - US Dollar</option>
              <option value="EUR">🇪🇺 EUR - Euro</option>
              <option value="GBP">🇬🇧 GBP - British Pound</option>
              <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
              <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
              <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsSection;
