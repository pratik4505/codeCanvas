import React from "react";
import { useEditor } from "@craftjs/core";
import { Panel, PanelSection } from "../utils/Panel";
import CodeGenerator from "./CodeGenerator"; // Import the CodeGenerator component

export const RightPanel = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const currentNodeId = query.getEvent("selected").last();

    let selectedNode;

    if (currentNodeId) {
      selectedNode = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected: selectedNode,
      isEnabled: state.options.enabled,
    };
  });

  return (
    <Panel className="bg-white shadow-lg h-full w-[20%] flex flex-col">
      {/* AI Panel Section */}
      <div className="flex-grow-0">
        <PanelSection title="AI Panel">
          <CodeGenerator />
        </PanelSection>
      </div>

      {/* Editor Panel Section */}
      <div className="flex-grow flex flex-col">
        <PanelSection title="Editor Panel">
          {selected ? (
            <>
              {/* Display selected component's settings */}
              {selected.settings && React.createElement(selected.settings)}
              <div className="flex justify-end p-2">
                {selected.isDeletable ? (
                  <button
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-xs px-2 py-1"
                    onClick={() => {
                      actions.delete(selected.id);
                    }}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="p-2 text-gray-500">No component selected</div>
          )}
        </PanelSection>
      </div>
    </Panel>
  );
};

export default RightPanel;
