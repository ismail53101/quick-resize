import React, { useState } from 'react';

const ComparisonView = ({ original, modified }) => {
  const [position, setPosition] = useState(50); // Slider ki default position 50%

  const handleMouseMove = (e) => {
    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - container.left) / container.width) * 100;
    if (x >= 0 && x <= 100) setPosition(x);
  };

  return (
    <div style={containerStyle} onMouseMove={handleMouseMove} onTouchMove={(e) => handleMouseMove(e.touches[0])}>
      <h3 style={{ textAlign: 'center' }}>Before vs After</h3>
      
      <div style={viewerStyle}>
        {/* Modified Image (Niche wali layer) */}
        <img src={modified} alt="Modified" style={imageStyle} />
        
        {/* Original Image (Upar wali layer jo cut hogi) */}
        <div style={{ ...overlayStyle, width: `${position}%` }}>
          <img src={original} alt="Original" style={imageStyle} />
        </div>

        {/* Divider Line */}
        <div style={{ ...dividerStyle, left: `${position}%` }}>
          <div style={handleStyle}>↔</div>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
        Move your mouse over the image to compare
      </p>
    </div>
  );
};

// Styles
const containerStyle = { marginTop: '30px', userSelect: 'none' };
const viewerStyle = { 
  position: 'relative', 
  width: '100%', 
  aspectRatio: '16/9', 
  overflow: 'hidden', 
  borderRadius: '12px',
  border: '2px solid #eee'
};
const imageStyle = { 
  position: 'absolute', 
  top: 0, 
  left: 0, 
  width: '100%', 
  height: '100%', 
  objectFit: 'contain',
  backgroundColor: '#f8f9fa'
};
const overlayStyle = { 
  position: 'absolute', 
  top: 0, 
  left: 0, 
  height: '100%', 
  overflow: 'hidden', 
  borderRight: '2px solid white' 
};
const dividerStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '2px',
  backgroundColor: 'white',
  transform: 'translateX(-50%)',
  pointerEvents: 'none'
};
const handleStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30px',
  height: '30px',
  backgroundColor: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  fontSize: '12px',
  fontWeight: 'bold'
};

export default ComparisonView;