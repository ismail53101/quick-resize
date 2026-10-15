import React from 'react';

const BulkStatus = ({ total, current, status }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div style={statusContainer}>
      <div style={headerStyle}>
        <span>{status === 'processing' ? 'Processing Images...' : 'Ready to Download'}</span>
        <span>{current} / {total}</span>
      </div>
      
      <div style={progressBg}>
        <div style={{ ...progressFill, width: `${percentage}%` }}></div>
      </div>
      
      <p style={percentageText}>{percentage}% Completed</p>
    </div>
  );
};

const statusContainer = { padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px', margin: '15px 0' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold' };
const progressBg = { width: '100%', height: '100%', backgroundColor: '#dee2e6', borderRadius: '10px', overflow: 'hidden' };
const progressFill = { height: '10px', backgroundColor: '#28a745', transition: 'width 0.3s ease' };
const percentageText = { textAlign: 'center', margin: '5px 0 0 0', fontSize: '0.85rem' };

export default BulkStatus;