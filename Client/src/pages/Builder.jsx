import React from "react";
import { Editor } from "@craftjs/core";
import LeftPanel from "../components/Editor/LeftPanel";
import EditorPanel from "../components/Editor/EditorPanel";
import RightPanel from "../components/Editor/RightPanel";
import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../components/Elements/Text";
import { Container } from "../components/Elements/Container";
import { Button } from "../components/Elements/Button";
import SyncProvider from "../components/Editor/SyncProvider";
import { Card } from "../components/Elements/Card";
import { Link } from "../components/Elements/Link";

const Builder = () => {
  const location = useLocation();
  const que = new URLSearchParams(location.search);
  const commitId = que.get("commitId");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Editor resolver={{ Container, Button, Link, Card }}>
      <SyncProvider commitId={commitId}>
        <div className="h-screen flex relative">
          {/* Floating Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            Back
          </button>

          <LeftPanel />
          <EditorPanel />
          <RightPanel />
        </div>
      </SyncProvider>
    </Editor>
  );
};

export default Builder;
