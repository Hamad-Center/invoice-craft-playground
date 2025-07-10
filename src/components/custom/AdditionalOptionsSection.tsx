import React from 'react';
import type { Invoice, CustomOptions } from '../../types/invoice';

interface AdditionalOptionsSectionProps {
  customInvoice: Invoice;
  customOptions: CustomOptions;
  onUpdateRootField: (field: string, value: any) => void;
  onSetCustomOptions: (options: CustomOptions | ((prev: CustomOptions) => CustomOptions)) => void;
}

const AdditionalOptionsSection: React.FC<AdditionalOptionsSectionProps> = ({
  customInvoice,
  customOptions,
  onUpdateRootField,
  onSetCustomOptions
}) => {
  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(209, 213, 219, 0.5)',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)',
    boxSizing: 'border-box' as const
  };

  const labelStyle = {
    display: 'flex' as const,
    alignItems: 'center' as const,
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#374151',
    gap: '4px'
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
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
          ⚙️ Additional Options
        </h4>
      </div>

      <div style={{
        background: 'rgba(245, 158, 11, 0.06)',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid rgba(245, 158, 11, 0.15)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={labelStyle}>
              📐 Layout Style
            </label>
            <select
              value={customOptions.layoutStyle}
              onChange={(e) => onSetCustomOptions(prev => ({ ...prev, layoutStyle: e.target.value as 'default' | 'modern' | 'minimal' | 'creative' }))}
              style={inputStyle}
            >
              <option value="default">Default - Classic Business</option>
              <option value="modern">Modern - Contemporary Design</option>
              <option value="minimal">Minimal - Ultra Clean</option>
              <option value="creative">Creative - Bold & Vibrant</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>
              💸 Discount Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={customInvoice.discount || 0}
              onChange={(e) => onUpdateRootField('discount', parseFloat(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={labelStyle}>
              🎨 Brand Color
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={customOptions.brandColor}
                onChange={(e) => onSetCustomOptions(prev => ({ ...prev, brandColor: e.target.value }))}
                style={{
                  width: '50px',
                  height: '44px',
                  padding: '4px',
                  border: '1px solid rgba(209, 213, 219, 0.5)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.8)'
                }}
              />
              <input
                type="text"
                value={customOptions.brandColor}
                onChange={(e) => onSetCustomOptions(prev => ({ ...prev, brandColor: e.target.value }))}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid rgba(209, 213, 219, 0.5)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(5px)'
                }}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>
              🖼️ Logo URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={customOptions.logoUrl}
              onChange={(e) => onSetCustomOptions(prev => ({ ...prev, logoUrl: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      <div style={{
        background: 'rgba(34, 197, 94, 0.06)',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid rgba(34, 197, 94, 0.15)',
        marginTop: '12px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>
              📝 Notes
            </label>
            <textarea
              placeholder="Thank you for your business! We appreciate your prompt payment."
              value={customInvoice.notes || ''}
              onChange={(e) => onUpdateRootField('notes', e.target.value)}
              style={{
                ...inputStyle,
                minHeight: '80px',
                resize: 'vertical' as const,
                boxSizing: 'border-box' as const
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>
              📋 Terms & Conditions
            </label>
            <textarea
              placeholder="Payment is due within 30 days of invoice date. Late payments may incur additional charges."
              value={customInvoice.terms || ''}
              onChange={(e) => onUpdateRootField('terms', e.target.value)}
              style={{
                ...inputStyle,
                minHeight: '80px',
                resize: 'vertical' as const,
                boxSizing: 'border-box' as const
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalOptionsSection;
