import React from "react";
import { Frame, Element } from "@craftjs/core";

const EditorPanel = () => {
  return (
    <div className="w-3/5 bg-white p-4 border-l border-r border-gray-300 flex justify-center items-center">
      <Frame>
        <Element is="div" id="root" canvas className="w-full h-full">
          {/* Example default components */}
        </Element>
      </Frame>
    </div>
  );
};

export default EditorPanel;
