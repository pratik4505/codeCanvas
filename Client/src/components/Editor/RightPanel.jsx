import React from "react";
import { useEditor } from "@craftjs/core";

import { Panel, PanelSection } from "../utils/Panel";

export const RightPanel = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const currentNodeId = query.getEvent("selected").last();

    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
      isEnabled: state.options.enabled,
    };
  });

  return selected ? (
    <Panel>
      <PanelSection title={selected.name}>
        {selected.settings && React.createElement(selected.settings)}
      </PanelSection>
      {selected.isDeletable ? (
        <button
          className={`text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded text-xs px-2 py-1 mr-2 mb-2`}
          onClick={() => {
            actions.delete(selected.id);
          }}
        >
          Delete
        </button>
      ) : null}
    </Panel>
  ) : null;
};

export default RightPanel;
