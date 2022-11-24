import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HandRaisedIcon,PencilIcon } from '@heroicons/react/24/outline'
import clsx from "clsx"

const Drawer = dynamic(() => import("../../components/Drawer"), {
  ssr: false,
});
type Props = {
  event:Event
};

type Size = {
  width: number;
  height: number;
};
type Event = "NETRAL" | "DRAW" |"GRAB";

export default function Draw({}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setsize] = useState<Size>({
    width: 0,
    height: 0,
  });
  const [event, setevent] = useState<Event>("NETRAL");
  

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
      className={clsx("max-w-screen-2xl mx-auto h-screen border-2 relative overflow-hidden",
        event==="GRAB" && "cursor-grab",
        event==="DRAW" && "cursor-crosshair"
      )}
      ref={containerRef}
    >

      <div className="flex absolute top-10 z-20 left-1/2 -translate-x-1/2 w-fit gap-5 px-5 py-2 rounded-md border-2 shadow bg-white">
          <button onClick={()=>setevent("GRAB")} className="p-3 transition-colors hover:bg-gray-200 rounded-md cursor-pointer">
            <HandRaisedIcon className="w-5 h-5 text-black"/>
          </button>
          <button onClick={()=>setevent("DRAW")} className="p-3 transition-colors hover:bg-gray-200 rounded-md cursor-pointer">
            <PencilIcon className="w-5 h-5 text-black"/>
          </button>
      </div>
      <Drawer event={event}  size={size}/>
      
    </div>
  );
}
