import React from 'react';
import type { TestCase } from '../../types/invoice';

interface TestCasePreviewProps {
  currentTestCase: TestCase;
}

const TestCasePreview: React.FC<TestCasePreviewProps> = ({ currentTestCase }) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          📋 Current Test: {currentTestCase.name}
        </h3>
        <div style={{
          marginLeft: 'auto',
          padding: '4px 12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          Preview
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{
          background: 'rgba(248, 250, 252, 0.5)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            📄 Invoice Data:
          </h4>
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>From:</span> {currentTestCase.invoice.from.name}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>To:</span> {currentTestCase.invoice.to.name}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Invoice #:</span> {currentTestCase.invoice.invoiceNumber}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Date:</span> {currentTestCase.invoice.invoiceDate}
            </div>
            {(currentTestCase.invoice as any).dueDate && (
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500', color: '#374151' }}>Due:</span> {(currentTestCase.invoice as any).dueDate}
              </div>
            )}
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>Items:</span> {currentTestCase.invoice.items.length} item(s)
            </div>
            {(currentTestCase.invoice as any).discount && (
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Discount:</span> ${(currentTestCase.invoice as any).discount}
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'rgba(248, 250, 252, 0.5)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(226, 232, 240, 0.5)'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151'
          }}>
            ⚙️ Options:
          </h4>
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#4b5563' }}>
            {(currentTestCase.options as any).brandColor && (
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: '500', color: '#374151' }}>Brand Color:</span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: (currentTestCase.options as any).brandColor,
                  borderRadius: '4px',
                  marginLeft: '8px',
                  marginRight: '8px',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}></div>
                <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{(currentTestCase.options as any).brandColor}</span>
              </div>
            )}
            {(currentTestCase.options as any).labels && (
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '500', color: '#374151' }}>Custom Labels:</span>
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 6px',
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  Localized
                </span>
              </div>
            )}
            {Object.keys(currentTestCase.options).length === 0 && (
              <div style={{ fontStyle: 'italic', color: '#6b7280' }}>Using default options</div>
            )}
          </div>

          {currentTestCase.invoice.items.length <= 3 && (
            <div style={{ marginTop: '16px' }}>
              <h5 style={{
                margin: '0 0 8px 0',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                📦 Items Preview:
              </h5>
              <div style={{ fontSize: '12px', lineHeight: '1.5', color: '#4b5563' }}>
                {currentTestCase.invoice.items.map((item, index) => (
                  <div key={index} style={{
                    marginBottom: '4px',
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '6px'
                  }}>
                    {item.description} ({item.quantity} × ${item.unitPrice})
                    {(item as any).taxRate && (
                      <span style={{ color: '#059669', fontWeight: '500' }}>
                        {' '}+{((item as any).taxRate * 100).toFixed(1)}% tax
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCasePreview;
