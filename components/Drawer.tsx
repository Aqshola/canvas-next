import { Stage, Layer, Line, Text } from "react-konva";
import SocketIOClient, { Socket } from "socket.io-client";
import React, { useState, useRef, MouseEvent } from "react";
import {
  Size,
  Event,
  LineDraw,
  mouseCollabUser,
  CollabLineDraw,
} from "../types/types";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  event: Event;
  size: {
    width: number;
    height: number;
  };
  handleLoading:(...props:any)=>void
  handleValid:(...props:any)=>void
  loading:boolean
  valid:boolean
};

let socket: Socket | undefined;

export default function Drawer({ ...props }: Props) {
  //DRAW
  const [lines, setLines] = useState<LineDraw[]>([]);
  // const [collabLines, setcollabLines] = useState<CollabLineDraw[]>([])
  const [lastCenter, setlastCenter] = useState<any>(null);
  const [lastDistance, setlastDistance] = useState<any>(null);

  //SOCKET
  const [loading, setloading] = useState(true);
  const [valid, setvalid] = useState(false);
  const [collabMouseUser, setcollabMouseUser] = useState<mouseCollabUser[]>([]);

  const isDrawing = useRef(false);
  const shouldInit = useRef(true);
  const collabLines = useRef<CollabLineDraw[]>([]);
  const counterInitDraw = useRef(0);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!shouldInit.current) return;
    initSocket();

    return () => {
      socket?.off("full");
      socket?.off("total");
      socket?.off("connect");
      socket?.off("adduser");
      socket?.off("userMouseCollab");
      socket?.off("newInitDrawCollab");
      socket?.off("newDrawCollab");
      socket?.close();
    };
  }, []);

  async function initSocket() {
    await fetch(`/api/draw/${id}`);
    socket = SocketIOClient(`/${id}`);
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("total", (data) => {
      // console.log(data.length);
    });

    socket.on("full", (data) => {
      
      if (data) {
        props.handleLoading(false);
        props.handleValid(false);
      } else {
        props.handleValid(true);
        setTimeout(() => {
          props.handleLoading(false);
        }, 2000);
      }
    });

    socket.on("userMouseCollab", (data) => {
      setcollabMouseUser(data);
    });

    socket.on("newInitDrawCollab", (data) => {
      counterInitDraw.current += 1;
      
      if (counterInitDraw.current === 1) {
        collabLines.current.push(data);
      }

      if (counterInitDraw.current === 2) {
        counterInitDraw.current = 0;
      }

      
    });

    socket.on("newDrawCollab", (data) => {
      const lineCollabUser = collabLines.current.filter(
        (line) => line.id === data.id
      );
      const lastLineCollabed = lineCollabUser[lineCollabUser.length - 1];
      const lineCollabDifferent = collabLines.current.filter(
        (line) => line.id !== data.id
      );

      if (lineCollabUser.length > 0) {
        lastLineCollabed.points = lastLineCollabed.points.concat(data.data);
        lineCollabUser.splice(lineCollabUser.length - 1, 1, lastLineCollabed);

        collabLines.current = [...lineCollabDifferent, ...lineCollabUser];
      }
    });

    // socket.on("reloading",(data:any[])=>{
    //   if(socket){
    //     const indexOf=data.indexOf(socket.id)
    //     if(indexOf!=-1){
    //       if(typeof window !== 'undefined'){
    //         window.location.reload()
    //       }
    //     }
    //   }
    // })


    setTimeout(() => {
      if (socket) {
        socket.emit("adduser", null);
      }
    }, 200);

    
    shouldInit.current = false;
  }

  //COLLAB

  function initCollabDraw(e: any) {
    if (
      (props.event !== "DRAW" && props.event !== "ERASE") ||
      !isDrawing.current
    )
      return;
    const stage = e.target.getStage();
    const pos = relativePointerPosition(stage);
    socket?.emit("initDrawCollab", {
      tool: props.event,
      points: [pos.x, pos.y],
    });
  }

  function collabMouse(e: any) {
    const stage = e.target.getStage();
    const point = relativePointerPosition(stage);
    socket?.emit("mouseCollab", {
      x: point.x,
      y: point.y,
    });

    if (
      (props.event !== "DRAW" && props.event !== "ERASE") ||
      !isDrawing.current
    )
      return;
    socket?.emit("drawCollab", [point.x, point.y]);
  }

  function collabTouch(e: any) {
    const stage = e.target.getStage();
    const point = relativePointerPosition(stage);
    socket?.emit("mouseCollab", {
      x: point.x,
      y: point.y,
    });
  }

  

  //DRAW
  function initDraw(e: any) {
    if (props.event !== "DRAW" && props.event !== "ERASE") return;
    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = relativePointerPosition(stage);
    setLines([...lines, { tool: props.event, points: [pos.x, pos.y] }]);
  }

  function handleDraw(e: any) {
    if (props.event !== "DRAW" && props.event !== "ERASE") return;
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = relativePointerPosition(stage);
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  }

  function stopDraw() {
    if (props.event !== "DRAW" && props.event !== "ERASE") return;
    isDrawing.current = false;
  }

  function handleZoom(e: any) {
    if (props.event !== "GRAB") return;
    const scaleBy = 1.3;
    e.evt.preventDefault();
    const stage = e.target.getStage();
    let oldScale = stage.scaleX();

    let mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    let newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    };
    stage.position(newPos);
  }

  function handlePinchZoom(e: any) {
    if (props.event !== "GRAB") return;

    const stage = e.target.getStage();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (!touch1 || !touch2) return;

    if (stage.isDragging()) {
      stage.stopDrag();
    }

    const point1 = {
      x: touch1.clientX,
      y: touch1.clientY,
    };

    const point2 = {
      x: touch2.clientX,
      y: touch2.clientY,
    };

    if (!lastCenter) {
      setlastCenter(getCenter(point1, point2));
    }

    const newCenter = getCenter(point1, point2);
    const dist = getDistance(point1, point2);

    if (!lastDistance) {
      setlastDistance(dist);
    }

    var pointTo = {
      x: (newCenter.x - stage.x()) / stage.scaleX(),
      y: (newCenter.y - stage.y()) / stage.scaleX(),
    };

    var scale = stage.scaleX() * (dist / lastDistance);

    stage.scaleX(scale);
    stage.scaleY(scale);

    if (!lastCenter) {
      return;
    }
    var dx = newCenter.x - lastCenter.x;
    var dy = newCenter.y - lastCenter.y;

    var newPos = {
      x: newCenter.x - pointTo.x * scale + dx,
      y: newCenter.y - pointTo.y * scale + dy,
    };

    socket?.emit("mouseCollab", newPos);
  }

  function stopPinchZoom() {
    setlastDistance(0);
    setlastDistance(null);
  }

  function relativePointerPosition(node: any) {
    var transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    var pos = node.getStage().getPointerPosition();

    // now we find relative point
    return transform.point(pos);
  }

  function getCenter(p1: any, p2: any) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  function getDistance(p1: any, p2: any) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  if(props.loading || !props.valid){
    return <></>
  }
  return (
    
    <div className="relative w-full h-full">
      {collabMouseUser.map((el) =>
        socket != undefined && el.id != socket.id ? (
          <Cursor id={el.id} x={el.x} y={el.y} key={el.id} />
        ) : (
          <></>
        )
      )}
      <Stage
        onTouchStart={(e) => {
          initDraw(e);
          initCollabDraw(e);
        }}
        onTouchMove={(e) => {
          handleDraw(e);
          handlePinchZoom(e);
          collabTouch(e);
          initCollabDraw(e);
        }}
        onTouchEnd={() => {
          stopDraw();
          stopPinchZoom();
        }}
        draggable={props.event === "GRAB"}
        width={props.size.width}
        height={props.size.height}
        onMouseDown={(e: any) => {
          initDraw(e);
          initCollabDraw(e);
        }}
        onMousemove={(e: any) => {
          handleDraw(e);
          collabMouse(e);
        }}
        onMouseup={stopDraw}
        onWheel={handleZoom}
      >
        <Layer>
          {lines.map((line: any, i: any) => (
            <Line
              key={i}
              points={line.points}
              stroke="#000000"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "ERASE" ? "destination-out" : "source-over"
              }
            />
          ))}

          {collabLines.current.map((line: CollabLineDraw, i: any) =>
            socket && line.id !== socket.id ? (
              <Line
                key={"collab" + i}
                points={line.points}
                stroke="#000000"
                strokeWidth={5}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "ERASE" ? "destination-out" : "source-over"
                }
              />
            ) : (
              <></>
            )
          )}
        </Layer>
      </Stage>
    </div>
  );
}

function Cursor({ ...props }: mouseCollabUser) {
  return (
    <div
      key={props.id}
      className="w-5 h-5 flex transition-all absolute z-30"
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
