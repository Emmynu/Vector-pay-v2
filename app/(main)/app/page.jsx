"use client"

import { DepositAmountModal, DepositModal, RequestMoneyAmountModal, RequestMoneyModal, Statistics, TransactionHistory } from "../../libs/component";
import { Poppins } from "next/font/google";
import walletIcon from "../../images/wallet-blue.png"
import transactionIcon from "../../images/transaction.png"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../firebase/firebase-client";
import { toast, Toaster } from "sonner";
import { getBalance, getTransactions, resetDailyAmountUsed } from "../../actions/payment";
import { findUser } from "../../actions/auth";


 const poppins = Poppins({
    subsets: ["latin"],
    weight: "800"
})


export default function DashBoard(){
    const [showBalance, setShowBalance] = useState(false)
    const [balance, setBalance] = useState(null)
    const [uid, setUid] = useState(false)
    const [name, setName] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [totalTransaction, setTotalTransaction] = useState(null)
    

    
    const handleBalanceToggle =(e)=>{
        setShowBalance(e.target.checked)
        if (!showBalance) {
            document.querySelector(".dashboard-balance").innerHTML = `₦${balance}`
        } else {
            document.querySelector(".dashboard-balance").innerHTML = `₦****`
        }
    }

    useEffect(()=>{
      try {
        onAuthStateChanged(auth, user=>{
            setName(user.displayName)
            setUid(user?.uid)
            setIsVerified(user.emailVerified)
        })
      } catch (error) {
        
      }
    },[])

    useEffect(()=>{
       async function getUser() {
            if (uid) {
                const res = await findUser(uid)
                setUser(res)
            }
       }
       getUser()
    },[uid])


    useEffect(()=>{
        async function updateDailyLimit() {
            const now = new Date()
            const resetTime = 24 * 60 * 60 * 1000 //24hours
            const msSinceLastReset =  now.getTime() - user?.lastLimitResetAt?.getTime()
            if (msSinceLastReset >= resetTime) {
                await resetDailyAmountUsed(uid)
            } 
        }
        updateDailyLimit()
    },[user])



    useEffect(()=>{
        async function balanceFunc() {
            setIsLoading(true)
            if (uid !== false) {
                const currentBalance = await getBalance(uid)
                const transaction = await getTransactions(uid)
                if (currentBalance?.error ) {
                    setIsLoading(false)
                    toast.error(currentBalance?.error)
                }else{
                    const formattedBalance = new Intl.NumberFormat("en-US").format(currentBalance?.balance)
                    setBalance(formattedBalance)
                    setTotalTransaction(transaction)
                    setIsLoading(false)
                }
                
            } 
            setIsLoading(false)
        }
        balanceFunc()
    },[uid])

   
    
    function handleToggleModal() {

        if (isVerified) {
            document.getElementById('my_modal_3').showModal()        
        } else {
            toast.info("Please verify your account")
            onAuthStateChanged(auth,user=>{
                sendEmailVerification(user)
            })
        }
    }
 

    return <main>
      
        <section className="my-10 mx-5 md:m-10 ">
            <h2 className={`wallet-label`}>Welcome {name}, </h2>
            
            <section className="wallet-container overflow-x-scroll">
                <section className="wallet-balance-container">
                    <div className="balance">
                        <Image src={walletIcon} alt="wallet-icon" className="wallet-icon"/>
                        <h2 className={poppins.className}>Wallet Balance:</h2>
                       <article className="flex">

                          <h1 className={isLoading  ? "loading loading-spinner amount loading-sm md:loading-md": "amount"}>{showBalance ? <span className="text-3xl">₦{balance ? `${ balance}` : "0.00 "}</span> : <span className="text-3xl">₦****</span>}</h1>
                         {!isLoading && <sub className=" mt-4 md:mt-5 ml-1">
                            <label className="swap">
                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox" checked={showBalance} onChange={handleBalanceToggle}/>

                            {/* show icon */}
                    
                            <svg
                                className="swap-on fill-transparent "
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24">
                            <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>

                            {/* hide  icon */}

                            
                        
                            <svg className="swap-off" fill="#fff" width="16" height="16" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M844.877 118.781L567.185 396.47c-16.708-7.997-35.426-12.474-55.185-12.474-70.694 0-128 57.309-128 128 0 19.763 4.478 38.477 12.474 55.185l-270.69 270.69 60.34 60.339 158.277-158.276C395.54 757.159 452.19 767.996 512 767.996c115.823 0 219.797-40.64 294.839-89.6 37.559-24.499 69.001-51.81 91.575-78.532 20.809-24.627 40.252-55.979 40.252-87.868 0-31.885-19.443-63.241-40.252-87.868-22.575-26.722-54.016-54.031-91.575-78.533a547.946 547.946 0 00-42.859-25.24l141.235-141.233-60.339-60.34zM700.322 384.012c21.666 9.997 41.749 21.215 59.895 33.052 31.932 20.832 56.725 42.857 73.015 62.134 8.145 9.643 13.589 17.92 16.819 24.371 2.483 4.958 3.089 7.684 3.238 8.427-.149.742-.755 3.469-3.238 8.427-3.23 6.451-8.674 14.729-16.819 24.371-16.29 19.277-41.084 41.301-73.015 62.135-63.936 41.711-151.966 75.733-248.218 75.733-34.155 0-67.277-4.284-98.651-11.678l43.466-43.465c16.708 8 35.426 12.476 55.185 12.476 70.694 0 128-57.306 128-128 0-19.759-4.48-38.477-12.476-55.185l72.798-72.799zM263.783 606.929c1.53.998 3.074 1.993 4.631 2.978l-61.579 61.581c-33.009-22.669-60.776-47.386-81.251-71.625-20.809-24.627-40.251-55.979-40.251-87.868 0-31.885 19.443-63.241 40.251-87.868 22.576-26.722 54.016-54.031 91.574-78.533 75.044-48.957 179.017-89.598 294.841-89.598 34.641 0 68.22 3.635 100.284 10.041l-76.006 76.009A413.57 413.57 0 00512 341.33c-96.253 0-184.28 34.025-248.217 75.735-31.932 20.832-56.727 42.857-73.015 62.134-8.148 9.643-13.589 17.92-16.821 24.371-2.484 4.958-3.091 7.684-3.236 8.427.145.742.752 3.469 3.236 8.427 3.232 6.451 8.674 14.729 16.821 24.371 16.287 19.277 41.083 41.301 73.015 62.135z"/></svg>
                         </label></sub>}
                       </article>
                        
                    </div>
                    <div className="transaction-count-container">
                        <Image src={transactionIcon} alt="wallet-icon"  className="wallet-icon"/>
                        <h2 className={poppins.className}>Total Transaction:</h2>
                        <h1 className="transaction-count text-4xl">{totalTransaction ? totalTransaction?.length: "0"} </h1>
                    </div>
                    <button onClick={handleToggleModal}>
                        <img src={"https://img.icons8.com/?size=100&id=121760&format=png&color=000000"} alt="wallet-icon" className="w-5 h-5 md:w-6 md:h-6"/>
                        <span>Add Funds</span>
                    </button>
                </section>

                <section className="account-limit-container">
                   <article className="account-limit-details">
                    <section>
                        <h2>Daily Limit:</h2>
                        <p>₦{new Intl.NumberFormat("en-US").format(user?.currentDailyAmountUser || "0" )} / ₦{new Intl.NumberFormat("en-US").format(user?.dailyTransactionLimit || 100000) }</p>
                    </section>
                    <section>
                        <h2>Account Level:</h2>
                        <p>Tier {user?.accountLevel || "1"} </p>
                    </section>
                   </article>
                   <div className="w-full h-2 overflow-hidden bg-gray-400 rounded-lg lg:h-3 mt-8"></div>
                   <h4 className="upgrade-link">[ <Link href={""}>Upgrade Account</Link> ]</h4>
                </section>
            </section>

            
        </section>

        <section className="transaction-details-container">
            <TransactionHistory transactions={totalTransaction?.slice(0, 3)} uid={uid}/>
            <Statistics uid={uid}/>
        </section>

        <DepositModal />
        <DepositAmountModal />
        <RequestMoneyModal uid={uid} accountNumber={user?.accountNumber}/>
        <Toaster richColors closeButton position="bottom-right" />
    </main>
}