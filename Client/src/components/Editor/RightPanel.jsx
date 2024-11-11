import React, { useContext, useEffect, useState } from "react";
import { useEditor } from "@craftjs/core";
import { Panel, PanelSection } from "../utils/Panel";
import CodeGenerator from "./CodeGenerator"; // Import the CodeGenerator component
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useLocation } from "react-router-dom";
export const RightPanel = () => {
  const [isVisible, setIsVisible] = useState(false);

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
  useEffect(() => {
    if (selected) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selected]);
  const { socket } = useContext(GlobalContext);
  const location = useLocation();
  const que = new URLSearchParams(location.search);
  const commitId = que.get("commitId");
  return (
    <div
      className={`fixed top-0 left-0 h-full transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "20%" }}
    >
      <Panel className="bg-white shadow-lg h-full flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-2 border-b">
          <h2 className="text-lg font-semibold">Right Panel</h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setIsVisible(false)}
          >
            ✕ {/* Close icon */}
          </button>
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
    </div>
  );
};

export default RightPanel;
