import React, { useEffect } from "react";
import { Frame, Element, useEditor } from "@craftjs/core";
import TopPanel from "./TopPanel";
import { useLocation } from "react-router-dom";
import { deployProject, fetchCommit } from "../../Api/projectApi";

import { Container } from "../Elements/Container";
import FloatingButtonWithPopup from "./AiFloat";

const EditorPanel = () => {
  const location = useLocation();
  const que = new URLSearchParams(location.search);
  const projectId = que.get("projectId");
  const projectName = que.get("projectName");
  const commitId = que.get("commitId");
  const page = que.get("page");
  const { actions } = useEditor();

  return (
    <div
      className="bg-white p-4 border-l border-r border-gray-300 flex flex-col h-full"
      style={{ width: "80%" }}
    >
      <TopPanel className="flex-none border-b border-gray-200 mb-2 pb-2" />

      <div className="flex-grow overflow-auto border border-gray-200 rounded-lg shadow-md">
        <Frame />
      </div>

      <FloatingButtonWithPopup />
    </div>
  );
};

export default EditorPanel;
