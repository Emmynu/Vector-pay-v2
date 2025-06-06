"use client"

import { auth } from "@/firebase/firebase-client";
import logOut from "../actions/main";
import {  useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Logo from "../images/logo.png"
import cancelIcon from "../images/cancel.png"
import Link from "next/link";
import "../styles/main.css"

 

export function SideBar() {
    
    async function handleLogout() {
        auth.signOut()
        await logOut()
    }
    

 

    return <aside className="sidebar-container">

        <section className="auth-logo-container">
            <Image src={Logo} width={30} height={30} alt="Logo"/>
            <h2 className="font-sans font-bold">VectorPay</h2>
        </section>
        <ul>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=87013&format=png&color=000000"} alt="dashboard-icon"/>
            <Link href={"/app"}>Dashboard</Link>
            </li>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=103537&format=png&color=000000"} alt="transaction-history-icon"/>
                <Link href={"/app/transaction-history"}>Transaction History</Link>
            </li>
        </ul>

        <ul>
            <h2>Main</h2>
            <li onClick={()=>document.getElementById('my_modal_3').showModal()}>
                <img src={"https://img.icons8.com/?size=100&id=121760&format=png&color=000000"} alt="wallet-icon"/>
                <span>Fund Wallet</span>
            </li>
            <li>
                <img src={"https://img.icons8.com/?size=100&id=103537&format=png&color=000000"} alt="atc-icon"/>
                <Link href={"*"}>Airtime to Cash</Link>
            </li>
            <li>
                <img src={"https://img.icons8.com/?size=100&id=OZJM1EFnyQ1s&format=png&color=000000"} alt="withdraw-icon"/>
                <Link href={"*"}>Withdraw</Link>
            </li>
        </ul>

        <ul>
        <h2>Services</h2>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=96511&format=png&color=000000"} alt="airtime-icon"/>
                <Link href={"*"}>Airtime Topup</Link>
            </li>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=60027&format=png&color=000000"} alt="data-icon"/>
                <Link href={"*"}>Data Topup</Link>
            </li>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=117470&format=png&color=000000"} alt="bills-icon"/>
                <Link href={"*"}>Pay bills</Link>
            </li>
        </ul>

        <ul>
            <h2>Settings</h2>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=2969&format=png&color=000000"} alt="settings-icon"/>
                <Link href={"*"}>Account Settings</Link>
            </li>
            <li onClick={handleLogout} >
            <img src={"https://img.icons8.com/?size=100&id=83259&format=png&color=000000"} alt="logout-icon"/>
                <p>Log out</p>
            </li>
        </ul>
    </aside>
} // side bar for large screens

export function SideBarSm() {
    
    async function handleLogout() {
        auth.signOut()
        await logOut()
    }
    
    function closeSideBar() {
        document.querySelector(".sidebar-container-sm").classList.remove("open-nav")
        document.querySelector(".sidebar-container-sm").classList.add("close-nav")
    }

 

    return <aside className="sidebar-container-sm close-nav" onClick={closeSideBar}>
        <nav className="flex justify-between items-start">
            <section className="auth-logo-container">
                <Image src={Logo} width={30} height={30} alt="Logo"/>
                <h2 className="font-sans font-bold">VectorPay</h2>
            </section>
            <section onClick={closeSideBar}>
                <Image src={cancelIcon} alt="cancel-icon" className="cursor-pointer"/>
            </section>
        </nav>
        
        <ul>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=87013&format=png&color=000000"} alt="dashboard-icon"/>
            <Link href={"/app"}>Dashboard</Link>
            </li>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=103537&format=png&color=000000"} alt="transaction-history-icon"/>
                <Link href={"/app/transaction-history"}>Transaction History</Link>
            </li>
        </ul>

        <ul>
            <h2>Main</h2>
            <li onClick={()=>document.getElementById('my_modal_3').showModal()}>
                <img src={"https://img.icons8.com/?size=100&id=121760&format=png&color=000000"} alt="wallet-icon"/>
                <span href={"*"}>Fund Wallet</span>
            </li>
            <li>
                <img src={"https://img.icons8.com/?size=100&id=103537&format=png&color=000000"} alt="atc-icon"/>
                <Link href={"*"}>Airtime to Cash</Link>
            </li>
            <li>
                <img src={"https://img.icons8.com/?size=100&id=OZJM1EFnyQ1s&format=png&color=000000"} alt="withdraw-icon"/>
                <Link href={"*"}>Withdraw</Link>
            </li>
        </ul>

        <ul>
        <h2>Services</h2>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=96511&format=png&color=000000"} alt="airtime-icon"/>
                <Link href={"*"}>Airtime Topup</Link>
            </li>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=60027&format=png&color=000000"} alt="data-icon"/>
                <Link href={"*"}>Data Topup</Link>
            </li>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=117470&format=png&color=000000"} alt="bills-icon"/>
                <Link href={"*"}>Pay bills</Link>
            </li>
        </ul>

        <ul>
            <h2>Settings</h2>
            <li>
            <img src={"https://img.icons8.com/?size=100&id=2969&format=png&color=000000"} alt="settings-icon"/>
                <Link href={"*"}>Account Settings</Link>
            </li>
            <li onClick={handleLogout} >
            <img src={"https://img.icons8.com/?size=100&id=83259&format=png&color=000000"} alt="logout-icon"/>
                <p>Log out</p>
            </li>
        </ul>
    </aside>
}// side bar for small screens

export function HamburgerMenu() {

    function openSideBar() {
        document.querySelector(".sidebar-container-sm").classList.add("open-nav")
        document.querySelector(".sidebar-container-sm").classList.remove("close-nav")
    }

    return (
      <span onClick={openSideBar}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block md:hidden h-6 w-6 mr-2.5 cursor-pointer stroke-current -mt-1" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
      </span>
    )
}

export function TransactionHistory() {
    return <main className="transaction-container">
       <article>
            <h2>Latest Transactions</h2>
            <p>
            <Link href={""}>» See All</Link>
          </p>
       </article>

       <section>

       </section>
    </main>
}

export function Statistics() {
    return <main className="statistics-container">
       <article>
            <h2>Statistics</h2>
            <p>
            <Link href={""}>» See All</Link>
          </p>
       </article>

       <section>
        
       </section>
    </main>
}


export function DepositModal() {
    return (
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click on ✕ button to close</p>
            </div>
        </dialog>
    )
}