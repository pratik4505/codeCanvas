import React from "react";
import { Editor } from "@craftjs/core";
import LeftPanel from "../components/Editor/LeftPanel";
import EditorPanel from "../components/Editor/EditorPanel";
import RightPanel from "../components/Editor/RightPanel";

//import * as UserComponents from "./components/Elements";
import { Text } from "../components/Elements/Text";
import { Container } from "../components/Elements/Container";
import { Button } from "../components/Elements/Button";
import { Image } from "../components/Elements";
const Builder = () => {
  return (
    <Editor resolver={{ Container, Text, Button, Image }}>
      <div className="h-screen flex">
        {/* Left Panel */}
        <LeftPanel />

        {/* Editor Panel */}
        <EditorPanel />

        {/* Right Panel */}
        <RightPanel />
      </div>
    </Editor>
  );
};

export default Builder;
