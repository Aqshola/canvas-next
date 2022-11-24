import React from 'react'
import { Stage, Layer, Rect, Circle } from 'react-konva';

type Props = {}

export default function dummyConva({}: Props) {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Rect width={50} height={50} fill="red" />
        <Circle x={200} y={200} stroke="black" radius={50} />
      </Layer>
    </Stage>
  )
}