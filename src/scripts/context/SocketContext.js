import { useEffect, useState, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import io from "socket.io-client";

import { setSocketConnected } from "../store/slices/app/app-slices";
import { selectIsAuth } from "../../scripts/store/slices/app/selectors";

const Context = createContext({});

export const ContextSocketProvider = ({ children }) => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuth) {
      const socketIo = io("https://aiohub.gg", {
        withCredentials: true,
      });

      socketIo.on("connect", () => {
        console.log("socket connected");
        dispatch(setSocketConnected(true));
        setSocket(socketIo);
        console.log("socketIO is set to socket variable");
        enqueueSnackbar("Connected to socket server", { variant: "success" });
      });

      // Listen for disconnect event
      socketIo.on("disconnect", () => {
        dispatch(setSocketConnected(false));
        setSocket(null);
        enqueueSnackbar("Disconnected from socket server", {
          variant: "error",
        });
      });

      // Cleanup on unmount
      return () => {
        socketIo.disconnect();
      };
    }
  }, [isAuth]);

  return <Context.Provider value={socket}>{children}</Context.Provider>;
};

export const ContextSocket = Context;
