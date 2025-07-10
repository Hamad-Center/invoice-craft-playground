import React from 'react';
import type { TestCase } from '../../types/invoice';

interface TestCaseSelectorProps {
  testCases: Record<string, TestCase>;
  selectedTest: string;
  setSelectedTest: (test: string) => void;
}

const TestCaseSelector: React.FC<TestCaseSelectorProps> = ({
  testCases,
  selectedTest,
  setSelectedTest
}) => {
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
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1f2937'
      }}>
        🎯 Select Test Case:
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '12px', 
        marginBottom: '16px' 
      }}>
        {Object.entries(testCases).map(([key, testCase]) => (
          <button
            key={key}
            onClick={() => setSelectedTest(key)}
            style={{
              padding: '12px 16px',
              background: selectedTest === key
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'rgba(255, 255, 255, 0.8)',
              color: selectedTest === key ? 'white' : '#374151',
              border: selectedTest === key ? 'none' : '1px solid rgba(209, 213, 219, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: selectedTest === key
                ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                : '0 2px 4px rgba(0, 0, 0, 0.05)',
              transform: selectedTest === key ? 'translateY(-1px)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedTest !== key) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTest !== key) {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }
            }}
          >
            {testCase.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestCaseSelector;
