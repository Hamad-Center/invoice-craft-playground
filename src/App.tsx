import { useState } from 'react';
import type { Invoice, CustomOptions } from './types/invoice';
import { testCases } from './data/testCases';
import { validateInvoice } from './utils/invoiceUtils';
import { testDirectPdfMake, testLibraryImport } from './services/pdfService';
import { generateInvoicePdf } from 'invoice-craft';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import StatusSection from './components/StatusSection';
import PresetsTab from './components/presets/PresetsTab';
import CustomTab from './components/custom/CustomTab';
import AdvancedTab from './components/advanced/AdvancedTab';

function App() {
  const [status, setStatus] = useState('Ready to test');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState('basic');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'advanced'>('presets');

  // Custom form state
  const [customInvoice, setCustomInvoice] = useState<Invoice>({
    from: {
      name: '',
      address: '',
      email: '',
      phone: ''
    },
    to: {
      name: '',
      address: '',
      email: '',
      phone: ''
    },
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    currency: 'USD',
    items: [
      { description: '', quantity: 1, unitPrice: 0, taxRate: 0 }
    ],
    discount: 0,
    notes: '',
    terms: ''
  });

  const [customOptions, setCustomOptions] = useState<CustomOptions>({
    layoutStyle: 'default',
    brandColor: '#2563eb',
    logoUrl: '',
    customLabels: false,
    labels: {
      invoice: 'Invoice',
      date: 'Date',
      dueDate: 'Due Date',
      from: 'From',
      to: 'To',
      description: 'Description',
      quantity: 'Qty',
      unitPrice: 'Unit Price',
      tax: 'Tax',
      total: 'Total',
      subtotal: 'Subtotal',
      discount: 'Discount',
      notes: 'Notes',
      terms: 'Terms'
    }
  });

  // Helper functions for custom form
  const addItem = () => {
    setCustomInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0, taxRate: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setCustomInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setCustomInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateInvoiceField = (section: string, field: string, value: any) => {
    setCustomInvoice(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [field]: value
      }
    }));
  };

  const updateRootField = (field: string, value: any) => {
    setCustomInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testCustomInvoice = async () => {
    setIsLoading(true);
    setStatus('Testing custom invoice...');

    try {
      setStatus('Validating custom invoice data...');

      const validationError = validateInvoice(customInvoice);
      if (validationError) {
        throw new Error(validationError);
      }

      setStatus('Generating custom PDF...');

      const options: any = {
        layoutStyle: customOptions.layoutStyle,
        brandColor: customOptions.brandColor
      };

      if (customOptions.logoUrl.trim()) {
        options.logoUrl = customOptions.logoUrl;
      }

      if (customOptions.customLabels) {
        options.labels = customOptions.labels;
      }

      console.log('Generating custom invoice:', customInvoice, options);

      const result = await Promise.race([
        generateInvoicePdf(customInvoice, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Custom invoice generation timeout')), 30000)
        )
      ]);

      setStatus('Custom PDF generated successfully! Downloading...');

      // Trigger download
      const { blob, filename } = result as { blob: Blob; filename: string };
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('Custom invoice test successful! PDF downloaded.');
    } catch (error) {
      console.error('Custom invoice error:', error);
      setStatus(`Custom Invoice Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestDirectPdfMake = () => {
    testDirectPdfMake(setStatus, setIsLoading);
  };

  const handleTestLibraryImport = () => {
    const currentTestCase = testCases[selectedTest as keyof typeof testCases];
    testLibraryImport(currentTestCase.invoice, currentTestCase.options, setStatus, setIsLoading);
  };

  const handleTestAllCases = async () => {
    for (const [key, testCase] of Object.entries(testCases)) {
      setSelectedTest(key);
      await new Promise(resolve => setTimeout(resolve, 500));
      await testLibraryImport(testCase.invoice, testCase.options, setStatus, setIsLoading);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };



  const currentTestCase = testCases[selectedTest as keyof typeof testCases];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #6366f1 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <Header />

      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'presets' && (
          <PresetsTab
            testCases={testCases}
            selectedTest={selectedTest}
            setSelectedTest={setSelectedTest}
            currentTestCase={currentTestCase}
            isLoading={isLoading}
            onTestDirectPdfMake={handleTestDirectPdfMake}
            onTestLibraryImport={handleTestLibraryImport}
            onTestAllCases={handleTestAllCases}
          />
        )}

        {activeTab === 'custom' && (
          <CustomTab
            customInvoice={customInvoice}
            customOptions={customOptions}
            isLoading={isLoading}
            onUpdateInvoiceField={updateInvoiceField}
            onUpdateRootField={updateRootField}
            onUpdateItem={updateItem}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onSetCustomOptions={setCustomOptions}
            onTestCustomInvoice={testCustomInvoice}
          />
        )}

        {activeTab === 'advanced' && (
          <AdvancedTab
            setStatus={setStatus}
            setIsLoading={setIsLoading}
          />
        )}

        <StatusSection status={status} />
      </div>
    </div>
  );
}

export default App;
