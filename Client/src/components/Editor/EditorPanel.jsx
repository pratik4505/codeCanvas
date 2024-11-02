import React from "react";
import { Frame, Element } from "@craftjs/core";
import TopPanel from "./TopPanel";

const EditorPanel = () => {
  return (
    <div
      className=" bg-white p-4 border-l border-r border-gray-300 flex flex-col pt-1"
      style={{ width: "75%" }}
    >
      {/* Ensure TopPanel stays at the top */}
      <TopPanel className="flex-none" />

      {/* Frame content grows to fill remaining space */}
      <div className="flex-grow flex justify-center items-center">
        <Frame>
          <Element is="div" id="root" canvas className="w-full h-full">
            {/* Example default components */}
          </Element>
        </Frame>
      </div>
    </div>
  );
};

export default EditorPanel;
