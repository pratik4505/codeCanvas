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

  const { actions, canUndo, canRedo, query } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [commitMessage, setCommitMessage] = useState("");

  const handleCommit = async () => {
    // Step 1: Serialize editor content
    const editorJson = query.serialize();

    // Step 2: Convert JSON to HTML and CSS
    const { html, css } = jsonToHtmlCss(editorJson);

    try {
      // Step 3: Commit the HTML and CSS content to GitHub
      const response = await commit({
        projectId,
        page,
        projectName,
        creatorId,
        commit:editorJson,
        commitMessage,
        htmlContent: html,
        cssContent: css,
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
const jsonToHtmlCss = (json) => {
  const parsedJson = JSON.parse(json);
  let html = "<!DOCTYPE html><html><head><link rel='stylesheet' href='styles.css'></head><body>";
  let css = "";

  const parseNode = (nodeId) => {
    const node = parsedJson[nodeId];
    if (!node) {
      console.warn(`Node with ID ${nodeId} not found.`);
      return { html: '', css: '' };
    }

    const { displayName, props = {}, nodes = [], linkedNodes = {} } = node;
    let nodeHtml = "";
    let nodeCss = "";

    switch (displayName) {
      case "div":
        nodeHtml += `<div id="${props.id || ''}" class="${props.className || ''}">`;
        break;
      case "Text":
        const fontSize = props.fontSize ? `font-size: ${props.fontSize}px;` : '';
        nodeHtml += `<p style="${fontSize}">${props.text || ''}</p>`;
        break;
      case "Button":
        nodeHtml += `<button class="${props.className || ''}" style="${props.style || ''}">${props.text || 'Button'}</button>`;
        break;
      case "Column":
        nodeHtml += `<div class="w-full ${props.className || ''}">`;
        break;
      case "Columns":
        nodeHtml += `<div class="flex flex-row ${props.className || ''}" style="gap: ${props.gap || 0}px;">`;
        break;
      case "Container":
        nodeHtml += `<div class="${props.className || ''}" id="${props.id || ''}">`;
        break;
      case "Row":
        nodeHtml += `<div class="flex flex-col ${props.className || ''}">`;
        break;
      case "Rows":
        nodeHtml += `<div class="flex flex-col ${props.className || ''}" style="gap: ${props.gap || 0}px;">`;
        break;
      default:
        console.warn(`Unhandled display name: ${displayName}`);
    }

    nodes.forEach((childId) => {
      const { html: childHtml, css: childCss } = parseNode(childId);
      nodeHtml += childHtml;
      nodeCss += childCss;
    });

    Object.values(linkedNodes).forEach((linkedNodeId) => {
      const { html: linkedHtml, css: linkedCss } = parseNode(linkedNodeId);
      nodeHtml += linkedHtml;
      nodeCss += linkedCss;
    });

    switch (displayName) {
      case "div":
      case "Column":
      case "Columns":
      case "Container":
      case "Row":
      case "Rows":
        nodeHtml += `</div>`;
        break;
      case "Button":
        nodeHtml += `</button>`;
        break;
    }

    return { html: nodeHtml, css: nodeCss };
  };

  const rootNodeId = "ROOT";
  const { html: rootHtml, css: rootCss } = parseNode(rootNodeId);

  html += rootHtml;
  css += rootCss;
  html += "</body></html>";

  return { html, css };
};

export default TopPanel;
