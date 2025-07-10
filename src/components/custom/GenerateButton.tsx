import React from 'react';
import type { Invoice } from '../../types/invoice';

interface GenerateButtonProps {
  customInvoice: Invoice;
  isLoading: boolean;
  onTestCustomInvoice: () => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  customInvoice,
  isLoading,
  onTestCustomInvoice
}) => {
  const isDisabled = isLoading || !customInvoice.from.name || !customInvoice.to.name || !customInvoice.invoiceNumber || !customInvoice.invoiceDate;

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '12px',
      padding: '12px',
      background: 'rgba(102, 126, 234, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(102, 126, 234, 0.1)'
    }}>
      <button
        onClick={onTestCustomInvoice}
        disabled={isDisabled}
        style={{
          padding: '12px 24px',
          background: isDisabled
            ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: isDisabled ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          maxWidth: '300px',
          margin: '0 auto'
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }
        }}
      >
        {isLoading ? (
          <>⏳ Generating PDF...</>
        ) : !customInvoice.from.name || !customInvoice.to.name || !customInvoice.invoiceNumber || !customInvoice.invoiceDate ? (
          <>⚠️ Fill Required Fields</>
        ) : (
          <>🚀 Generate Custom PDF</>
        )}
      </button>

      {(!customInvoice.from.name || !customInvoice.to.name || !customInvoice.invoiceNumber || !customInvoice.invoiceDate) && (
        <div style={{
          marginTop: '8px',
          padding: '6px 12px',
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#d97706',
          textAlign: 'center'
        }}>
          ⚠️ Required: Company Name, Customer Name, Invoice #, Date
        </div>
      )}
    </div>
  );
};

export default GenerateButton;
