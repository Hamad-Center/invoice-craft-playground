import React, { useState } from 'react';
import { generateInvoicePdf } from 'invoice-craft';

interface InvoiceData {
  from: {
    name: string;
    address: string;
    email: string;
    phone?: string;
  };
  to: {
    name: string;
    address: string;
    email: string;
    phone?: string;
  };
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  currency: string;
  terms?: string;
  notes?: string;
}

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string>('');
  
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    from: {
      name: "Your Company",
      address: "123 Business Street\nNew York, NY 10001",
      email: "billing@yourcompany.com",
      phone: "+1 (555) 123-4567"
    },
    to: {
      name: "Client Company",
      address: "456 Client Avenue\nLos Angeles, CA 90210",
      email: "accounts@client.com",
      phone: "+1 (555) 987-6543"
    },
    invoiceNumber: "INV-2025-001",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        description: "Web Development Services",
        quantity: 40,
        unitPrice: 125.00,
        taxRate: 0.08
      },
      {
        description: "UI/UX Design",
        quantity: 20,
        unitPrice: 100.00,
        taxRate: 0.08
      }
    ],
    currency: "USD",
    terms: "Payment due within 30 days. Late payments subject to 1.5% monthly service charge.",
    notes: "Thank you for your business!"
  });

  const [options, setOptions] = useState({
    layoutStyle: 'modern' as 'modern' | 'minimal' | 'creative',
    brandColor: '#3b82f6'
  });

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setStatus('Generating PDF...');
    
    try {
      const result = await generateInvoicePdf(invoiceData, options);
      
      // Create download link
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
      
      setStatus(`✅ Success! Generated ${result.filename} (${result.blob.size} bytes)`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>🎮 Invoice Craft Playground</h1>
        <p>Interactive demo for the invoice-craft library</p>
      </header>

      <div className="card">
        <h2>Quick Demo</h2>
        <p>Click the button below to generate a sample invoice PDF with the current data:</p>
        
        <div style={{ margin: '1rem 0' }}>
          <label>
            Layout Style:
            <select 
              value={options.layoutStyle} 
              onChange={(e) => setOptions({...options, layoutStyle: e.target.value as any})}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            >
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="creative">Creative</option>
            </select>
          </label>
        </div>

        <div style={{ margin: '1rem 0' }}>
          <label>
            Brand Color:
            <input 
              type="color" 
              value={options.brandColor}
              onChange={(e) => setOptions({...options, brandColor: e.target.value})}
              style={{ marginLeft: '0.5rem' }}
            />
          </label>
        </div>

        <button 
          className="btn" 
          onClick={handleGeneratePDF}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Sample PDF'}
        </button>

        {status && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: status.includes('✅') ? '#d1fae5' : '#fee2e2',
            color: status.includes('✅') ? '#065f46' : '#991b1b',
            borderRadius: '4px'
          }}>
            {status}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Invoice Data Preview</h2>
        <pre style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px', 
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
          {JSON.stringify(invoiceData, null, 2)}
        </pre>
      </div>

      <div className="card">
        <h2>Features to Explore</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>🎨 <strong>Customization</strong> - Try different colors and layouts</li>
          <li>📄 <strong>Templates</strong> - Modern, minimal, and creative styles</li>
          <li>💰 <strong>Calculations</strong> - Automatic tax and total calculations</li>
          <li>🌍 <strong>Internationalization</strong> - Multiple currency support</li>
          <li>✅ <strong>Validation</strong> - Built-in data validation</li>
          <li>📱 <strong>Responsive</strong> - Works on all devices</li>
        </ul>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
        <p>
          Powered by{' '}
          <a href="https://www.npmjs.com/package/invoice-craft" target="_blank" rel="noopener noreferrer">
            invoice-craft
          </a>
          {' '}• View on{' '}
          <a href="https://github.com/Hamad-Center/invoice-craft" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
