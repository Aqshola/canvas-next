import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if(canvasRef != null){
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d")
      if(ctx){
        ctx.fillStyle="red"
        ctx?.fillRect(100,100,100,50)
        
      }
    }
  }, [])
  
  
  

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor:"white"
      }}
    >
      <div
        style={{
          width: "500px",
          height: "500px",
          margin: "auto",
          border: "1px solid black",
        }}
      >
        <canvas
          style={{
            width: "100%",
            height: "100%",
          }}
          id="canvas"
          ref={canvasRef}
        ></canvas>
      </div>
    </div>
  );
}
