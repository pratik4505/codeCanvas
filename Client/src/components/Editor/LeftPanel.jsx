import React, { useState } from "react";
import { useEditor, Element } from "@craftjs/core";
import { Image, Button, Link, Container, Text } from "../Elements";
import { Footer } from "../Premade/Footer";
import { Card } from "../Elements/Card";

const ToolboxButton = React.forwardRef(({ text }, ref) => (
  <div
    className="flex flex-col rounded items-center p-2 mb-2 bg-white border border-gray-300 hover:cursor-move"
    ref={ref}
  >
    <span className="text-gray-700 text-xs">{text}</span>
  </div>
));

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        className="w-full text-left flex justify-between items-center py-2 px-3 bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <span>{isOpen ? "▼" : "▲"}</span>
      </button>
      {isOpen && (
        <div className="max-h-48 overflow-y-auto p-2 bg-gray-100 border border-gray-300 rounded">
          {children}
        </div>
      )}
    </div>
  );
};

const LeftPanel = () => {
  const { connectors } = useEditor();

  return (
    <div
      className="bg-gray-100 p-4 h-full overflow-y-auto"
      style={{ width: "20%" }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Components</h2>

      {/* Basic Components Section */}
      <CollapsibleSection title="Basic Components">
        <ToolboxButton
          ref={(ref) => connectors.create(ref, <Button text="New button" />)}
          text="Button"
        />

        <ToolboxButton
          ref={(ref) =>
            connectors.create(ref, <Element is={Container} canvas />)
          }
          text="Container"
        />
        <ToolboxButton
          ref={(ref) => connectors.create(ref, <Card />)}
          text="Card"
        />
      </CollapsibleSection>
    </div>
  );
};

export default LeftPanel;
