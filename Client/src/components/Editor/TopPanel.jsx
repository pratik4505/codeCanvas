import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { useLocation } from "react-router-dom";
import { commit } from "../../Api/projectApi";

const TopPanel = () => {
  const location = useLocation();
  const que = new URLSearchParams(location.search);
  const projectId = que.get("projectId");
  const projectName = que.get("projectName");
  const page = que.get("page");
  const creatorId = que.get("creatorId")
  const commitId = que.get("commitId");

  const { actions, canUndo, canRedo, query } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [commitMessage, setCommitMessage] = useState("");

  const handleCommit = async () => {
    // Step 1: Serialize editor content
    const editorJson = query.serialize();

    try {
      // Step 3: Commit the HTML and CSS content to GitHub
      const response = await commit({
        projectId,
        page,
        commit:editorJson,
        commitMessage,
        commitId
      });

      if (!response.error) {
        alert("Commit successful! Page updated on GitHub.");
      } else {
        alert("Commit failed!");
      }
    } catch (error) {
      console.error("Error committing changes:", error);
      alert("Failed to commit changes.");
    }
  };

  return (
    <div className="bg-gray-300 rounded-lg p-2 mb-4 flex justify-between items-center">
      <div className="flex space-x-2">
        <button
          className={`bg-white text-gray-700 border border-gray-400 rounded px-2 py-1 hover:bg-gray-100 ${
            !canUndo ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => actions.history.undo()}
          disabled={!canUndo}
        >
          Undo
        </button>
        <button
          className={`bg-white text-gray-700 border border-gray-400 rounded px-2 py-1 hover:bg-gray-100 ${
            !canRedo ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
        >
          Redo
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Commit message"
          className="border border-gray-400 rounded px-2 py-1"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white border border-blue-600 rounded px-2 py-1 hover:bg-blue-600"
          onClick={handleCommit}
          disabled={!commitMessage.trim()}
        >
          Commit
        </button>
      </div>
    </div>
  );
};

// Utility function to convert JSON to HTML and CSS (from your existing code)

export default TopPanel;
