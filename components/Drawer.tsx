import { Stage, Layer, Line, Text } from "react-konva";

import React, { useState, useRef } from "react";

type Event = "NETRAL" | "DRAW" | "GRAB";
type Props = {
  event: Event;
  size: {
    width: number;
    height: number;
  };
};
type LineDraw = {
  tool: any;
  points: number[];
};
export default function Drawer({ ...props }: Props) {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState<LineDraw[]>([]);
  const [lastCenter, setlastCenter] = useState<any>(null);
  const [lastDistance, setlastDistance] = useState<any>(null);
  const isDrawing = useRef(false);

  function initDraw(e: any) {
    if (props.event !== "DRAW") return;
    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = relativePointerPosition(stage);
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  }

  function handleDraw(e: any) {
    if (props.event !== "DRAW") return;
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
    if (props.event !== "DRAW") return;
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

    
    // alert(newCenter.x)
    // alert(lastCenter.x)


    if(!lastCenter) {
      alert("kibo")
      return
    }
    var dx = newCenter.x - lastCenter.x;
    var dy = newCenter.y - lastCenter.y;

    var newPos = {
      x: newCenter.x - pointTo.x * scale + dx,
      y: newCenter.y - pointTo.y * scale + dy,
    };

    stage.position(newPos);

    setlastDistance(dist);
    setlastCenter(lastCenter);
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

  return (
    <Stage
      onTouchStart={initDraw}
      onTouchMove={(e) => {
        handleDraw(e);
        handlePinchZoom(e);
      }}
      onTouchEnd={() => {
        stopDraw();
        stopPinchZoom();
      }}
      draggable={props.event === "GRAB"}
      width={props.size.width}
      height={props.size.height}
      onMouseDown={initDraw}
      onMousemove={handleDraw}
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
              line.tool === "eraser" ? "destination-out" : "source-over"
            }
          />
        ))}
      </Layer>
    </Stage>
  );
}
