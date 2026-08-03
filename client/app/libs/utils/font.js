"use client"

import { Bricolage_Grotesque, Montserrat, Ubuntu }  from "next/font/google"



export const bricolage = Bricolage_Grotesque({
  weight: "700",
  subsets: ["vietnamese"]
})


export const montserrat = Montserrat({
  weight: "700",
  subsets: ["vietnamese"]
})
 
export const ubuntu = Ubuntu({
  weight: ["300", "500", "700"],
  subsets: ["vietnamese"]
})
