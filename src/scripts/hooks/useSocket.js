import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import io from "socket.io-client";

import { selectIsAuth } from "../../scripts/store/slices/app/selectors";

export const useSocket = () => {
  const isAuth = useSelector(selectIsAuth);

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuth) {
      const socketIo = io("http://34.70.151.217:5000", {
        withCredentials: true,
      });

      socketIo.on("connect", () => {
        setIsConnected(true);
        enqueueSnackbar("Connected to socket server", { variant: "success" });
      });

      // Listen for disconnect event
      socketIo.on("disconnect", () => {
        setIsConnected(false);
        enqueueSnackbar("Disconnected from socket server", {
          variant: "error",
        });
      });

      // Update socket state
      setSocket(socketIo);

      // Cleanup on unmount
      return () => {
        socketIo.disconnect();
      };
    }
  }, [isAuth]);

  return { socket, isConnected };
};
