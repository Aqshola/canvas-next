import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  HandRaisedIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Size, Event } from "../../types/types";
import { useRouter } from "next/router";

const Drawer = dynamic(() => import("../../components/Drawer"), {
  ssr: false,
});
type Props = {
  event: Event;
};

export default function Draw({}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setsize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const [event, setevent] = useState<Event>("DRAW");

  const [loading, setloading] = useState(true);
  const [valid, setvalid] = useState(false);
  const router = useRouter();

  function handleLoading(value: boolean) {
    setloading(value);
  }

  function handleValid(value: boolean) {
    setvalid(value);
  }

  useEffect(() => {
    if (containerRef.current) {
      setsize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  return (
    <div
      className={clsx(
        "max-w-screen-2xl mx-auto h-screen border-2 relative overflow-hidden",
        event === "GRAB" && "cursor-grab",
        event === "DRAW" && "cursor-crosshair",
        event === "ERASE" && "cursor-pointer"
      )}
      ref={containerRef}
    >
      {loading && (
        <>
          <div className="flex w-full h-full items-center justify-center">
            <h1 className="text-center text-2xl text-blue-500 font-semibold">
              Loading Drawer ....
            </h1>
          </div>
        </>
      )}

      {!loading && !valid && (
        <>
          <div className="flex w-full h-full items-center justify-center">
            <h1 className="text-center text-2xl text-blue-500 font-semibold">
              Ooooops, room is full
            </h1>
            <p className="text-center text-xl text-blue-500">
              Please wait for a while and refresh
            </p>
          </div>
        </>
      )}

      {!loading && valid && (
        <>
          <button
            className="p-2  rounded absolute top-10 left-10 border-2  hover:border-black z-20 transition-all"
            onClick={() => router.push("/")}
          >
            <ChevronLeftIcon className="w-5 h-5 outline-current" />
          </button>
          <div className="flex absolute top-10 z-20 left-1/2 -translate-x-1/2 w-fit gap-5 px-5 py-1 rounded-md border-2 shadow bg-white">
            <button
              onClick={() => setevent("GRAB")}
              className={clsx(
                "p-1 transition-colors hover:bg-gray-200 rounded-md cursor-pointer",
                event === "GRAB" && "bg-gray-200"
              )}
            >
              <HandRaisedIcon className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={() => setevent("DRAW")}
              className={clsx(
                "p-1 transition-colors hover:bg-gray-200 rounded-md cursor-pointer",
                event === "DRAW" && "bg-gray-200"
              )}
            >
              <PencilIcon className="w-5 h-5 text-black" />
            </button>
            <button
              onClick={() => setevent("ERASE")}
              className={clsx(
                "p-1 transition-colors hover:bg-gray-200 rounded-md cursor-pointer",
                event === "ERASE" && "bg-gray-200"
              )}
            >
              <TrashIcon className="w-5 h-5 text-black" />
            </button>
          </div>
        </>
      )}
      <Drawer
        event={event}
        size={size}
        handleLoading={handleLoading}
        handleValid={handleValid}
        loading={loading}
        valid={valid}
      />
    </div>
  );
}
