import React, { useEffect } from "react";
import { Frame, Element, useEditor } from "@craftjs/core";
import TopPanel from "./TopPanel";
import { useLocation } from "react-router-dom";
import { fetchCommit } from "../../Api/projectApi";

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
      className="bg-white p-4 border-l border-r border-gray-300 flex flex-col pt-1"
      style={{ width: "75%" }}
    >
      {/* Ensure TopPanel stays at the top */}
      <TopPanel className="flex-none" />

      {/* Frame content grows to fill remaining space */}
      <div className="flex-grow flex justify-center items-center">
        <Frame>
          <Element is="div" id="root" canvas className="w-full h-full">
            {/* The content from the commit will be loaded into this frame */}
          </Element>
        </Frame>
      </div>
    </div>
  );
};

export default EditorPanel;
