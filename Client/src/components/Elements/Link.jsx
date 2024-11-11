import { useNode, useEditor } from "@craftjs/core";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useLocation } from "react-router-dom";

export const Link = ({ text, href, bypass }) => {
  const handleClick = (e) => {
    e.preventDefault();
  };
  let jsx = (
    <a
      className="text-indigo-700 hover:underline"
      href={href}
      onClick={handleClick}
      ref={(ref) => connect(drag(ref))}
    >
      {text}
    </a>
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

const LinkSettings = () => {
  const {
    actions: { setProp },
    text,
    href,
  } = useNode((node) => ({
    text: node.data.props.text,
    href: node.data.props.href,
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
          Link URL
        </label>
        <input
          type="url"
          defaultValue={href}
          onChange={(e) => {
            setProp((props) => (props.href = e.target.value), 1000);
          }}
          className="mt-1 p-2 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>
    </>
  );
};

export const LinkDefaultProps = {
  text: "New Link",
  href: "#",
};

Link.craft = {
  props: LinkDefaultProps,
  related: {
    settings: LinkSettings,
  },
};
