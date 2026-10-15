import React from 'react';

const QualitySlider = ({ quality, setQuality }) => {
  return (
    <div style={sliderContainerStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0 }}>Compression Quality</h3>
        <span style={badgeStyle}>{Math.round(quality * 100)}%</span>
      </div>
      
      <p style={descriptionStyle}>
        Lower quality means smaller file size, higher quality means clearer image.
      </p>

      <input
        type="range"
        min="0.1"
        max="1.0"
        step="0.05"
        value={quality}
        onChange={(e) => setQuality(parseFloat(e.target.value))}
        style={rangeInputStyle}
      />

      <div style={labelsStyle}>
        <span>Small Size</span>
        <span>Best Quality</span>
      </div>
    </div>
  );
};

// Styles
const sliderContainerStyle = {
  padding: '20px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginTop: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px'
};

const badgeStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '4px 10px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: 'bold'
};

const descriptionStyle = {
  fontSize: '0.85rem',
  color: '#666',
  marginBottom: '15px'
};

const rangeInputStyle = {
  width: '100%',
  cursor: 'pointer',
  accentColor: '#007bff'
};

const labelsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.75rem',
  color: '#888',
  marginTop: '5px'
};

export default QualitySlider;