import React, {
  useEffect,
  useRef,
  createContext,
  useContext,
  useState,
} from "react";

import { useEditor } from "@craftjs/core";
import { fetchCommit } from "../../Api/projectApi";
import { GlobalContext } from "../../Providers/GlobalProvider";

export const SyncContext = createContext();

const SyncProvider = ({ commitId, children }) => {
  const { actions, query } = useEditor((state) => ({
    actions: state.actions,
    query: state.query,
  }));

  const { socket, userData } = useContext(GlobalContext);

  const fetch = async () => {
    try {
      const response = await fetchCommit(commitId);
      const commitData = response.data.commitData;

      actions.deserialize(commitData);
    } catch (error) {
      console.error("Failed to load commit data:", error);
    }
  };

  useEffect(() => {
    fetch();
    socket.emit("joinCommit", { commitId });

    const handleSocketUpdate = ({ nodeId, nodeData, action, room }) => {
      if (room !== commitId) return;

      if (action === "delete") {
        actions.delete(nodeId);
      } else {
      }
    };

    socket.on("update", handleSocketUpdate);

    return () => {
      socket.off("update", handleSocketUpdate);
    };
  }, []);

  return <>{children}</>;
};

export default SyncProvider;
