import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { OnlineActions } from "../store/OnlineSlice";

const socket = io(import.meta.env.VITE_API_URL);

export default function useSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("getOnlineUsers", (data) => {
      dispatch(OnlineActions.create(data)); // Dispatch the data to the Redux store
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [dispatch]); // Only rerun this effect when dispatch changes (usually won't change)

}

export {socket}