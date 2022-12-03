import { MouseEvent, MouseEventHandler, useEffect, useRef, useState } from "react";
import SocketIOClient, { Socket } from "socket.io-client";

type mouseCoor = {
  x: number;
  y: number;
};

type mouseCollabUser = mouseCoor & {
  id: string;
};
let socket: Socket | undefined;
export default function Resocket() {
  const shouldInit = useRef(true);
  const [loading, setloading] = useState(true);
  const [valid, setvalid] = useState(false);
  const [mouseCoor, setMouseCoor] = useState({
    x: 0,
    y: 0,
  });
  const [collabMouseUser, setcollabMouseUser] = useState<mouseCollabUser[]>([]);
  

  useEffect(() => {
    if (!shouldInit.current) return;
    initSocket();

    return () => {
      socket?.off("full");
      socket?.off("total");
      socket?.off("connect");
      socket?.off("adduser");
      socket?.off("userMouseCollab");
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
        setvalid(false);
      } else {
        setvalid(true);
        setloading(false);
      }
    });

    socket.on("userMouseCollab", (data) => {
      setcollabMouseUser(data);
      
    });

    setTimeout(() => {
      if (socket) {
        socket.emit("adduser", null);
      }
    }, 200);
    shouldInit.current = false;
  }

  function collabMouse(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
    socket?.emit("mouseCollab", {
      x: e.clientX - e.currentTarget.offsetTop,
      y: e.clientY - e.currentTarget.offsetLeft,
    });
  }

  return (
    <>
      {loading && <div>loading</div>}
      {!loading && valid && <div>loaded</div>}
      {socket && (
        <div className="w-full h-screen relative" onMouseMove={collabMouse}>
          {socket != undefined &&
            collabMouseUser.map((el, i) =>
              el.id !== socket?.id ? <Cursor key={el.id} {...el}/> : <></>
            )}
        </div>
      )}
    </>
  );
}


function Cursor({...props}:mouseCollabUser) {
  return (
    <div
      key={props.id}
      className="w-5 h-5 flex transition-all absolute"
      style={{
        top: props.y + "px",
        left: props.x + "px",
      }}
    >
      <svg
        className="w-full h-full fill-blue-700 text-blue-700 "
        viewBox="0 0 21 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="shadow-md fill-current"
          d="M0.272972 0.877113C0.380274 0.769888 0.517568 0.697723 0.666733 0.670139C0.815898 0.642556 0.969921 0.660851 1.10847 0.722612L20.2005 9.20811C20.334 9.2674 20.4473 9.36439 20.5265 9.48718C20.6056 9.60997 20.6472 9.75321 20.6461 9.8993C20.645 10.0454 20.6012 10.188 20.5202 10.3095C20.4392 10.4311 20.3244 10.5264 20.19 10.5836L13.041 13.6451L9.97797 20.7956C9.92037 20.9295 9.825 21.0437 9.70351 21.1243C9.58202 21.2049 9.43969 21.2483 9.29391 21.2493C9.14814 21.2502 9.00525 21.2087 8.88272 21.1297C8.76018 21.0507 8.66332 20.9378 8.60397 20.8046L0.118472 1.71261C0.0570435 1.57425 0.0389261 1.42053 0.0665019 1.27168C0.0940778 1.12282 0.166056 0.985792 0.272972 0.878613L0.272972 0.877113Z"
        />
      </svg>
    </div>
  );
}
