import { useState } from 'react';
import { 
  generatePreviewHTML,
  exportInvoice,
  validateInvoice,
  validateInvoiceStrict,
  generateBatchInvoices,
  createPlugin,
  builtInPlugins,
  modernTemplate,
  minimalTemplate,
  creativeTemplate,
  createTestBatch
} from 'invoice-craft';
import type { InvoiceData } from 'invoice-craft';

interface AdvancedTabProps {
  setStatus: (status: string) => void;
  setIsLoading: (loading: boolean) => void;
}

const sampleInvoice: InvoiceData = {
  from: {
    name: "Tech Solutions Inc",
    address: "123 Business Street\nSuite 100\nTech City, TC 12345",
    email: "contact@techsolutions.com",
    phone: "+1 (555) 123-4567",
    brandColor: "#3b82f6"
  },
  to: {
    name: "Client Corporation",
    address: "456 Client Avenue\nClient City, CC 67890",
    email: "billing@clientcorp.com",
    phone: "+1 (555) 987-6543"
  },
  invoiceNumber: "INV-2024-001",
  invoiceDate: "2024-01-15",
  dueDate: "2024-02-15",
  currency: "USD",
  items: [
    {
      description: "Web Development Services",
      quantity: 40,
      unitPrice: 125.00,
      taxRate: 0.10
    },
    {
      description: "UI/UX Design",
      quantity: 20,
      unitPrice: 150.00,
      taxRate: 0.10
    }
  ],
  terms: "Payment due within 30 days",
  notes: "Thank you for your business!"
};

export default function AdvancedTab({ setStatus, setIsLoading }: AdvancedTabProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [batchProgress, setBatchProgress] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'html' | 'json' | 'csv'>('pdf');
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'minimal' | 'creative'>('modern');
  const [isLoading, setLocalIsLoading] = useState<boolean>(false);

  // Sync local loading state with parent
  const handleSetLoading = (loading: boolean) => {
    setLocalIsLoading(loading);
    setIsLoading(loading);
  };

  const testHtmlPreview = () => {
    setStatus('Generating HTML preview...');
    try {
      const html = generatePreviewHTML(sampleInvoice, {
        theme: 'light',
        responsive: true,
        includeStyles: true
      });
      setPreviewHtml(html);
      setStatus('HTML preview generated successfully!');
    } catch (error) {
      setStatus(`HTML preview failed: ${error}`);
    }
  };

  const testExportFormats = async () => {
    setStatus(`Exporting as ${selectedFormat.toUpperCase()}...`);
    handleSetLoading(true);

    try {
      const result = await exportInvoice(sampleInvoice, {
        format: selectedFormat,
        brandColor: '#3b82f6',
        includeStyles: true
      });

      // Download the exported file
      let url: string;
      if (result.data instanceof Blob) {
        url = URL.createObjectURL(result.data);
      } else {
        const blob = new Blob([result.data], { type: result.mimeType });
        url = URL.createObjectURL(blob);
      }

      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus(`${selectedFormat.toUpperCase()} export completed successfully!`);
    } catch (error) {
      setStatus(`Export failed: ${error}`);
    } finally {
      handleSetLoading(false);
    }
  };

  const testValidation = () => {
    setStatus('Running validation tests...');
    
    // Test with valid invoice
    const validResult = validateInvoice(sampleInvoice);
    
    // Test with invalid invoice
    const invalidInvoice = { ...sampleInvoice, invoiceNumber: '', items: [] };
    const invalidResult = validateInvoice(invalidInvoice);
    
    // Test strict validation
    const strictResult = validateInvoiceStrict(sampleInvoice);
    
    setValidationResult({
      valid: validResult,
      invalid: invalidResult,
      strict: strictResult
    });
    
    setStatus('Validation tests completed!');
  };

  const testBatchProcessing = async () => {
    setStatus('Starting batch processing test...');
    handleSetLoading(true);
    setBatchProgress('');

    try {
      const testInvoices = createTestBatch(5); // Create 5 test invoices

      const result = await generateBatchInvoices(testInvoices, {
        concurrency: 2,
        onProgress: (completed, total) => {
          const progress = `Progress: ${completed}/${total} (${((completed/total)*100).toFixed(1)}%)`;
          setBatchProgress(progress);
          setStatus(progress);
        },
        onError: (error, _invoice, index) => {
          console.error(`Error processing invoice ${index}:`, error);
        }
      });

      // Download all successful PDFs
      result.success.forEach((item, index) => {
        setTimeout(() => {
          const url = URL.createObjectURL(item.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = item.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, index * 500); // Stagger downloads
      });

      setStatus(`Batch processing completed! ${result.summary.successful} successful, ${result.summary.failed} failed`);
    } catch (error) {
      setStatus(`Batch processing failed: ${error}`);
    } finally {
      handleSetLoading(false);
    }
  };

  const testPlugins = async () => {
    setStatus('Testing plugin system...');
    handleSetLoading(true);

    try {
      // Create a custom plugin
      const customPlugin = createPlugin({
        name: 'demo-plugin',
        beforeRender: (invoice) => {
          invoice.notes = `${invoice.notes}\n\nProcessed by demo plugin at ${new Date().toLocaleString()}`;
          return invoice;
        }
      });

      const { generateInvoicePdf } = await import('invoice-craft');

      const { blob, filename } = await generateInvoicePdf(sampleInvoice, {
        plugins: [customPlugin, builtInPlugins.currencyFormatter, builtInPlugins.dateValidator]
      });

      // Download the PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('Plugin test completed successfully!');
    } catch (error) {
      setStatus(`Plugin test failed: ${error}`);
    } finally {
      handleSetLoading(false);
    }
  };

  const testCustomTemplate = async () => {
    setStatus('Testing custom template...');
    handleSetLoading(true);

    try {
      let template;
      switch (selectedTemplate) {
        case 'modern':
          template = modernTemplate;
          break;
        case 'minimal':
          template = minimalTemplate;
          break;
        case 'creative':
          template = creativeTemplate;
          break;
        default:
          template = modernTemplate;
      }

      const { generateInvoicePdf } = await import('invoice-craft');

      const { blob, filename } = await generateInvoicePdf(sampleInvoice, {
        customTemplate: template,
        brandColor: '#3b82f6'
      });

      // Download the PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus(`${selectedTemplate} template test completed successfully!`);
    } catch (error) {
      setStatus(`Template test failed: ${error}`);
    } finally {
      handleSetLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '12px',
          margin: '0 0 12px 0'
        }}>
          🚀 Advanced Features
        </h2>
        <p style={{
          color: '#6b7280',
          maxWidth: '600px',
          margin: '0 auto',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Explore the powerful capabilities of invoice-craft with live previews, multiple export formats,
          batch processing, plugins, and custom templates.
        </p>
      </div>

      {/* Feature Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
        gap: '32px',
        marginBottom: '32px'
      }}>

        {/* HTML Preview Section */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #bfdbfe',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{
              backgroundColor: '#3b82f6',
              padding: '12px',
              borderRadius: '12px',
              marginRight: '16px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🔍</span>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                HTML Preview
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: '0'
              }}>
                Generate live previews without PDF creation
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={testHtmlPreview}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
              }}
            >
              ✨ Generate HTML Preview
            </button>

            {previewHtml && (
              <div style={{
                border: '2px solid #bfdbfe',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  padding: '12px 16px',
                  borderBottom: '1px solid #bfdbfe'
                }}>
                  <span style={{
                    color: 'white',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ marginRight: '8px' }}>👁️</span>
                    Live Preview
                  </span>
                </div>
                <iframe
                  srcDoc={previewHtml}
                  style={{
                    width: '100%',
                    height: '384px',
                    border: '0'
                  }}
                  title="Invoice Preview"
                />
              </div>
            )}
          </div>
        </div>

        {/* Export Formats Section */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #bbf7d0',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{
              backgroundColor: '#10b981',
              padding: '12px',
              borderRadius: '12px',
              marginRight: '16px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📤</span>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                Export Formats
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: '0'
              }}>
                Export invoices in multiple formats
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
              }}>
                Choose Export Format:
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
              }}>
                {(['pdf', 'html', 'json', 'csv'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: selectedFormat === format ? '2px solid #10b981' : '2px solid #e5e7eb',
                      backgroundColor: selectedFormat === format ? '#f0fdf4' : 'white',
                      color: selectedFormat === format ? '#047857' : '#6b7280',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (selectedFormat !== format) {
                        e.currentTarget.style.borderColor = '#86efac';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedFormat !== format) {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={testExportFormats}
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <svg style={{
                    animation: 'spin 1s linear infinite',
                    marginRight: '12px',
                    height: '20px',
                    width: '20px'
                  }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                `🚀 Export as ${selectedFormat.toUpperCase()}`
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">📤 Export Formats</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Export Format:</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="border rounded px-3 py-2"
            >
              <option value="pdf">PDF</option>
              <option value="html">HTML</option>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          
          <button
            onClick={testExportFormats}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Export as {selectedFormat.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Second Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
        gap: '32px',
        marginBottom: '32px'
      }}>

        {/* Advanced Validation Section */}
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #fde68a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{
              backgroundColor: '#f59e0b',
              padding: '12px',
              borderRadius: '12px',
              marginRight: '16px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                Advanced Validation
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: '0'
              }}>
                Comprehensive validation with detailed feedback
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={testValidation}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)';
              }}
            >
              🔍 Run Validation Tests
            </button>

            {validationResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #bbf7d0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✅</span>
                    <h4 style={{ fontWeight: 'bold', color: '#065f46', margin: '0' }}>Valid Invoice Test</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '0.875rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#059669' }}>{validationResult.valid.isValid ? 'PASS' : 'FAIL'}</div>
                      <div style={{ color: '#6b7280' }}>Status</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#dc2626' }}>{validationResult.valid.errors.length}</div>
                      <div style={{ color: '#6b7280' }}>Errors</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#d97706' }}>{validationResult.valid.warnings.length}</div>
                      <div style={{ color: '#6b7280' }}>Warnings</div>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #fecaca',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#ef4444', marginRight: '8px' }}>❌</span>
                    <h4 style={{ fontWeight: 'bold', color: '#991b1b', margin: '0' }}>Invalid Invoice Test</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '0.875rem', marginBottom: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#dc2626' }}>{validationResult.invalid.isValid ? 'PASS' : 'FAIL'}</div>
                      <div style={{ color: '#6b7280' }}>Status</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#dc2626' }}>{validationResult.invalid.errors.length}</div>
                      <div style={{ color: '#6b7280' }}>Errors</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', color: '#d97706' }}>{validationResult.invalid.warnings.length}</div>
                      <div style={{ color: '#6b7280' }}>Warnings</div>
                    </div>
                  </div>
                  {validationResult.invalid.errors.slice(0, 2).map((error: any, index: number) => (
                    <div key={index} style={{
                      fontSize: '0.75rem',
                      color: '#dc2626',
                      backgroundColor: '#fef2f2',
                      padding: '8px',
                      borderRadius: '6px',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontWeight: '500' }}>{error.field}:</span> {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Batch Processing Section */}
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #d8b4fe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{
              backgroundColor: '#8b5cf6',
              padding: '12px',
              borderRadius: '12px',
              marginRight: '16px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                Batch Processing
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: '0'
              }}>
                Process multiple invoices efficiently
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #d8b4fe'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Batch Size:</span>
                <span style={{
                  backgroundColor: '#f3e8ff',
                  color: '#7c3aed',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  5 invoices
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Concurrency:</span>
                <span style={{
                  backgroundColor: '#f3e8ff',
                  color: '#7c3aed',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  2 parallel
                </span>
              </div>
            </div>

            <button
              onClick={testBatchProcessing}
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)';
                }
              }}
            >
              {isLoading ? (
                <>
                  <svg style={{
                    animation: 'spin 1s linear infinite',
                    marginRight: '12px',
                    height: '20px',
                    width: '20px'
                  }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                '🚀 Start Batch Processing'
              )}
            </button>

            {batchProgress && (
              <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #d8b4fe',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#8b5cf6', marginRight: '8px' }}>📊</span>
                  <span style={{ fontWeight: '600', color: '#7c3aed' }}>Progress</span>
                </div>
                <div style={{
                  backgroundColor: '#f3e8ff',
                  borderRadius: '20px',
                  height: '12px',
                  marginBottom: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    height: '12px',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    width: `${batchProgress.includes('100%') ? '100' : batchProgress.match(/\((\d+\.?\d*)%\)/)?.[1] || '0'}%`
                  }}></div>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#7c3aed', margin: '0' }}>{batchProgress}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Third Row - Simplified */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
        gap: '32px',
        marginBottom: '32px'
      }}>

        {/* Plugin System Section */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #93c5fd'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              backgroundColor: '#3b82f6',
              padding: '10px',
              borderRadius: '10px',
              marginRight: '12px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🔌</span>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                Plugin System
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                margin: '0'
              }}>
                Extensible architecture
              </p>
            </div>
          </div>

          <button
            onClick={testPlugins}
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {isLoading ? 'Testing...' : '🧪 Test Plugins'}
          </button>
        </div>

        {/* Custom Templates Section */}
        <div style={{
          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f9a8d4'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{
              backgroundColor: '#ec4899',
              padding: '10px',
              borderRadius: '10px',
              marginRight: '12px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🎨</span>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 4px 0'
              }}>
                Custom Templates
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.8rem',
                margin: '0'
              }}>
                Professional designs
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #f9a8d4',
                backgroundColor: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="modern">Modern Professional</option>
              <option value="minimal">Minimal Clean</option>
              <option value="creative">Creative Design</option>
            </select>
          </div>

          <button
            onClick={testCustomTemplate}
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 10px rgba(236, 72, 153, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {isLoading ? 'Generating...' : `🎨 Test ${selectedTemplate} Template`}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            🎉 All Features Ready!
          </h3>
          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            margin: '0',
            fontSize: '0.95rem'
          }}>
            You've explored all the advanced features of invoice-craft. Each feature demonstrates the library's
            powerful capabilities for modern invoice generation, from live previews to batch processing.
          </p>
        </div>
      </div>
    </div>
  );
}
