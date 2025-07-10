import React, { useState } from 'react';
import type { Invoice, CustomOptions } from '../../types/invoice';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';
import JsonEditor from './JsonEditor';

interface CustomTabProps {
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
  onUpdateInvoice: (invoice: Invoice) => void;
}

const CustomTab: React.FC<CustomTabProps> = ({
  customInvoice,
  customOptions,
  isLoading,
  onUpdateInvoiceField,
  onUpdateRootField,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  onSetCustomOptions,
  onTestCustomInvoice,
  onUpdateInvoice
}) => {
  const [inputMode, setInputMode] = useState<'fields' | 'json'>('fields');

  return (
    <div>
      {/* Mode Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '6px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <button
            onClick={() => setInputMode('fields')}
            style={{
              padding: '10px 20px',
              backgroundColor: inputMode === 'fields' ? '#3b82f6' : 'transparent',
              color: inputMode === 'fields' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: inputMode === 'fields' ? '0 4px 20px rgba(59, 130, 246, 0.4)' : 'none'
            }}
          >
            📝 Fields
          </button>

          <button
            onClick={() => setInputMode('json')}
            style={{
              padding: '10px 20px',
              backgroundColor: inputMode === 'json' ? '#3b82f6' : 'transparent',
              color: inputMode === 'json' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: inputMode === 'json' ? '0 4px 20px rgba(59, 130, 246, 0.4)' : 'none'
            }}
          >
            🔧 JSON
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px',
        height: 'calc(100vh - 220px)', // Account for header and mode toggle
        alignItems: 'stretch'
      }}>
        {/* Input Section */}
        {inputMode === 'fields' ? (
          <InvoiceForm
            customInvoice={customInvoice}
            customOptions={customOptions}
            isLoading={isLoading}
            onUpdateInvoiceField={onUpdateInvoiceField}
            onUpdateRootField={onUpdateRootField}
            onUpdateItem={onUpdateItem}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
            onSetCustomOptions={onSetCustomOptions}
            onTestCustomInvoice={onTestCustomInvoice}
          />
        ) : (
          <JsonEditor
            customInvoice={customInvoice}
            customOptions={customOptions}
            isLoading={isLoading}
            onUpdateInvoice={onUpdateInvoice}
            onSetCustomOptions={onSetCustomOptions}
            onTestCustomInvoice={onTestCustomInvoice}
          />
        )}

        {/* Preview Section - Full Height */}
        <InvoicePreview
          customInvoice={customInvoice}
          customOptions={customOptions}
        />
      </div>
    </div>
  );
};

export default CustomTab;
