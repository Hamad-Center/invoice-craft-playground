import React from 'react';
import type { Invoice, CustomOptions } from '../../types/invoice';
import CompanySection from './CompanySection';
import InvoiceDetailsSection from './InvoiceDetailsSection';
import ItemsSection from './ItemsSection';
import AdditionalOptionsSection from './AdditionalOptionsSection';
import GenerateButton from './GenerateButton';

interface InvoiceFormProps {
  customInvoice: Invoice;
  customOptions: CustomOptions;
  isLoading: boolean;
  onUpdateInvoiceField: (section: string, field: string, value: any) => void;
  onUpdateRootField: (field: string, value: any) => void;
  onUpdateItem: (index: number, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSetCustomOptions: (options: CustomOptions | ((prev: CustomOptions) => CustomOptions)) => void;
  onTestCustomInvoice: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  customInvoice,
  customOptions,
  isLoading,
  onUpdateInvoiceField,
  onUpdateRootField,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onSetCustomOptions,
  onTestCustomInvoice
}) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(15px)',
      padding: '16px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      height: '100%',
      overflowY: 'auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      scrollbarWidth: 'thin',
      scrollbarColor: '#667eea rgba(255, 255, 255, 0.1)',
      position: 'relative' as const
    }}>
      {/* Compact Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '2px solid rgba(102, 126, 234, 0.15)'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.4rem',
          fontWeight: '700',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ✏️ Create Custom Invoice
        </h3>
        <div style={{
          padding: '4px 12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          👁️ Live Preview
        </div>
      </div>

      <CompanySection
        customInvoice={customInvoice}
        onUpdateInvoiceField={onUpdateInvoiceField}
      />

      <InvoiceDetailsSection
        customInvoice={customInvoice}
        onUpdateRootField={onUpdateRootField}
      />

      <ItemsSection
        customInvoice={customInvoice}
        onUpdateItem={onUpdateItem}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />

      <AdditionalOptionsSection
        customInvoice={customInvoice}
        customOptions={customOptions}
        onUpdateRootField={onUpdateRootField}
        onSetCustomOptions={onSetCustomOptions}
      />

      <GenerateButton
        customInvoice={customInvoice}
        isLoading={isLoading}
        onTestCustomInvoice={onTestCustomInvoice}
      />
    </div>
  );
};

export default InvoiceForm;
