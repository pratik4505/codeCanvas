import { useNode, useEditor } from "@craftjs/core";
import { Label } from "../utils/Label";
import { TextInput } from "../utils/TextInput";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useLocation } from "react-router-dom";
export const Button = ({ text }) => {
  const {
    connectors: { connect, drag },
    id,
    props,
    parent,
    nodes,
    linkedNodes,
    actions,
  } = useNode((node) => ({
    props: node.data?.props || {}, // Provide a default empty object
    parent: node.data?.parent,
    nodes: node.data?.nodes || [],
    linkedNodes: node.data?.linkedNodes || {},
  }));

  const { query } = useEditor();
  const location = useLocation();
  const commitId = new URLSearchParams(location.search).get("commitId");
  const { socket } = useContext(GlobalContext);

  useEffect(() => {
    let nodeData = query.node(id).toSerializedNode();

    // Ensure `myFlag` is initialized if undefined
    if (nodeData.custom.myFlag === "no") {
      actions.setCustom((custom) => {
        custom.myFlag = "yes";
      });
      return; // Prevent further code execution until `myFlag` is set
    }

    // Emit only if myFlag has been set
    socket.emit("update", {
      nodeId: id,
      nodeData: nodeData,
      action: "update",
      room: commitId,
    });
  }, [props, parent, nodes, linkedNodes, socket]);
  return (
    <button
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      ref={(ref) => connect(drag(ref))}
    >
      {text}
    </button>
  );
};

const ButtonSettings = () => {
  const {
    actions: { setProp },
    text,
  } = useNode((node) => ({
    text: node.data.props.text,
  }));
  return (
    <>
      <Label label="Text">
        <TextInput
          defaultValue={text}
          onChange={(e) => {
            setProp((props) => (props.text = e.target.value), 1000);
          }}
        />
      </Label>
    </>
  );
};

export const ButtonDefaultProps = {
  text: "New Button",
};

Button.craft = {
  props: ButtonDefaultProps,
  related: {
    settings: ButtonSettings,
  },
};
