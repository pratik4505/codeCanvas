import { useNode } from "@craftjs/core";
import { Label } from "../utils/Label";
import { TextInput } from "../utils/TextInput";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useLocation } from "react-router-dom";
export const Button = ({ text }) => {
  const {
    connectors: { connect, drag },
    id,
    data,
  } = useNode((node) => ({
    data: node.data,
  }));
  const location = useLocation();
  const que = new URLSearchParams(location.search);
  const commitId = que.get("commitId");
  const { socket } = useContext(GlobalContext);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (hasMounted) {
      console.log("Button changes", id);
      socket.emit("update", {
        nodeId: id,
        nodeData: data,
        action: "update",
        room: commitId,
      });
    } else {
      setHasMounted(true);
    }
  }, [data]);

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
