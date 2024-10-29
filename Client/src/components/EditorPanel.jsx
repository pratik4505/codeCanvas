import React from 'react';
import { Frame, Element } from '@craftjs/core';
import { ButtonComponent, HeadingComponent } from './Elements';
import DraggableComponent from './DraggableComponent';

const EditorPanel = () => {
  return (
    <div className="w-3/5 bg-white p-4 border-l border-r border-gray-300 flex justify-center items-center">
      <Frame resolver={{ButtonComponent,HeadingComponent}}>
        <Element is="div" canvas className="w-full h-full">
          
          {/* Default components could be placed here */}
        </Element>
      </Frame>
    </div>
  );
};

export default EditorPanel;
