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
         toast.warning(title, {
            description:msg,
            duration:4000,
            style:{
                boxShadow: "2px 6px 12px rgba(0, 0, 0, 0.3)",
                fontSize: "12.5px",
                color: "#f0b100",
                borderLeft: "8px solid #f0b100",
            }
        })
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

    else if(type === "info"){
        toast.info(title, {
            description:msg,
            duration:2000,
            style:{
                boxShadow: "2px 6px 12px rgba(0, 0, 0, 0.3)",
                fontSize: "12.5px",
                color: "black",
                borderLeft: "8px solid black",
            }
        })
    }
    
    
} 