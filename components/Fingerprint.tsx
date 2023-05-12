import { ClientJS } from 'clientjs'
import React, { useEffect } from 'react'


type Props={
    setFingerPrint:([...params]:any)=>void


}
export default function Fingerprint({setFingerPrint}:Props) {

    useEffect(() => {
      const client=new ClientJS()
      setFingerPrint(client.getFingerprint())
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])



  return null
}
