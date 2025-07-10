import React from 'react';
import type { Invoice } from '../../types/invoice';

interface CompanySectionProps {
  customInvoice: Invoice;
  onUpdateInvoiceField: (section: string, field: string, value: any) => void;
}

const CompanySection: React.FC<CompanySectionProps> = ({
  customInvoice,
  onUpdateInvoiceField
}) => {
  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(209, 213, 219, 0.5)',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    boxSizing: 'border-box' as const
  };

  const requiredInputStyle = (hasValue: boolean) => ({
    ...inputStyle,
    border: hasValue ? '2px solid #10b981' : '1px solid rgba(209, 213, 219, 0.5)'
  });

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(102, 126, 234, 0.15)'
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
          🏢 Company Information
        </h4>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        minWidth: 0
      }}>
        <div style={{
          background: 'rgba(102, 126, 234, 0.06)',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.15)',
          minWidth: 0,
          overflow: 'hidden'
        }}>
          <h5 style={{
            margin: '0 0 8px 0',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#667eea',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            📤 From (Your Company)
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              placeholder="Company Name *"
              value={customInvoice.from.name}
              onChange={(e) => onUpdateInvoiceField('from', 'name', e.target.value)}
              style={requiredInputStyle(!!customInvoice.from.name)}
            />
            <textarea
              placeholder="Address (Street, City, State, ZIP)"
              value={customInvoice.from.address || ''}
              onChange={(e) => onUpdateInvoiceField('from', 'address', e.target.value)}
              style={{
                ...inputStyle,
                minHeight: '70px',
                resize: 'vertical' as const,
                boxSizing: 'border-box' as const
              }}
            />
            <input
              type="email"
              placeholder="📧 Email Address"
              value={customInvoice.from.email || ''}
              onChange={(e) => onUpdateInvoiceField('from', 'email', e.target.value)}
              style={inputStyle}
            />
            <input
              type="tel"
              placeholder="📞 Phone Number"
              value={customInvoice.from.phone || ''}
              onChange={(e) => onUpdateInvoiceField('from', 'phone', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.15)',
          minWidth: 0,
          overflow: 'hidden'
        }}>
          <h5 style={{
            margin: '0 0 8px 0',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            📥 To (Customer)
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              placeholder="Customer Name *"
              value={customInvoice.to.name}
              onChange={(e) => onUpdateInvoiceField('to', 'name', e.target.value)}
              style={requiredInputStyle(!!customInvoice.to.name)}
            />
            <textarea
              placeholder="Address (Street, City, State, ZIP)"
              value={customInvoice.to.address || ''}
              onChange={(e) => onUpdateInvoiceField('to', 'address', e.target.value)}
              style={{
                ...inputStyle,
                minHeight: '70px',
                resize: 'vertical' as const,
                boxSizing: 'border-box' as const
              }}
            />
            <input
              type="email"
              placeholder="📧 Email Address"
              value={customInvoice.to.email || ''}
              onChange={(e) => onUpdateInvoiceField('to', 'email', e.target.value)}
              style={inputStyle}
            />
            <input
              type="tel"
              placeholder="📞 Phone Number"
              value={customInvoice.to.phone || ''}
              onChange={(e) => onUpdateInvoiceField('to', 'phone', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySection;
