import React, { useState } from 'react'


type Size={
    height:number,
    width:number
}

export default function useScreenSize():[Function,Size] {
const [screenSize, setscreenSize] = useState<Size>({
    height:window.innerHeight,
    width:window.innerWidth
})
  return [
    function(){
        if(window){
            window.addEventListener("resize",()=>{
                setscreenSize({
                    height:window.innerHeight,
                    width:window.innerWidth
                })
            })
        }
    },
    screenSize
  ]
}

