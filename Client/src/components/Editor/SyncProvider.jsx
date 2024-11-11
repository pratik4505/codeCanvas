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
      const commitData = response.data.commit;

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
      if (!nodeData || typeof nodeData !== "object") {
        console.error("Invalid nodeData received from socket:", nodeData);
        return;
      }

      if (action === "delete") {
        actions.delete(nodeId);
      } else {
        let data = JSON.parse(query.serialize());

        data = { ...data, [nodeId]: nodeData };

        Object.entries(data).forEach(([key, value]) => {
          data[key].custom = { myFlag: "no" };
        });

        actions.deserialize(JSON.stringify(data));
      }
    };

    socket.on("update", handleSocketUpdate);

    return () => {
      socket.off("update", handleSocketUpdate);
    };
  }, []);

  return <div>{children}</div>;
};

export default SyncProvider;
