import { useRouter } from "next/router";
import React from "react";

type Props = {};

export default function Index({}: Props) {
  const route=useRouter()
    
  return (
    <div className="max-w-screen-2xl mx-auto flex flex-col items-center justify-center pt-56">
      <h1 className="text-transparent text-7xl lg:text-8xl font-bold bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">Canvas Next</h1>
      <p className="mt-2 font-semibold text-xl">Simple Canvas app with NextJS</p>
      <button onClick={()=>route.push("/draw/sasa")} className="mt-7 w-fit px-3 py-1 bg-blue-600 hover:shadow-lg transition-shadow text-white rounded-md font-semibold text-lg">Create Canvas</button>
    </div>
  );
}
