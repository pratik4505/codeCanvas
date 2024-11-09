import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import "./messageContainer.scss";

import { getMessages, postMessage } from "../../Api/chatApi";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";

import FallbackLoading from "../loader/FallbackLoading";
import { GlobalContext } from "../../Providers/GlobalProvider";
import SendIcons from "../../icons/SendIcon";
import GroupIcon from "../../icons/GroupIcon";
import IoIosArrowBack from "../../icons/IoIosArrowBack";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
const msgPerLoad = 50;

let myId;

export default function MessageContainer(props) {
  const [messages, setMessages] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [currMsg, setCurrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const { userData, socket } = useContext(GlobalContext);
  const scrollRef = useRef(null);

  const messageLoader = async () => {
    try {
      const limit = msgPerLoad;
      const createdAt =
        messages.length > 0 ? messages[0].createdAt : new Date();
      const response = await getMessages(limit, props.data.id, createdAt);

      if (response.data) {
        const data = response.data;

        if (data.length > 0) {
          setMessages((prevMessages) => [...data, ...prevMessages]);
          setLoadMore(true);
        } else {
          setLoadMore(false);
        }
      } else {
        console.error("Failed to fetch messages");
      }
      setLoading(false);
    } catch (error) {
      console.error("An error occurred while fetching messages:", error);
    }
  };

  useEffect(() => {
    myId = userData.userId;
    if (!myId) return;
    setMessages([]);
    messageLoader();
    socket.on("receiveMessage", (data) => {
      if (
        data.senderId !== myId &&
        data.room.toString() === props.data.id.toString()
      ) {
        setMessages((prev) => {
          return [
            ...prev,
            {
              _id: uuidv4(),
              message: data.message,
              senderId: data.senderId,
              createdAt: data.createdAt,
              id: props.data.id,
            },
          ];
        });
        scrollToBottom();
      }
    });
  }, [props.data.id]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToBottom();
    }
  };

  const sendMsg = async () => {
    const _id = uuidv4();
    const msg = currMsg;

    setMessages((prev) => {
      return [
        ...prev,
        { _id: _id, senderId: myId, message: currMsg, id: props.data.id },
      ];
    });
    setCurrMsg("");

    socket.emit("sendMessage", {
      room: props.data.id,
      message: msg,
      senderId: myId,
      createdAt: new Date(),
      userData: userData,
    });

    const data = {
      senderId: myId,
      id: props.data.id,
      message: msg,
    };

    try {
      const response = await postMessage(data);

      if (response.error) {
        console.error("Failed to save message to the server");
      }
    } catch (error) {
      console.error("An error occurred while posting the message:", error);
    }
    scrollToBottom();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  };

  return (
    <div className="w-full h-full  bg-white shadow-5xl m-0">
      <div className="w-full bg-primary-300 h-[10%]  flex items-center justify-between px-[2%]  ">
        <div className="flex items-center justify-between">
          <GroupIcon
            size={60}
            className=" bg-red-500 rounded-full flex-shrink-0 mr-3"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl ml-2 text-[#ffffff]">
              {props.data.chatName}
            </h1>
          </div>
        </div>
      </div>
      {loading && <FallbackLoading />}
      <ScrollToBottom
        className="flex flex-col overflow-y-auto h-[80%] px-2"
        ref={scrollRef}
      >
        {messages &&
          messages.map((msg) => (
            <div
              className={`message ${
                msg.senderId === myId ? "outgoing" : "incoming"
              }`}
              key={msg._id}
            >
              <h3 className="text-lg font-semibold text-center text-gray-700 mb-1">
                {props.data.members[msg.senderId]}
              </h3>

              <div dangerouslySetInnerHTML={{ __html: msg.message }} />
            </div>
          ))}
      </ScrollToBottom>
      <div className="flex w-full border-none  text-base outline-none bg-gray-100 h-[10%]">
        <textarea
          id="textarea"
          value={currMsg}
          onChange={(e) => {
            setCurrMsg(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className=" w-full  h-full flex-grow border-none  text-base outline-none bg-gray-100 resize-none  overflow-y-auto p-3"
          placeholder="Write a message..."
        />
        <button onClick={sendMsg} className=" bg-primary-100 text-white p-2">
          <SendIcons size={50} className="" />
        </button>
      </div>
    </div>
  );
}
