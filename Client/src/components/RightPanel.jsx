import React from 'react';
import { useEditor } from '@craftjs/core';

const RightPanel = () => {
  const { selected } = useEditor((state) => {
    const currentNodeId = state.events.selected;
    return { selected: state.nodes[currentNodeId]?.data };
  });

  return (
    <div className="w-1/5 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Style Editor</h2>
      {selected ? (
        <div>
          <p className="text-lg">Selected: {selected.displayName}</p>
          {/* Add more style controls here */}
        </div>
      ) : (
        <p className="text-gray-500">Select a component to edit styles</p>
      )}
    </div>
  );
};

export default RightPanel;
