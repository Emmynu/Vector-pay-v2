"use client"

import { useState, useEffect } from "react";



export default function useKoraPay(){
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [koraPayInstance, setKoraPayInstance] = useState(false)
 
    
    useEffect(()=>{
        if (typeof window.KoraPay !== "undefined") {
            setScriptLoaded(true)
            return
        }
        const script = document.createElement("script")
        script.src = "https://korablobstorage.blob.core.windows.net/modal-bucket/korapay-collections.min.js"
        script.async = true
        script.defer = true
        

        script.onload= ()=>{
            console.log("Kora pay loaded successfully");
            setScriptLoaded(true)
            setKoraPayInstance(window.Korapay)
        }
        script.onerror =()=>{
            console.log("Kora pay load failed");
            setScriptLoaded(false)

        }
        document.body.appendChild(script)

        return ()=>{
            if (document.body.contains(script)) {
                document.body.removeChild(script)
            }
        }
    },[])

    
    
    
    return {scriptLoaded , koraPayInstance}
}