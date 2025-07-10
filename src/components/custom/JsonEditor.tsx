import React, { useState, useEffect } from 'react';
import type { Invoice, CustomOptions } from '../../types/invoice';

interface JsonEditorProps {
  customInvoice: Invoice;
  customOptions: CustomOptions;
  isLoading: boolean;
  onUpdateInvoice: (invoice: Invoice) => void;
  onSetCustomOptions: (options: CustomOptions | ((prev: CustomOptions) => CustomOptions)) => void;
  onTestCustomInvoice: () => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  customInvoice,
  customOptions,
  isLoading,
  onUpdateInvoice,
  onSetCustomOptions,
  onTestCustomInvoice
}) => {
  const [jsonValue, setJsonValue] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');

  // Create complete configuration object
  const createCompleteConfig = () => ({
    invoice: customInvoice,
    options: customOptions
  });

  // Update JSON when invoice or options change
  useEffect(() => {
    setJsonValue(JSON.stringify(createCompleteConfig(), null, 2));
  }, [customInvoice, customOptions]);

  const handleJsonChange = (value: string) => {
    setJsonValue(value);
    setJsonError('');

    try {
      const parsed = JSON.parse(value);

      // Check if it's the complete config format or just invoice data
      if (parsed.invoice && parsed.options) {
        // Complete config format
        const { invoice, options } = parsed;

        // Validate invoice structure
        if (!invoice.from || !invoice.to || !invoice.items) {
          setJsonError('Invalid invoice structure: missing required fields (invoice.from, invoice.to, invoice.items)');
          return;
        }

        if (!Array.isArray(invoice.items)) {
          setJsonError('Invalid invoice structure: invoice.items must be an array');
          return;
        }

        // Validate options structure
        if (!options.layoutStyle || !options.brandColor) {
          setJsonError('Invalid options structure: missing required fields (layoutStyle, brandColor)');
          return;
        }

        onUpdateInvoice(invoice);
        onSetCustomOptions(options);
      } else {
        // Legacy format - just invoice data
        if (!parsed.from || !parsed.to || !parsed.items) {
          setJsonError('Invalid invoice structure: missing required fields (from, to, items)');
          return;
        }

        if (!Array.isArray(parsed.items)) {
          setJsonError('Invalid invoice structure: items must be an array');
          return;
        }

        onUpdateInvoice(parsed);
      }
    } catch (error) {
      setJsonError(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      setJsonValue(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (error) {
      setJsonError(`Cannot format invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const resetToDefault = () => {
    const defaultConfig = {
      invoice: {
        from: {
          name: 'Your Company Name',
          address: '123 Business St\nCity, State 12345',
          email: 'contact@yourcompany.com',
          phone: '+1 (555) 123-4567'
        },
        to: {
          name: 'Client Company',
          address: '456 Client Ave\nClient City, State 67890',
          email: 'billing@client.com',
          phone: '+1 (555) 987-6543'
        },
        invoiceNumber: 'INV-001',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: 'USD',
        items: [
          {
            description: 'Professional Services',
            quantity: 10,
            unitPrice: 150.00,
            taxRate: 0.08
          },
          {
            description: 'Consultation',
            quantity: 5,
            unitPrice: 200.00,
            taxRate: 0.08
          }
        ],
        discount: 100,
        notes: 'Thank you for your business!',
        terms: 'Payment is due within 30 days of invoice date.'
      },
      options: {
        layoutStyle: 'modern' as const,
        brandColor: '#3b82f6',
        logoUrl: '',
        customLabels: true,
        labels: {
          invoice: 'INVOICE',
          date: 'Date',
          dueDate: 'Due Date',
          from: 'From',
          to: 'Bill To',
          description: 'Description',
          quantity: 'Qty',
          unitPrice: 'Rate',
          tax: 'Tax',
          total: 'Total',
          subtotal: 'Subtotal',
          discount: 'Discount',
          notes: 'Notes',
          terms: 'Terms & Conditions'
        }
      }
    };

    setJsonValue(JSON.stringify(defaultConfig, null, 2));
    onUpdateInvoice(defaultConfig.invoice);
    onSetCustomOptions(defaultConfig.options);
    setJsonError('');
  };

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
      {/* Header */}
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
          📝 JSON Editor - Complete Configuration
        </h3>
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={formatJson}
            style={{
              padding: '6px 12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🎨 Format
          </button>
          <button
            onClick={resetToDefault}
            style={{
              padding: '6px 12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Description */}
      <div style={{
        marginBottom: '16px',
        padding: '12px',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0c4a6e'
      }}>
        <strong>💡 Complete Configuration:</strong> Edit both invoice data and styling options in one JSON structure.
        <br />
        <strong>Structure:</strong> <code>{"{ \"invoice\": {...}, \"options\": {...} }"}</code>
        <br />
        <strong>Options include:</strong> layoutStyle (default/modern/minimal/creative), brandColor, logoUrl, customLabels, labels
      </div>

      {/* JSON Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <textarea
          value={jsonValue}
          onChange={(e) => handleJsonChange(e.target.value)}
          style={{
            flex: 1,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '13px',
            lineHeight: '1.5',
            padding: '16px',
            border: jsonError ? '2px solid #ef4444' : '2px solid #e5e7eb',
            borderRadius: '12px',
            background: '#f8fafc',
            resize: 'none',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          placeholder="Enter your invoice JSON here..."
        />

        {/* Error Display */}
        {jsonError && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ⚠️ {jsonError}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={onTestCustomInvoice}
          disabled={isLoading || !!jsonError}
          style={{
            marginTop: '16px',
            padding: '14px 24px',
            background: isLoading || jsonError 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: isLoading || jsonError ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isLoading || jsonError 
              ? 'none' 
              : '0 4px 20px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Generating...
            </>
          ) : (
            <>
              📄 Generate PDF
            </>
          )}
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default JsonEditor;
