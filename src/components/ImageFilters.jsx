import React from 'react';

const ImageFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterOptions = [
    { name: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
    { name: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
    { name: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
    { name: 'grayscale', label: 'Black & White', min: 0, max: 100, unit: '%' },
  ];

  return (
    <div style={filterContainerStyle}>
      <h3>Image Adjustments</h3>
      {filterOptions.map((opt) => (
        <div key={opt.name} style={controlStyle}>
          <label>{opt.label}: {filters[opt.name]}{opt.unit}</label>
          <input
            type="range"
            name={opt.name}
            min={opt.min}
            max={opt.max}
            value={filters[opt.name]}
            onChange={handleChange}
            style={sliderStyle}
          />
        </div>
      ))}
      <button 
        onClick={() => setFilters({ brightness: 100, contrast: 100, saturate: 100, grayscale: 0 })}
        style={resetButtonStyle}
      >
        Reset Filters
      </button>
    </div>
  );
};

// Basic Styling (Aap ise baad mein CSS file mein bhi le ja sakte hain)
const filterContainerStyle = {
  padding: '20px',
  backgroundColor: '#f1f1f1',
  borderRadius: '8px',
  marginTop: '20px'
};

const controlStyle = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column'
};

const sliderStyle = {
  cursor: 'pointer',
  accentColor: '#007bff'
};

const resetButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default ImageFilters;