import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { useLocation } from "react-router-dom";
import { commit } from "../../Api/projectApi";
import { Button } from "../Elements/Button";
import { Card } from "../Elements/Card";
import { Container } from "../Elements/Container";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "react-toastify";
import { Link } from "../Elements/Link";
const components = {
  Container,
  Button,
  Card,
  Link,
};

export const ConvertToHtml = (json) => {
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const renderComponents = (node) => {
    if (!node) return "";

    const { resolvedName } = node.type;
    const Component = components[resolvedName];

    if (!Component) return "";

    const componentProps = { ...node.props };

    if (node.nodes && node.nodes.length > 0) {
      const childrenHtml = node.nodes
        .map((childNodeId) => {
          const childNode = json[childNodeId];
          return renderComponents(childNode);
        })
        .join("");
      componentProps.children = childrenHtml;
    }

    const htmlOutput = renderToStaticMarkup(
      <Component {...componentProps} bypass={true} />
    );

    return decodeHtml(htmlOutput);
  };

  const bodyContent = renderComponents(json.ROOT);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Generated Page</title>
      <style>
        /* You can include any global styles here */
      </style>
    </head>
    <body>
      ${bodyContent}
    </body>
    </html>
  `;
};

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
  const [htmlOutput, setHtmlOutput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const convert = () => {
    const json = query.serialize();
    const html = ConvertToHtml(JSON.parse(json));
    setHtmlOutput(html);
    setIsModalOpen(true);
  };

  const handleCommit = async () => {
    const editorJson = query.serialize();

    try {
      const response = await commit({
        projectId,
        page,
        commit: editorJson,
        commitMessage,
        commitId,
      });

      if (!response.error) {
        toast.success("Commit successful! Page updated on GitHub.");
      } else {
        toast.error("Commit failed!");
      }
    } catch (error) {
      console.error("Error committing changes:", error);
      toast.error("Failed to commit changes.");
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

      {/* Modal to show HTML output */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-11/12 max-w-4xl">
            <h2 className="text-xl font-bold mb-2">Generated HTML</h2>
            <textarea
              className="w-full h-60 p-2 border border-gray-300 rounded"
              readOnly
              value={htmlOutput}
            />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white rounded px-4 py-2"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopPanel;
