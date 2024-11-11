import { useNode, useEditor } from "@craftjs/core";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useLocation } from "react-router-dom";

export const Button = ({
  text,
  color,
  backgroundColor,
  fontSize,
  borderRadius,
  padding,
  bypass,
}) => {
  let jsx = (
    <button
      style={{
        color: color,
        backgroundColor: backgroundColor,
        fontSize: fontSize,
        borderRadius: borderRadius,
        padding: padding,
        textAlign: "center",
        cursor: "pointer",
        border: "none",
      }}
      ref={(ref) => connect(drag(ref))}
    >
      {text}
    </button>
  );

  if (bypass) return jsx;

  const {
    connectors: { connect, drag },
    id,
    props,
    parent,
    nodes,
    linkedNodes,
    actions,
  } = useNode((node) => ({
    props: node.data?.props || {},
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

    if (nodeData.custom.myFlag === "no") {
      actions.setCustom((custom) => {
        custom.myFlag = "yes";
      });
      return;
    }

    socket.emit("update", {
      nodeId: id,
      nodeData: nodeData,
      action: "update",
      room: commitId,
    });
  }, [props, parent, nodes, linkedNodes, socket]);

  return jsx;
};

const ButtonSettings = () => {
  const {
    actions: { setProp },
    text,
    color,
    backgroundColor,
    fontSize,
    borderRadius,
    padding,
  } = useNode((node) => ({
    text: node.data.props.text,
    color: node.data.props.color,
    backgroundColor: node.data.props.backgroundColor,
    fontSize: node.data.props.fontSize,
    borderRadius: node.data.props.borderRadius,
    padding: node.data.props.padding,
  }));

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Text</label>
        <input
          type="text"
          defaultValue={text}
          onChange={(e) => {
            setProp((props) => (props.text = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Text Color
        </label>
        <input
          type="color"
          defaultValue={color}
          onChange={(e) => {
            setProp((props) => (props.color = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Background Color
        </label>
        <input
          type="color"
          defaultValue={backgroundColor}
          onChange={(e) => {
            setProp((props) => (props.backgroundColor = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Font Size
        </label>
        <input
          type="text"
          defaultValue={fontSize}
          onChange={(e) => {
            setProp((props) => (props.fontSize = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Border Radius
        </label>
        <input
          type="text"
          defaultValue={borderRadius}
          onChange={(e) => {
            setProp((props) => (props.borderRadius = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Padding
        </label>
        <input
          type="text"
          defaultValue={padding}
          onChange={(e) => {
            setProp((props) => (props.padding = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
    </>
  );
};

export const ButtonDefaultProps = {
  text: "New Button",
  color: "#ffffff", // Default text color
  backgroundColor: "#000000", // Default background color (black)
  fontSize: "1rem", // Default font size
  borderRadius: "0.375rem", // Default border radius
  padding: "0.625rem 1.25rem", // Default padding
};

Button.craft = {
  props: ButtonDefaultProps,
  related: {
    settings: ButtonSettings,
  },
};
