import { useNode, useEditor } from "@craftjs/core";
import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useLocation } from "react-router-dom";

export const Container = ({
  children,
  padding,
  margin,
  backgroundColor,
  borderRadius,
  border,
  width,
  height,
  boxShadow,
  textAlign,
  bypass,
}) => {
  let jsx = (
    <div
      style={{
        padding: padding,
        margin: margin,
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        border: border,
        width: width,
        height: height,
        boxShadow: boxShadow,
        textAlign: textAlign,
      }}
      ref={(ref) => connect(drag(ref))}
    >
      {children ? (
        children
      ) : (
        <div className="text-center italic p-4 bg-yellow-100 outline-1 outline-dashed outline-amber-400">
          Empty container
        </div>
      )}
    </div>
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

const ContainerSettings = () => {
  const {
    actions: { setProp },
    padding,
    margin,
    backgroundColor,
    borderRadius,
    border,
    width,
    height,
    boxShadow,
    textAlign,
  } = useNode((node) => ({
    padding: node.data.props.padding,
    margin: node.data.props.margin,
    backgroundColor: node.data.props.backgroundColor,
    borderRadius: node.data.props.borderRadius,
    border: node.data.props.border,
    width: node.data.props.width,
    height: node.data.props.height,
    boxShadow: node.data.props.boxShadow,
    textAlign: node.data.props.textAlign,
  }));

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Padding
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={padding.replace("px", "")}
          onChange={(e) =>
            setProp((props) => (props.padding = `${e.target.value}px`), 1000)
          }
          className="w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Margin
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={margin.replace("px", "")}
          onChange={(e) =>
            setProp((props) => (props.margin = `${e.target.value}px`), 1000)
          }
          className="w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Background Color
        </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) =>
            setProp((props) => (props.backgroundColor = e.target.value), 1000)
          }
          className="w-full h-10 p-1"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Border Radius
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={borderRadius.replace("px", "")}
          onChange={(e) =>
            setProp(
              (props) => (props.borderRadius = `${e.target.value}px`),
              1000
            )
          }
          className="w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Border Width
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={border.replace(/\D/g, "")}
          onChange={(e) =>
            setProp(
              (props) => (props.border = `${e.target.value}px solid #ddd`),
              1000
            )
          }
          className="w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Width</label>
        <input
          type="range"
          min="50"
          max="1000"
          value={width.replace("px", "")}
          onChange={(e) =>
            setProp((props) => (props.width = `${e.target.value}px`), 1000)
          }
          className="w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Height
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          value={height.replace("px", "")}
          onChange={(e) =>
            setProp((props) => (props.height = `${e.target.value}px`), 1000)
          }
          className="w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Box Shadow
        </label>
        <select
          value={boxShadow}
          onChange={(e) =>
            setProp((props) => (props.boxShadow = e.target.value), 1000)
          }
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        >
          <option value="none">None</option>
          <option value="0px 4px 8px rgba(0, 0, 0, 0.2)">Light</option>
          <option value="0px 8px 16px rgba(0, 0, 0, 0.3)">Medium</option>
          <option value="0px 12px 24px rgba(0, 0, 0, 0.4)">Heavy</option>
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Text Align
        </label>
        <select
          value={textAlign}
          onChange={(e) =>
            setProp((props) => (props.textAlign = e.target.value), 1000)
          }
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </>
  );
};

export const ContainerDefaultProps = {
  padding: "10px",
  margin: "10px",
  backgroundColor: "#ffffff",
  borderRadius: "5px",
  border: "1px solid #ddd",
  width: "100%",
  height: "auto",
  boxShadow: "none",
  textAlign: "left",
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
