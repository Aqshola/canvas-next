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
  const isDrawing = useRef(false);
  const [zoomState, setzoomState] = useState({
    stageScale:1,
    stageX:0,
    stageY:0
  })
  

  const handleMouseDown = (e: any) => {
    if (props.event !== "DRAW") return;
    isDrawing.current = true;
    const stage=e.target.getStage()
    const pos = relativePointerPosition(stage);
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
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
  };

  const handleMouseUp = () => {
    if (props.event !== "DRAW") return;
    isDrawing.current = false;
  };

  function relativePointerPosition(node:any) {
    var transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    var pos = node.getStage().getPointerPosition();
    

    // now we find relative point
    return transform.point(pos);
  }

  function handleWheel(e:any){
    if(props.event !=="GRAB") return
    const scaleBy=1.3
    e.evt.preventDefault()
    const stage=e.target.getStage()
    let oldScale=stage.scaleX()

    let mousePointTo={
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y:stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    }

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    let newPos = {
      x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    };
    stage.position(newPos);
  }

  return (
    <Stage
      draggable={props.event === "GRAB"}
      width={props.size.width}
      height={props.size.height}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onWheel={handleWheel}
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
