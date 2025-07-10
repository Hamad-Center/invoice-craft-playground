import React from 'react';

interface StatusSectionProps {
  status: string;
}

const StatusSection: React.FC<StatusSectionProps> = ({ status }) => {
  return (
    <div style={{
      marginTop: '30px',
      padding: '20px',
      background: status.includes('Error')
        ? 'linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(252, 165, 165, 0.1) 100%)'
        : 'linear-gradient(135deg, rgba(240, 249, 255, 0.9) 0%, rgba(186, 230, 253, 0.1) 100%)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${status.includes('Error') ? 'rgba(254, 202, 202, 0.5)' : 'rgba(186, 230, 253, 0.5)'}`,
      borderRadius: '12px',
      color: status.includes('Error') ? '#dc2626' : '#0369a1',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>
          {status.includes('Error') ? '❌' : status.includes('successful') ? '✅' : '⏳'}
        </span>
        <strong style={{ fontSize: '16px' }}>Status:</strong>
        <span style={{ fontSize: '15px' }}>{status}</span>
      </div>
    </div>
  );
};

export default StatusSection;
