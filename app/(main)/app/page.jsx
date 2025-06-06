"use client"

import { HamburgerMenu, User } from "@/app/libs/component";
import { Poppins, Roboto } from "next/font/google";
import walletIcon from "../../images/wallet-blue.png"
import eyeIcon from "../../images/white-eye.png"
import invisibleIcon from "../../images/white-invisible.png"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const poppins = Poppins({
    subsets: ["latin"],
    weight: "800"
})

export const roboto = Roboto({
    subsets: ["latin"],
    weight: "300"
})

export default function DashBoard(){
    const [viewAmount, setViewAmount] = useState(false)

    console.log(viewAmount);
    
 
    return <main>
        <header className="dashboard-header">
            <section>
               <HamburgerMenu />
                <h2>DashBoard</h2>
            </section>
            <section>
                <div className="balance-container">
                    <h2>₦2000</h2>
                </div>
                <User />
                {/* notification icon */}
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>

            </section>
        </header>

        <section className="my-10 mx-5 md:m-10">
            <h2 className={`wallet-label`}>My Wallet</h2>

            <section className="wallet-container">
                <section className="wallet-balance-container">
                    <div className="balance">
                        <Image src={walletIcon} alt="wallet-icon"/>
                        <h2 className={poppins.className}>Wallet Balance:</h2>
                        <h1 className="amount flex">₦ 0.00</h1>
                        <sub><Image src={!viewAmount ? eyeIcon : invisibleIcon} alt="" className="w-4 h-4 cursor-pointer" onClick={()=>setViewAmount(prev=> !prev)}/></sub>
                    </div>
                    <div className="transaction-count-container">
                        <Image src={walletIcon} alt="wallet-icon"/>
                        <h2 className={poppins.className}>Total Transaction:</h2>
                        <h1 className="transaction-count">0 </h1>
                    </div>
                    <div>
                        <img src={"https://img.icons8.com/?size=100&id=121760&format=png&color=000000"} alt="wallet-icon" className="w-6 h-6"/>
                        <Link href={"/"}>Add Funds</Link>
                    </div>
                </section>
                <div className="bg-main h-[100px] w-[100px] col-span-1"></div>
            </section>
        </section>
    </main>
}