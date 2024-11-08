import React, { useEffect } from "react";
import { Frame, Element, useEditor } from "@craftjs/core";
import TopPanel from "./TopPanel";
import { useLocation } from "react-router-dom";
import { fetchCommit } from "../../Api/projectApi";
import { JsxOutput } from "./JsxOutput";

const EditorPanel = () => {
  const location = useLocation();
  const que = new URLSearchParams(location.search);
  const projectId = que.get("projectId");
  const commitId = que.get("commitId");
  const page = que.get("page");
  const { actions } = useEditor();

  useEffect(() => {
    // Fetch the commit data when the component mounts
    const fetch = async () => {
      try {
        const response = await fetchCommit(commitId);
        const commitData = response.data.commit;

        // Deserialize the JSON string into Craft.js editor state
        actions.deserialize(commitData);
      } catch (error) {
        console.error("Failed to load commit data:", error);
      }
    };

    if (commitId) {
      fetch();
    }
  }, [commitId]);



  return (
    <div
      className="bg-white p-4 border-l border-r border-gray-300 flex flex-col h-full"
      style={{ width: "60%" }}
    >
      {/* Top Panel at the top */}
      <TopPanel className="flex-none border-b border-gray-200 mb-2 pb-2" />

      {/* Scrollable Frame container */}
      <div className="flex-grow overflow-auto border border-gray-200 rounded-lg shadow-md">
        <Frame>
          <Element
            is="div"
            id="root"
            canvas
            className="w-full h-full min-h-screen bg-gray-50 p-4 rounded-lg"
          >
            {/* Content will load here */}
          </Element>
        </Frame>
      </div>

      {/* JSX Output */}
      <JsxOutput className="mt-4" />
    </div>
  );
};

export default EditorPanel;
