import React from 'react';

const DraggableComponent = ({ component, label, connectors }) => {
  return (
    <div 
      ref={(ref) => connectors.create(ref, component)} 
      className="p-2 mb-2 bg-white shadow cursor-pointer"
    >
      {label}
    </div>
  );
};

export default DraggableComponent;
