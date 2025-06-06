"use client"
import {  SideBar, SideBarSm } from "./component";

export default function SideBarProvider() {

  
    return (
       <span className="select-none">
         <SideBar/>
         <SideBarSm/>
       </span>
    )
}