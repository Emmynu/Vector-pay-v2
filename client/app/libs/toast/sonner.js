"use client"

import { toast } from "sonner"



export  function showToast({ type, title, msg}) {
    if (type === "success") {
        toast.success(title,{
             description: msg, 
             duration: 3500,
             style: {
                color: "green",
                borderLeft: "8px solid green",
                boxShadow: "2px 6px 12px rgba(0, 0, 0, 0.3)",
                fontSize: "12.5px",
             }
        })
    }
    
    else if(type === "warning"){
        toast.warning(title,{ description: msg, duration: 3000})
    }
    else if(type === "error"){
        toast.error(title, {
            description:msg,
            duration:4000,
            style:{
                boxShadow: "2px 6px 12px rgba(0, 0, 0, 0.3)",
                fontSize: "12.5px",
                color: "red",
                borderLeft: "8px solid red",
            }
        })
    }
} 