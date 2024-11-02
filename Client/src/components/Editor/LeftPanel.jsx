import React from "react";
import { useEditor, Element } from "@craftjs/core";

import {
  Image,
  Button,
  Link,
  Columns,
  Container,
  Rows,
  Text,
} from "../Elements";
import { Footer } from "../Premade/Footer";
import CodeGenerator from "./CodeGenerator";
const ToolboxButton = React.forwardRef(({ icon, text }, ref) => (
  <div
    className="flex flex-col rounded items-center p-2 mb-2 bg-white border border-zinc-200 hover:cursor-move"
    ref={ref}
  >
    {/* {React.createElement(icon, { className: "text-zinc-700 w-5 h-5" })} */}
    <span className="text-zinc-700 text-xs">{text}</span>
  </div>
));
const LeftPanel = () => {
  const { connectors } = useEditor();

  return (
    <div className="bg-gray-200 p-4 overflow-y-auto" style={{ width: "10%" }}>
      <h2 className="text-xl font-bold mb-4">Components</h2>

      <ToolboxButton
        ref={(ref) => connectors.create(ref, <Text text="New text" />)}
        //icon={PencilIcon}
        text="Text"
      />
      <ToolboxButton
        ref={(ref) => connectors.create(ref, <Button text="New button" />)}
        //icon={CursorClickIcon}
        text="Button"
      />
      <ToolboxButton
        ref={(ref) => connectors.create(ref, <Footer text="New footer" />)}
        //icon={CursorClickIcon}
        text="Footer"
      />

      {/* <ToolboxButton
        ref={(ref) => connectors.create(ref, <Button text="New button" />)}
        //icon={CursorClickIcon}
        text="Button"
      />

      <ToolboxButton
        ref={(ref) =>
          connectors.create(
            ref,
            <Link text="New link" href="http://www.seznam.cz" />
          )
        }
        icon={LinkIcon}
        text="Link"
      /> */}
      <ToolboxButton
        ref={(ref) => connectors.create(ref, <Image />)}
        //icon={PhotographIcon}
        text="Image"
      />
      <ToolboxButton
        ref={(ref) => connectors.create(ref, <Element is={Container} canvas />)}
        //icon={TemplateIcon}
        text="Container"
      />

      {/* <ToolboxButton
        ref={(ref) => connectors.create(ref, <Rows />)}
        //icon={MenuAlt4Icon}
        text="Rows"
      />

      <ToolboxButton
        ref={(ref) => connectors.create(ref, <Columns />)}
        //icon={ViewBoardsIcon}
        text="Columns"
      /> */}
    </div>
  );
};

export default LeftPanel;
