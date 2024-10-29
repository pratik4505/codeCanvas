import React from 'react';
import { useEditor } from '@craftjs/core';
import DraggableComponent from './DraggableComponent';

const LeftPanel = () => {
  const { connectors } = useEditor();

  const components = [
    { name: 'ButtonComponent', label: 'Button' },
    { name: 'HeadingComponent', label: 'Heading' },
  ];

  return (
    <div className="w-1/5 bg-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Components</h2>
      {components.map((comp, index) => (
        <DraggableComponent 
          key={index}
          component={comp.name}
          label={comp.label}
          connectors={connectors}
        />
      ))}
    </div>
  );
};

export default LeftPanel;
