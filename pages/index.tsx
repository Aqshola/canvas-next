import { useRouter } from "next/router";
import React from "react";

type Props = {};

export default function Index({}: Props) {
  const route = useRouter();

  return (
    <div className="max-w-screen-2xl mx-auto  background relative overflow-hidden">
      <div className="flex w-72 h-72 bg-emerald-500/30 top-[20%] rounded-full absolute left-1/3"></div>
      <div className="flex w-72 h-72 bg-blue-500/30 top-[20%] rounded-full absolute right-1/3"></div>
      <div className="flex flex-col items-center  pt-56 h-screen w-full  relative z-20 border text-center backdrop-blur-3xl">
        <h1 className="text-transparent text-7xl lg:text-8xl font-bold bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 z-30">
          Canvas Next
        </h1>
        <p className="mt-2 font-semibold text-xl z-30">
          Simple Canvas app with NextJS
        </p>
        <button
          onClick={() => route.push("/draw/sasa")}
          className="mt-7 w-fit px-3 py-1 bg-blue-600 hover:shadow-lg transition-shadow text-white rounded-md font-semibold text-lg"
        >
          Create Canvas
        </button>
      </div>
    </div>
  );
}
