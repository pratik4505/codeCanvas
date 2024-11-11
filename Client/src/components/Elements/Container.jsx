import { useNode, useEditor } from "@craftjs/core";
import React, { useContext } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
export const Container = ({ children, ...props }) => {
  const {
    connectors: { connect, drag },
    id,
    parent,
    nodes,
    linkedNodes,
    props: myprops,
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
    console.log(nodeData);
    // Ensure `myFlag` is initialized if undefined
    if (nodeData.custom.myFlag === "no") {
      actions.setCustom((custom) => {
        custom.myFlag = "yes";
      });
      return; // Prevent further code execution until `myFlag` is set
    }
    console.log(id, nodeData);
    // Emit only if myFlag has been set
    socket.emit("update", {
      nodeId: id,
      nodeData: nodeData,
      action: "update",
      room: commitId,
    });
  }, [myprops, parent, nodes, linkedNodes, socket]);

  return (
    <div {...props} ref={(ref) => connect(drag(ref))}>
      {children ? (
        children
      ) : (
        <div className="text-center italic p-4 bg-yellow-100 outline-1 outline-dashed outline-amber-400">
          Empty container
        </div>
      )}
    </div>
  );
};
