import React from "react";
import { Editor } from "@craftjs/core";
import LeftPanel from "../components/Editor/LeftPanel";
import EditorPanel from "../components/Editor/EditorPanel";
import RightPanel from "../components/Editor/RightPanel";
import { useLocation } from "react-router-dom";
//import * as UserComponents from "./components/Elements";
import { Text } from "../components/Elements/Text";
import { Container } from "../components/Elements/Container";
import { Button } from "../components/Elements/Button";
import { Image } from "../components/Elements";
import { Footer } from "../components/Premade/Footer";
import SyncProvider from "../components/Editor/SyncProvider";
import { Card } from "../components/Elements/Card";
const Builder = () => {
  const location = useLocation();
  const que = new URLSearchParams(location.search);
  const commitId = que.get("commitId");
  return (
    <Editor resolver={{ Container, Text, Button, Image, Footer, Card }}>
      <SyncProvider commitId={commitId}>
        <div className="h-screen flex">
          <LeftPanel />

          <EditorPanel />

          <RightPanel />
        </div>
      </SyncProvider>
    </Editor>
  );
};

export default Builder;
