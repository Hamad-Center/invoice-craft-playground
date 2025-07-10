import React from 'react';
import type { Invoice } from '../../types/invoice';

interface ItemsSectionProps {
  customInvoice: Invoice;
  onUpdateItem: (index: number, field: string, value: any) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({
  customInvoice,
  onUpdateItem,
  onAddItem,
  onRemoveItem
}) => {
  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid rgba(209, 213, 219, 0.5)',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.9)',
    boxSizing: 'border-box' as const
  };

  const requiredInputStyle = (hasValue: boolean) => ({
    ...inputStyle,
    border: hasValue ? '2px solid #10b981' : '1px solid rgba(209, 213, 219, 0.5)',
    transition: 'all 0.3s ease'
  });

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: '600' as const,
    color: '#6b7280'
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(245, 158, 11, 0.15)'
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
          📦 Invoice Items
        </h4>
        <button
          onClick={onAddItem}
          style={{
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
          }}
        >
          ➕ Add Item
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {customInvoice.items.map((item, index) => (
          <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280',
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                Item #{index + 1}
              </span>
              {customInvoice.items.length > 1 && (
                <button
                  onClick={() => onRemoveItem(index)}
                  style={{
                    padding: '6px 8px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  🗑️ Remove
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>
                  📝 Description *
                </label>
                <input
                  type="text"
                  placeholder="Service or product description"
                  value={item.description}
                  onChange={(e) => onUpdateItem(index, 'description', e.target.value)}
                  style={requiredInputStyle(!!item.description)}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  🔢 Quantity
                </label>
                <input
                  type="number"
                  placeholder="1"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => onUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  💰 Unit Price
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => onUpdateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  📊 Tax Rate (%)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                  value={(item.taxRate || 0) * 100}
                  onChange={(e) => onUpdateItem(index, 'taxRate', (parseFloat(e.target.value) || 0) / 100)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Item Total Display */}
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Item Total:</span>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#667eea'
              }}>
                {customInvoice.currency} {(item.quantity * item.unitPrice).toFixed(2)}
                {(item.taxRate || 0) > 0 && (
                  <span style={{ fontSize: '12px', color: '#059669' }}>
                    {' '}+ {(item.quantity * item.unitPrice * (item.taxRate || 0)).toFixed(2)} tax
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsSection;
