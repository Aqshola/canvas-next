import { useEffect, useRef, useState } from "react";
import SocketIOClient, { Socket } from "socket.io-client";
import { isObjectBindingPattern } from "typescript";

let socket: Socket | undefined;
export default function Resocket() {
  const shouldInit = useRef(true);
  const [loading, setloading] = useState(true);
  const [valid, setvalid] = useState(false);

  useEffect(() => {
    if (!shouldInit.current) return;
    initSocket();

    return () => {
      socket?.off("full");
      socket?.off("total");
      socket?.off("connect");
      socket?.off("adduser");
      socket?.close();
    };
  }, []);

  async function initSocket() {
    await fetch("/api/socket");
    socket = SocketIOClient();
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("total", (data) => {
      console.log(data.length);
    });
    

    socket.on("full", (data) => {
      if (data) {
        alert("Full");
        setloading(false);
        setvalid(false)
      }else{
        setvalid(true)
        setloading(false)
      }
    });

    setTimeout(() => {
      if (socket) {
        socket.emit("adduser", null);
      }
    }, 200);
    shouldInit.current = false;
  }

  return (
    <>
      {loading && <div>loading</div>}
      {!loading && valid && <div>loaded</div>}
    </>
  );
}
