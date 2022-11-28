import { ClientJS } from 'clientjs'
import React, { useEffect } from 'react'


type Props={
    setFingerPrint:([...params]:any)=>void


}
export default function Fingerprint({setFingerPrint}:Props) {
    
    useEffect(() => {
      const client=new ClientJS()
      setFingerPrint(client.getFingerprint())
    }, [])
    
    
    
  return null
}