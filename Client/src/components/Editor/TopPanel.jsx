import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { useLocation } from "react-router-dom";
import { commit } from "../../Api/projectApi";
// import { ConvertToHtml } from "./JsxToHtml";

import { Button } from "../Elements/Button";
import { Card } from "../Elements/Card";
import { Container } from "../Elements/Container";

import { renderToStaticMarkup } from "react-dom/server";

const components = {
  Container,
  Button,
  Card,
};

function ConvertToHtml(json) {
  // Function to decode HTML entities
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Recursive function to generate HTML for nodes
  const renderComponents = (node) => {
    if (!node) return "";

    const { resolvedName } = node.type;
    const Component = components[resolvedName]; // Get the corresponding React component

    // If component is not found, return empty string
    if (!Component) return "";

    // Get props for the component
    const componentProps = { ...node.props };

    // If the component has children nodes, recursively render them
    if (node.nodes && node.nodes.length > 0) {
      const childrenHtml = node.nodes
        .map((childNodeId) => {
          const childNode = json[childNodeId];
          return renderComponents(childNode); // Recursively render children
        })
        .join("");
      componentProps.children = childrenHtml; // Add children to component props
    }

    // Render the component to static HTML and return the result
    const htmlOutput = renderToStaticMarkup(
      <Component {...componentProps} bypass={true} />
    );

    // Decode HTML entities (like &quot;) to actual characters (like ")
    return decodeHtml(htmlOutput);
  };

  // Start rendering from the ROOT node (entry point)
  return renderComponents(json.ROOT);
}
const TopPanel = () => {
  const location = useLocation();
  const que = new URLSearchParams(location.search);
  const projectId = que.get("projectId");
  const projectName = que.get("projectName");
  const page = que.get("page");
  const creatorId = que.get("creatorId");
  const commitId = que.get("commitId");

  const { actions, canUndo, canRedo, query } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [commitMessage, setCommitMessage] = useState("");

  const convert = () => {
    const json = query.serialize();

    console.log(ConvertToHtml(JSON.parse(json)));
  };

  const handleCommit = async () => {
    // Step 1: Serialize editor content
    const editorJson = query.serialize();

    try {
      // Step 3: Commit the HTML and CSS content to GitHub
      const response = await commit({
        projectId,
        page,
        commit: editorJson,
        commitMessage,
        commitId,
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
      <button
        className="bg-blue-500 text-white border border-blue-600 rounded px-2 py-1 hover:bg-blue-600"
        onClick={convert}
      >
        JsxToHtml
      </button>
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
