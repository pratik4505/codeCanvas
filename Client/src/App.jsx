import React from 'react';
import { Editor, Frame } from '@craftjs/core';
import LeftPanel from './components/LeftPanel';
import EditorPanel from './components/EditorPanel';
import RightPanel from './components/RightPanel';
import { ButtonComponent, HeadingComponent } from './components/Elements';

const App = () => {
  return (
    <Editor resolver={{ ButtonComponent, HeadingComponent }}>

      <div className="h-screen flex">
        {/* Left Panel */}
        <LeftPanel  />
        
        {/* Editor Panel */}
        <EditorPanel />

        {/* Right Panel */}
        <RightPanel />
      </div>
    </Editor>
  );
};

export default App;
