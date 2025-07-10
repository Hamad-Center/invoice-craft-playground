import React from 'react';
import type { TestCase } from '../../types/invoice';

interface TestButtonsProps {
  currentTestCase: TestCase;
  isLoading: boolean;
  onTestDirectPdfMake: () => void;
  onTestLibraryImport: () => void;
  onTestAllCases: () => void;
}

const TestButtons: React.FC<TestButtonsProps> = ({
  currentTestCase,
  isLoading,
  onTestDirectPdfMake,
  onTestLibraryImport,
  onTestAllCases
}) => {
  const buttonStyle = (color: string, isDisabled: boolean = false) => ({
    padding: '14px 28px',
    background: isDisabled ? '#94a3b8' : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: isDisabled ? 'none' : `0 4px 12px ${color}66`,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, color: string) => {
    if (!isLoading) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = `0 6px 20px ${color}99`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, color: string) => {
    if (!isLoading) {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = `0 4px 12px ${color}66`;
    }
  };

  return (
    <>
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        <button
          onClick={onTestDirectPdfMake}
          disabled={isLoading}
          style={buttonStyle('#10b981', isLoading)}
          onMouseEnter={(e) => handleMouseEnter(e, '#10b981')}
          onMouseLeave={(e) => handleMouseLeave(e, '#10b981')}
        >
          🧪 {isLoading ? 'Processing...' : 'Test pdfMake Direct'}
        </button>

        <button
          onClick={onTestLibraryImport}
          disabled={isLoading}
          style={buttonStyle('#667eea', isLoading)}
          onMouseEnter={(e) => handleMouseEnter(e, '#667eea')}
          onMouseLeave={(e) => handleMouseLeave(e, '#667eea')}
        >
          🚀 {isLoading ? 'Processing...' : `Generate ${currentTestCase.name}`}
        </button>
      </div>

      {/* Quick Test All Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onTestAllCases}
          disabled={isLoading}
          style={{
            ...buttonStyle('#8b5cf6', isLoading),
            padding: '12px 24px',
            display: 'inline-flex'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px #8b5cf699';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 12px #8b5cf666';
            }
          }}
        >
          ⚡ {isLoading ? 'Processing...' : 'Test All Cases (Sequential)'}
        </button>
      </div>
    </>
  );
};

export default TestButtons;
