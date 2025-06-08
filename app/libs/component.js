"use client"

import { auth } from "../../firebase/firebase-client";
import logOut from "../actions/main";
import Image from "next/image";
import Logo from "../images/logo.png"
import cancelIcon from "../images/cancel.png"
import Link from "next/link";
import "../styles/main.css"
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";


 

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

    const modalRef = useRef(null)

   const closeModal = ()=>{
    if (modalRef.current) {
        modalRef.current.close()
    }
   }

   function handleModalToggle() {
        closeModal()
        document.getElementById("my_modal_4").showModal()
   }

    return (
        <dialog id="my_modal_3" className="modal modal-bottom md:modal-middle" ref={modalRef}>
            <div className="modal-box p-10">
                <form method="dialog">
                    <button className="btn btn-md btn-circle border-none btn-ghost absolute right-2 top-1">✕</button>
                </form>
                <div className="modal-content-container">
                   <article>
                    <h2 >Add Funds</h2>
                    <p >How do you want to topup?</p>
                   </article>

                   <section className="modal-content ">
                        <div>
                            <h2>Request Money</h2>
                            <p>Request money from beneficiaries.</p>
                        </div>
                        <div onClick={handleModalToggle}>
                            <h2>ATM Card</h2>
                            <p>Fund your wallet using your ATM Card.</p>
                        </div>
                   </section>
                </div>
            </div>
        </dialog>
    )
}

export function DepositAmountModal() {
    const modalRef = useRef(null)
    const [amount, setAmount] = useState(null)
    const [currentUser, setcurrentUser] = useState({name: "", email: "", isVerified: null})


    useEffect(()=>{
        onAuthStateChanged(auth,user=>setcurrentUser({name:user?.displayName, email: user?.email, isVerified:user?.emailVerified }))
    },[])

    const closeModal = ()=>{
        if (modalRef.current) {
            modalRef.current.close()
        }
       }
    
       function handleModalToggle() {
            closeModal()
            document.getElementById("my_modal_3").showModal()
       }

    const config = {
        reference: new Date().getTime().toString(),
        email:currentUser?.email,
        amount: amount * 100,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        metadata: {
          name: currentUser?.name,
        },
    }


//     const initializePayment = usePaystackPayment(config)

//    async function onSuccess() {
//        await updateBalance(amount)
//     }


    function handleDeposit() {
        try {
            // initializePayment({onSuccess})
            closeModal()
        } catch (error) {
            console.log(error?.message);
            
        }
    }

    return (
        <dialog id="my_modal_4" className="modal modal-bottom md:modal-middle" ref={modalRef}>
            <div className="modal-box p-10">
                <button onClick={handleModalToggle} className="modal-back-btn"> <img src="https://img.icons8.com/?size=100&id=79026&format=png&color=000000" alt="back-icon" className="w-3 mr-1 h-3"/> <span>Back</span></button>
                <form method="dialog">
                    <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-1">✕</button>
                </form>
                <div className="modal-amount-container">
                    <article>
                        <h2 >ATM Card</h2>
                        <p >Add funds with ATM Card</p>
                    </article>
                    
                   <section>
                        <label htmlFor="amount">Amount:</label>
                            
                        <input
                        
                            type="number"
                            name="amount"
                            className="input input-bordered validator"
                            value={amount}
                            onChange={(e)=>setAmount(e.target.value)}
                            required
                            placeholder="Enter Amount"
                            title="Must be between be a number"
                            />
                            <button onClick={handleDeposit} disabled={amount <= 0}>Continue</button>
                   </section>
                </div>
            </div>
        </dialog>
    )
}