import { useState, createContext, useEffect, useCallback } from "react";
import io from "socket.io-client";

export const GlobalContext = createContext();

const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

export const GlobalProvider = ({ children }) => {
  const [socket, setSocket] = useState(
    io(baseUrl.replace("http", "ws"), {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      withCredentials: true,
      pingInterval: 1000 * 60,
      pingTimeout: 1000 * 60 * 3,
    })
  );
  const [userData, setUserData] = useState(null);

  const listen = useCallback(() => {}, [socket]);

  const initialLoad = useCallback(async () => {
    console.log("Base URL:", baseUrl);

    const data = JSON.parse(localStorage.getItem("profile"));
    if (data) {
      const userId = data.userId;
      const token = data.accessToken;

      if (token && userId) {
        setUserData({ ...data });

        socket.emit("setup", userId);
        listen();
      } else {
        console.log("user Not autorized");
      }
    } else {
      console.error("An error occurred while authorizing:");
    }
  }, [socket, listen]);

  const signOut = () => {
    localStorage.removeItem("profile");

    setUserData(null);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket.IO connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    initialLoad();
    return () => {
      socket.disconnect();
    };
  }, [socket, initialLoad]);

  return (
    <GlobalContext.Provider
      value={{
        socket,
        userData,
        initialLoad,
        signOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
