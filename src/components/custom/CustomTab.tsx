import React from 'react';
import type { Invoice, CustomOptions } from '../../types/invoice';
import InvoiceForm from './InvoiceForm';
import InvoicePreview from './InvoicePreview';

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
  onTestCustomInvoice
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      marginBottom: '24px',
      height: 'calc(100vh - 200px)', // Account for header and tab navigation
      alignItems: 'stretch'
    }}>
      {/* Form Section - Scrollable */}
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

      {/* Preview Section - Full Height */}
      <InvoicePreview
        customInvoice={customInvoice}
        customOptions={customOptions}
      />
    </div>
  );
};

export default CustomTab;
