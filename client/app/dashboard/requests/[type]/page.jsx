"use client"

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

const TYPES = ["received", "sent"];

function RequestTypePage() {
    const { type } = useParams()

    if (!TYPES.includes(type)) {
        notFound()
    };
    
    return ( 
       
        <div className="tabs tabs-border">

        </div>
     );
}

export default RequestTypePage;