import React from 'react';

interface TabNavigationProps {
  activeTab: 'presets' | 'custom' | 'advanced';
  setActiveTab: (tab: 'presets' | 'custom' | 'advanced') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '6px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <button
          onClick={() => setActiveTab('presets')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'presets' ? '#3b82f6' : 'transparent',
            color: activeTab === 'presets' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'presets' ? '0 4px 20px rgba(59, 130, 246, 0.4)' : 'none'
          }}
        >
          🧪 Preset Test Cases
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'custom' ? '#3b82f6' : 'transparent',
            color: activeTab === 'custom' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'custom' ? '0 4px 20px rgba(59, 130, 246, 0.4)' : 'none'
          }}
        >
          ✏️ Custom Invoice
        </button>

        <button
          onClick={() => setActiveTab('advanced')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'advanced' ? '#3b82f6' : 'transparent',
            color: activeTab === 'advanced' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: activeTab === 'advanced' ? '0 4px 20px rgba(59, 130, 246, 0.4)' : 'none'
          }}
        >
          🚀 Advanced Features
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
