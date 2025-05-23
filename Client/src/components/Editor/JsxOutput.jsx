import { useState, useEffect } from "react";
import { useEditor } from "@craftjs/core";
import { Panel } from "./Panel";
import { toast } from "react-toastify";
const __transformChildren = (children, getNode, level, formatted) => {
  const result = children.map((child) =>
    transformToJSX(getNode(child).get(), getNode, level + 1, formatted)
  );
  return formatted ? result : result.join("\n");
};

const __getTabs = (level, formatted) => {
  return level > 1
    ? Array.from(Array(level - 1).keys()).map(() =>
        formatted ? <span>&nbsp;</span> : " "
      )
    : "";
};

const __plainTextOutput = (name, getNode, level, children, props) => {
  const tabs = __getTabs(level, false);
  const plainTabs = tabs.length > 0 ? tabs.join("") : tabs;

  return `${plainTabs}<${name}${
    props.length > 0 && props[0] !== "" ? " " + props.join(" ") : ""
  }${
    children.length > 0
      ? `>\n${__transformChildren(
          children,
          getNode,
          level + 1,
          false
        )}\n${plainTabs}</${name}>`
      : " />"
  }`;
};

const __prettyOutput = (name, getNode, level, children, props) => {
  const tabs = __getTabs(level, true);
  return (
    <span>
      {tabs}
      <span className="text-gray-500">&lt;</span>
      <span className="text-sky-600">{name}</span>
      {props.length > 0 && props[0] !== "" && (
        <>
          {props.map((prop) => (
            <>&nbsp;{prop}</>
          ))}
        </>
      )}
      {children.length > 0 ? (
        <>
          <span className="text-gray-500">&gt;</span>
          <br />
          {__transformChildren(children, getNode, level + 1, true).map(
            (child) => (
              <span key={child}>
                {child}
                <br />
              </span>
            )
          )}
          {tabs}
          <span className="text-gray-500">&lt;/</span>
          <span className="text-sky-600">{name}</span>
          <span className="text-gray-500">&gt;</span>
        </>
      ) : (
        <>
          <span className="text-gray-500">&nbsp;/&gt;</span>
        </>
      )}
    </span>
  );
};

const transformToJSX = (node, getNode, level = 1, formatted) => {
  if (!node) return null;

  const props = Object.keys(node.data.props).map((prop) =>
    prop !== "children" ? (
      formatted ? (
        <span key={prop}>
          <span className="text-red-400">{prop}</span>
          <span>=</span>
          <span className="text-lime-600">"{node.data.props[prop]}"</span>
        </span>
      ) : (
        `${prop}="${node.data.props[prop]}"`
      )
    ) : (
      ""
    )
  );

  const linkedNodes = Object.keys(node.data.linkedNodes).map(
    (linkedNode) => node.data.linkedNodes[linkedNode]
  );

  const children = node.data.nodes.length > 0 ? node.data.nodes : linkedNodes;

  return formatted
    ? __prettyOutput(node.data.name, getNode, level, children, props)
    : __plainTextOutput(node.data.name, getNode, level, children, props);
};

export const JsxOutput = () => {
  const { query } = useEditor();
  const [rootNode, setRootNode] = useState();
  const [output, setOutput] = useState();

  const [formatted, setFormatted] = useState(true);

  const generateCode = () => {
    const nodes = query.getNodes();
    const rootNode = nodes["ROOT"];

    setRootNode(rootNode);
    setOutput(query.serialize());
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content).then(
      () => toast.success("Copied to clipboard!"),
      (err) => console.error("Could not copy text:", err)
    );
  };

  useEffect(() => generateCode(), [formatted]);

  return (
    <Panel>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">JSX Preview</h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-1 ${
              formatted
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-900"
            }  border rounded shadow-md`}
            onClick={() => setFormatted(!formatted)}
          >
            {formatted ? "Pretty" : "Raw"}
          </button>
          <button
            className="px-4 py-1 bg-amber-500 text-white border rounded shadow-md"
            onClick={generateCode}
          >
            Refresh
          </button>
        </div>
      </div>
      <div className="mt-1 p-4 border rounded bg-white h-[20vh] overflow-auto relative">
        <pre>{transformToJSX(rootNode, query.node, true, formatted)}</pre>
        <button
          onClick={() =>
            copyToClipboard(
              transformToJSX(rootNode, query.node, true, formatted)
            )
          }
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded shadow"
        >
          Copy
        </button>
      </div>
      <div className="mt-1 p-4 border rounded bg-gray-200 text-gray-400 h-[10vh] overflow-auto relative">
        <pre>{output}</pre>
        <button
          onClick={() => copyToClipboard(output)}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-500 text-white rounded shadow"
        >
          Copy
        </button>
      </div>
    </Panel>
  );
};
