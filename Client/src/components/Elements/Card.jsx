import { useNode, useEditor } from "@craftjs/core";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useLocation } from "react-router-dom";

export const Card = ({
  title,
  content,
  color,
  backgroundColor,
  border,
  borderRadius,
  padding,
  margin,
  boxShadow,
  textAlign,
  bypass,
}) => {
  let jsx = (
    <div
      style={{
        color: color,
        backgroundColor: backgroundColor,
        border: border,
        borderRadius: borderRadius,
        padding: padding,
        margin: margin,
        boxShadow: boxShadow,
        textAlign: textAlign,
        cursor: "pointer",
      }}
      ref={(ref) => connect(drag(ref))}
    >
      <h3>{title}</h3>
      <p>{content}</p>
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
const CardSettings = () => {
  const {
    actions: { setProp },
    title,
    content,
    color,
    backgroundColor,
    border,
    borderRadius,
    padding,
    margin,
    boxShadow,
    textAlign,
  } = useNode((node) => ({
    title: node.data.props.title,
    content: node.data.props.content,
    color: node.data.props.color,
    backgroundColor: node.data.props.backgroundColor,
    border: node.data.props.border || {
      width: "1px",
      style: "solid",
      color: "#000000",
    },
    borderRadius: node.data.props.borderRadius || "5px",
    padding: node.data.props.padding || "10px",
    margin: node.data.props.margin || "10px",
    boxShadow: node.data.props.boxShadow || {
      offsetX: "0px",
      offsetY: "0px",
      blurRadius: "10px",
      color: "#000000",
    },
    textAlign: node.data.props.textAlign || "left",
  }));

  return (
    <>
      {/* Title Setting */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          defaultValue={title}
          onChange={(e) => {
            setProp((props) => (props.title = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>

      {/* Content Setting */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          defaultValue={content}
          onChange={(e) => {
            setProp((props) => (props.content = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>

      {/* Text Color */}
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
          className="mt-1 w-12 h-12"
        />
      </div>

      {/* Background Color */}
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
          className="mt-1 w-12 h-12"
        />
      </div>

      {/* Border Settings */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Border
        </label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {/* Border Width */}
          <div>
            <label className="text-xs">Width</label>
            <input
              type="range"
              min="0"
              max="10"
              defaultValue={parseInt(border.width, 10)}
              onChange={(e) => {
                setProp(
                  (props) =>
                    (props.border = {
                      ...props.border,
                      width: `${e.target.value}px`,
                    }),
                  1000
                );
              }}
              className="mt-1 w-full"
            />
            <span className="text-xs">{border.width}</span>
          </div>

          {/* Border Style */}
          <div>
            <label className="text-xs">Style</label>
            <select
              defaultValue={border.style}
              onChange={(e) => {
                setProp(
                  (props) =>
                    (props.border = { ...props.border, style: e.target.value }),
                  1000
                );
              }}
              className="mt-1 p-1 border border-gray-300 rounded-md text-xs w-full"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* Border Color */}
          <div>
            <label className="text-xs">Color</label>
            <input
              type="color"
              defaultValue={border.color}
              onChange={(e) => {
                setProp(
                  (props) =>
                    (props.border = { ...props.border, color: e.target.value }),
                  1000
                );
              }}
              className="mt-1 w-full"
            />
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Border Radius
        </label>
        <input
          type="range"
          min="0"
          max="50"
          defaultValue={parseInt(borderRadius, 10)}
          onChange={(e) => {
            setProp(
              (props) => (props.borderRadius = `${e.target.value}px`),
              1000
            );
          }}
          className="mt-1 w-full"
        />
        <div className="text-sm mt-1">{borderRadius}</div>
      </div>

      {/* Padding */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Padding
        </label>
        <input
          type="range"
          min="0"
          max="50"
          defaultValue={parseInt(padding, 10)}
          onChange={(e) => {
            setProp((props) => (props.padding = `${e.target.value}px`), 1000);
          }}
          className="mt-1 w-full"
        />
        <div className="text-sm mt-1">{padding}</div>
      </div>

      {/* Margin */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Margin
        </label>
        <input
          type="range"
          min="0"
          max="50"
          defaultValue={parseInt(margin, 10)}
          onChange={(e) => {
            setProp((props) => (props.margin = `${e.target.value}px`), 1000);
          }}
          className="mt-1 w-full"
        />
        <div className="text-sm mt-1">{margin}</div>
      </div>

      {/* Box Shadow Settings */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Box Shadow
        </label>
        <div className="mt-2">
          <label className="text-xs">Offset X</label>
          <input
            type="range"
            min="-20"
            max="20"
            defaultValue={parseInt(boxShadow.offsetX, 10)}
            onChange={(e) => {
              setProp(
                (props) =>
                  (props.boxShadow = {
                    ...props.boxShadow,
                    offsetX: `${e.target.value}px`,
                  }),
                1000
              );
            }}
            className="mt-1 w-full"
          />
          <span className="text-xs">{boxShadow.offsetX}</span>

          <label className="text-xs mt-2">Offset Y</label>
          <input
            type="range"
            min="-20"
            max="20"
            defaultValue={parseInt(boxShadow.offsetY, 10)}
            onChange={(e) => {
              setProp(
                (props) =>
                  (props.boxShadow = {
                    ...props.boxShadow,
                    offsetY: `${e.target.value}px`,
                  }),
                1000
              );
            }}
            className="mt-1 w-full"
          />
          <span className="text-xs">{boxShadow.offsetY}</span>

          <label className="text-xs mt-2">Blur Radius</label>
          <input
            type="range"
            min="0"
            max="50"
            defaultValue={parseInt(boxShadow.blurRadius, 10)}
            onChange={(e) => {
              setProp(
                (props) =>
                  (props.boxShadow = {
                    ...props.boxShadow,
                    blurRadius: `${e.target.value}px`,
                  }),
                1000
              );
            }}
            className="mt-1 w-full"
          />
          <span className="text-xs">{boxShadow.blurRadius}</span>

          <label className="text-xs mt-2">Shadow Color</label>
          <input
            type="color"
            defaultValue={boxShadow.color}
            onChange={(e) => {
              setProp(
                (props) =>
                  (props.boxShadow = {
                    ...props.boxShadow,
                    color: e.target.value,
                  }),
                1000
              );
            }}
            className="mt-1 w-full"
          />
        </div>
      </div>

      {/* Text Align */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Text Align
        </label>
        <select
          defaultValue={textAlign}
          onChange={(e) => {
            setProp((props) => (props.textAlign = e.target.value), 1000);
          }}
          className="mt-1 p-1 border border-gray-300 rounded-md text-sm w-full"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
    </>
  );
};

export const CardDefaultProps = {
  title: "Card Title",
  content: "Card content goes here...",
  color: "#333333", // Default text color
  backgroundColor: "#ffffff", // Default background color
  border: "1px solid #cccccc", // Default border
  borderRadius: "0.5rem", // Default border radius
  padding: "1rem", // Default padding
  margin: "1rem", // Default margin
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Default box shadow
  textAlign: "left", // Default text alignment
};

Card.craft = {
  props: CardDefaultProps,
  related: {
    settings: CardSettings,
  },
};
