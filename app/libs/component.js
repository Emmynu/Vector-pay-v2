"use client"

import { auth } from "../../firebase/firebase-client";
import logOut, { updateTransactionPin } from "../actions/main";
import Image from "next/image";
import Logo from "../images/logo.png"
import cancelIcon from "../images/cancel.png"
import Link from "next/link";
import "../styles/main.css"
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import useKoraPay from "./useKoraPay";
import { toast } from "sonner";
import { deposit, getNotificationCount, getTransactionSummary, saveNotification, saveTransaction } from "../actions/payment";
import { usePathname } from "next/navigation";
import { emailSchema, pinSchema } from "../../zod-schema";
import { findUser, findUserInFirebase } from "../actions/auth";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


export function DashBoardHeader() {
    const [user, setUser] = useState(null)
    const [notificationCount, setNotificationCount] = useState(null)

    useEffect(()=>{
        try {
          onAuthStateChanged(auth, user=>{
              setUser(user)
          })
        } catch (error) {
          
        }
      },[])
      
      useEffect(()=>{
            async function getNotifications() {
                const totalNotification =  await getNotificationCount(user?.uid)  
                    
                if (totalNotification?.error) {
                    toast.error(totalNotification.error)
                } else {
                    setNotificationCount(totalNotification)
                }   
            }
            getNotifications()
      },[user])

   
      
    function openSideBar() {
        document.querySelector(".sidebar-container-sm").classList.add("open-nav")
        document.querySelector(".sidebar-container-sm").classList.remove("close-nav")
    }

    return (
        <header className="dashboard-header">
        <section>
            <span onClick={openSideBar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block md:hidden h-6 w-6 mr-2.5 cursor-pointer stroke-current -mt-1" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
        </span>
            <h2>Dashboard</h2>
        </section>
        <section>
            <div className="balance-container">
                <h2 className="dashboard-balance">{"₦****"}</h2>
            </div>
            <img src={!user === null ? user?.photoURL : "https://th.bing.com/th/id/OIP.LkKOiugw5AFfDfUzuPAG4QHaI5?rs=1&pid=ImgDetMain" } className="w-7  lg:w-9 h-7 lg:h-9 rounded-[50%]" />
            {/* notification icon */}
            <Link href={"/app/notifications"}>
            <div className="indicator ml-1.5" >
                <span className="indicator-item badge badge-primary badge-xs font-medium">{notificationCount ? notificationCount : 0}</span>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                </button>
            </div></Link>
        </section>
    </header>

    )
}

export function TransactionPinSetUp() {
    const [uid, setUid] = useState(null)
    const [user, setUser] = useState(null)
    const [newPin, setNewPin] = useState({ newPin: "", confirmPin: ""})
    const [pinError, setPinError] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const transactionModalRef = useRef(null)
    const pathname = usePathname()

    

      useEffect(()=>{
        onAuthStateChanged(auth, user => setUid(user?.uid))
    },[])

    useEffect(()=>{
        async function getUser() {
            if (uid) {
                const result = await findUser(uid)  
                setUser(result)
            }
        }
        getUser()
    },[uid])

       function handlePinInput(e) {
         const { name, value} = e.target
         setNewPin((prev)=>({
             ...prev, [name]: value
         }))
     }
     
    
   async function handlePinSetup() {
        setIsProcessing(true)
        if (newPin?.newPin && newPin?.confirmPin) {
             const result = pinSchema.safeParse(newPin)
             if (result?.error) {
                result.error.errors.map(error=>{
                    setPinError(error?.message);
                  })
             } else {
                if (newPin?.newPin === newPin?.confirmPin) {
                     const res = await updateTransactionPin(uid, newPin?.newPin)
                     if (res?.error) {
                        setPinError(res?.error);
                        
                     } else {
                        if (transactionModalRef.current) {
                            transactionModalRef.current.close()
                            window.location = pathname
                        } 
                     }
                } else {
                    setPinError("Please ensure your PINs match");   
                }
             }
             
        } else {
            setPinError("Invalid Input")
        }

        setTimeout(() => {
            setIsProcessing(false)
        }, 2000);
    }



   return(
        <>
            {!user?.transactionPin && <section>
            <div role="alert" className="alert alert-horizontal">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Please set up a Transaction Pin before making transfers.</span>
                <div>
                    <button className="bg-main text-white px-3 text-sm py-1.5 rounded-[7px]" onClick={()=>document.querySelector("#transaction_modal").showModal()}>Set Up</button>
                </div>
            </div>
            <dialog id="transaction_modal" className="modal modal-bottom md:modal-middle" ref={transactionModalRef}>
                <div className="modal-box p-10">
                    <form method="dialog">
                        <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-1">✕</button>
                    </form>
                    <div className="modal-amount-container">
                        <article className="mb-7">
                            <h2 >Setup Transaction Pin</h2>
                        </article>
                        
                    <section className="">

                        <article className="mt-4 flex flex-col" style={{width: "100%"}}>
                            <h2 className="text-sm mb-1.5">New Pin: </h2>
                            <label className="pin-setup-label"  >
                                <svg className="h-[1em] opacity-50 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>

                                <input
                                    type="number"
                                    name="newPin"
                                    required
                                    className="ml-1 outline-none border-none mt-1"
                                    placeholder="New Pin"
                                    value={newPin.newPin}
                                    onChange={handlePinInput}
                                />
                            </label>
                                
                        </article>

                        <article className="mt-4 flex flex-col" style={{width: "100%"}}>
                            <h2 className="text-sm mb-1.5">Confirm Pin: </h2>
                            <label className="pin-setup-label"  >
                                <svg className="h-[1em] opacity-50 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>

                                <input
                                    type="number"
                                    name="confirmPin"
                                    required
                                    className="ml-1 outline-none border-none mt-1"
                                    placeholder="Confirm Pin"
                                    value={newPin.confirmPin}
                                    onChange={handlePinInput}
                                />
                            </label>
                            
                        </article>
                        
                            {pinError && <p  className="text-red-600 text-sm font-medium mt-1">{pinError}</p>}
                        <button  disabled={isProcessing} onClick={handlePinSetup}>{isProcessing ? <span className="loading loading-bars "></span> : <span>Continue</span>}</button>
                    </section>
                    </div>
                </div>
            </dialog> 
        </section>}
        </>
   )
}

export function SideBar() {
    const pathname = usePathname()
    
    async function handleLogout() {
        auth.signOut()
        await logOut()
    }

    function handleDeposit() {
        if (pathname === "/app") {
            document.querySelector("#my_modal_3").showModal()
        } else {
            window.location = "/app"
            document.querySelector("#my_modal_3").showModal()
        }
        
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
            <li onClick={handleDeposit}>
                <img src={"https://img.icons8.com/?size=100&id=121760&format=png&color=000000"} alt="wallet-icon"/>
                <span>Fund Wallet</span>
            </li>
            <li>
                <img src={"https://img.icons8.com/?size=100&id=16026&format=png&color=000000"} alt="atc-icon"/>
                <Link href={"/app/transfer"}>Transfer</Link>
            </li>
            <li>
                <img src={"https://img.icons8.com/?size=100&id=OZJM1EFnyQ1s&format=png&color=000000"} alt="withdraw-icon"/>
                <Link href={"/app/withdraw"}>Withdraw</Link>
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
                <Link href={"/app/settings"}>Account Settings</Link>
            </li>
            <li onClick={handleLogout} >
            <img src={"https://img.icons8.com/?size=100&id=83259&format=png&color=000000"} alt="logout-icon"/>
                <p>Log out</p>
            </li>
        </ul>
    </aside>
} // side bar for large screens

export function SideBarSm() {
    const pathname = usePathname()
    
    async function handleLogout() {
        auth.signOut()
        await logOut()
    }
    
    function closeSideBar() {
        document.querySelector(".sidebar-container-sm").classList.remove("open-nav")
        document.querySelector(".sidebar-container-sm").classList.add("close-nav")
    }

    
    function handleDeposit() {
        if (pathname === "/app") {
            document.querySelector("#my_modal_3").showModal()
        } else {
            window.location = "/app"
            document.querySelector("#my_modal_3").showModal()
        }
        
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
            <li onClick={handleDeposit}>
                <img src={"https://img.icons8.com/?size=100&id=121760&format=png&color=000000"} alt="wallet-icon"/>
                <span href={"*"}>Fund Wallet</span>
            </li>
            <li>
                <img src={"https://img.icons8.com/?size=100&id=16026&format=png&color=000000"} alt="atc-icon"/>
                <Link href={"/app/transfer"}>Transfer</Link>
            </li>
            <li>
                <img src={"https://img.icons8.com/?size=100&id=OZJM1EFnyQ1s&format=png&color=000000"} alt="withdraw-icon"/>
                <Link href={"/app/withdraw"}>Withdraw</Link>
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
                <Link href={"/app/settings"}>Account Settings</Link>
            </li>
            <li onClick={handleLogout} >
            <img src={"https://img.icons8.com/?size=100&id=83259&format=png&color=000000"} alt="logout-icon"/>
                <p>Log out</p>
            </li>
        </ul>
    </aside>
}// side bar for small screens


export function TransactionHistory({ transactions, uid }) {
   
    return <main className="transaction-container">
       <article>
            <h2>Latest Transactions</h2>
            <p>
            <Link href={"/app/transaction-history"}>» See All</Link>
          </p>
       </article>
       

       <section>
            {transactions?.length === 0 || !transactions ?
                <section className="transaction-empty">
                    <img src="https://th.bing.com/th/id/OIP.ZsjPQuS9XJsVY_JFsHvn9QHaHa?rs=1&pid=ImgDetMain" alt="" />
                    <h2>Transaction History empty</h2>
                </section>:
             <article className="transactions">
                {transactions?.map(transaction=>{
                    let icon;
                    let amount
                    let transactionType;
                    let color;
                    switch (transaction?.type) {
                        case "deposit":
                            icon ="https://img.icons8.com/?size=100&id=122074&format=png&color=000000"
                            amount = `+`
                            transactionType="Fund Wallet by ATM Card"
                            color = "#b1d5fc"
                            break;
                        case "withdraw":
                            icon = "https://img.icons8.com/?size=100&id=73812&format=png&color=000000",
                            amount= `-`,
                            transactionType = `Withdrawal to Bank Account`
                            color= "#ccccfa" 
                            break;
                        case "transfer":
                            if (transaction?.recipientId === uid) {
                                icon = "https://img.icons8.com/?size=100&id=14909&format=png&color=000000",
                                amount = `+`
                                transactionType= `Transfer From ${transaction?.name}`
                                color= "#a1fae4"
                            }
                            else{
                                icon = "https://img.icons8.com/?size=100&id=14902&format=png&color=000000",
                                amount = `-`
                                transactionType= `Transfer To ${transaction?.recipientName}`
                                color= "#9bbeff"
                            }
                    
                        default:
                            break;
                    }
                    return <section>
                    <div>
                        <img src={icon} alt={`${transaction?.type}-icon`} className={`mr-4 p-3 rounded-full w-11 h-11`} style={{backgroundColor: color}}/>
                        <section>
                            <h2>{transactionType}</h2>
                            <p>{new Intl.DateTimeFormat("en-US", {
                                month: "long",
                                day:"numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            }).format(transaction?.createdAt)}<span className={transaction?.status === "success"?"transaction-status text-green-600 ": transaction?.status === "failed" ? "transaction-status text-red-600 ": "transaction-status text-yellow-600 "}> · {transaction?.status?.charAt(0)?.toUpperCase() + transaction?.status?.slice(1)}</span></p>
                        </section>
                    </div>
                    <div>
                        <p className="transaction-amount">{amount}₦{Intl.NumberFormat("en-US").format(transaction?.amount)}</p>
                    </div>
                </section>
                })}    
            </article>}
       </section>
    </main>
}

export function Statistics({ uid }) {
    const [data, setData] = useState([])

    useEffect(()=>{
        async function getSummary() {
            if (uid) {
                const res = await getTransactionSummary(uid)
                if (res?.error) {
                    
                } else {
                    setData(res)
                }
            
            }
        }
        getSummary()
    },[uid])

    

    return <main className="statistics-container">
       <article>
            <h2>Statistics</h2>
            <p>
            <Link href={"/app/transaction-history"}>» See All</Link>
          </p>
       </article>

       {data.length > 0 && <section className="w-full h-[290px] mt-3 text-sm font-medium">
            <ResponsiveContainer >
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%"   outerRadius={106} dataKey="value" nameKey="name" label={({ name, percent })=> `${name} ${(percent * 100).toFixed(0)}%`} >

                        <Cell  fill="#03457c" stroke="#000"/>
                        <Cell  fill="#ffbb28" stroke="#000"/>
                        <Cell  fill="#cbe7f1" stroke="#000"/>
                    </Pie>
                 
                    <Tooltip isAnimationActive animationDuration={2000}   formatter={(name, value, props)=>{
                        const amount = new Intl.NumberFormat("en-NG",{
                            style: "currency",
                            currency:"NGN",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(name)
                        return [amount, props.payload.name]
                    }}/>
                    <Legend iconType="square" layout="vertical" align="right"content={({ payload })=>{
                        return (
                            <ul >{payload.map((entry, index)=>{
                                const { value, payload: dataPayload} = entry
                                const transactionType = dataPayload?.name
                                const color = dataPayload?.fill
                                let icon;
        

                                switch (transactionType) {
                                    case "deposit":
                                        icon ="https://img.icons8.com/?size=100&id=122074&format=png&color=000000"
                                        break;
                                    case "withdraw":
                                        icon = "https://img.icons8.com/?size=100&id=73812&format=png&color=000000"
                                        break;
                                    case "transfer":
                                        icon = "https://img.icons8.com/?size=100&id=14902&format=png&color=000000"
                                    default:
                                        break;
                                }


                                return (
                                    <li style={{ padding: "3px", borderRadius: "5px", marginTop: "2px"}} className="flex items-center border-b ">
                                        <img src={icon} className={` w-6 rounded-full h-6 p-1.5 mr-1`} style={{background: color}}/>
                                        <span>{`${transactionType.charAt(0).toUpperCase()}${transactionType.slice(1,)}`}</span>
                                    </li>
                                )
                            })}</ul>
                                    )
                                }} />
                </PieChart>
            </ResponsiveContainer>
       </section>}
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
                        <div onClick={()=>{
                            document.getElementById('request_money_modal').showModal()
                            closeModal()
                        }}>
                            <h2>Request Money</h2>
                            <p>Request money from other users.</p>
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
    const [currentUser, setcurrentUser] = useState({uid: "", name: "", email: "", isVerified: null})
    const { koraPayInstance } = useKoraPay()
    // const [isProcessed, setIsProcessed] = useState(false)
    let isProcessed = false
    

    useEffect(()=>{
        onAuthStateChanged(auth,user=>setcurrentUser({uid:user?.uid ,name:user?.displayName, email: user?.email, isVerified:user?.emailVerified }))
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


    function handleDeposit() {

      if (amount >= 100 && amount < 500000) {
        try {
            closeModal()
            const reference =  new Date().getTime().toString()
 
            koraPayInstance.initialize({
                key: process.env.NEXT_PUBLIC_KORAPAY_PUBLIC_KEY ,
                reference,
                amount: parseInt(amount), 
                currency: "NGN",
                customer: {
                name:currentUser?.name,
                email:currentUser?.email,
                },
                onClose: async()=>{
                    const result = await saveTransaction(currentUser?.uid, parseInt(amount), "deposit", "cancelled", reference, null, null, null)
                    if (result?.error) {
                        toast.error(res?.error)
                    } else {
                        toast.error("Transaction cancelled. You closed the payment window")
                        window.location = "/app"
                    }
                },
                onFailed:async()=>{
                    const result = await saveTransaction(currentUser?.uid,parseInt(amount), "deposit", "failed", reference, null, null, null)
                    if (result?.error) {
                        toast.error(res?.error)
                    } else {
                        toast.error("Payment failed. Please try again!")
                        window.location = "/app"
                    }
                },
                onSuccess: async function () {
                    if (!isProcessed) {
                       isProcessed = true 
                        const res = await deposit(currentUser?.uid, parseInt(amount))
                        if (res?.error) {
                            toast.error(res?.error)
                        }
                        else{
                            const result = await saveTransaction(currentUser?.uid,parseInt(amount), "deposit", "success", reference, null, null, null)
                            if (result?.error) {
                                toast.error(res?.error)
                            } else {
                                window.location = "/app"
                            }
                        }
                        
                    }
            
                },
        });

            
        } catch (error) {
            toast.error(error?.message);
        }
      }else{
        toast.error("Deposit range is ₦100-₦500,000")
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
                            className="input outline-none validator"
                            value={amount}
                            min={100}
                            max={500000}
                            onChange={(e)=>setAmount(e.target.value)}
                            required
                            placeholder="Enter Amount"
                            title="Minimum deposit is ₦100"
                            />
                            <p className="validator-hint">Deposit range is ₦100-₦500,000</p>
                            <button onClick={handleDeposit} disabled={(amount <= 0 && amount >=500000)}>Continue</button>
                   </section>
                </div>
            </div>
        </dialog>
    )
}


export function RequestMoneyModal({ uid, accountNumber }) {
    const modalRef = useRef(null)
    const [giver, setGiver] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        const formData = Object.fromEntries(new FormData(e.currentTarget))
        const result = emailSchema.safeParse(formData)
        if (result?.error) {
            result.error?.errors?.map(error=>{
                setError(error?.message)
            })
        } else {
            const { user } = await findUserInFirebase(formData?.email)
            if (user?.uid === uid) {
                setError("Self Requests is not allowed");
                
            } else{
                setGiver(user)
            }
        }

        setTimeout(() => {
            setIsLoading(false)
            setError("")
        }, 2000);
        
    }


    async function handleRequestMoney(e) {
        e.preventDefault()
        setIsLoading(true)
        const { amount } = Object.fromEntries(new FormData(e.currentTarget))
        if (amount) {
            if (amount >= 50 && amount <= 100000) {
                // confirm request
                const result = await saveNotification(uid, parseInt(amount), "request", accountNumber, giver?.uid, giver?.displayName)
                if (result?.error) {
                    setError(result?.error)
                } else {
                    modalRef.current.close()
                    toast.success(`${amount} successfully requested from ${giver?.displayName}`)
                   setTimeout(() => {
                     window.location = "/app"
                   }, 1200);
                }
            } else {
                setError("Request range is ₦50-₦100,000")
            }
        } else {
            setError("Invalid Input")
        }
      
        
        setTimeout(() => {
            setIsLoading(false)
            setError("")
        }, 2000);
        
    }

    return (
        <>
        <dialog id="request_money_modal" className="modal modal-bottom md:modal-middle" ref={modalRef}>
        <div className="modal-box">
            <button  className="modal-back-btn" onClick={()=>{
                modalRef?.current?.close()
                document.getElementById("my_modal_3").showModal()
            }}> <img src="https://img.icons8.com/?size=100&id=79026&format=png&color=000000" alt="back-icon" className="w-3 mr-1 h-3"/> <span>Back</span></button>
            <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            {giver === null ? <div className="modal-amount-container">
               <article >
                <h2>Request Funds</h2>
                <p>Easily ask for payments from friends, family, or clients. </p>
               </article>
                
             <div className="mt-5">
                <label className="validator" id="email"> 
                    <h2 className="mb-1 font-medium text-[14px]" style={{fontFamily: "inherit"}}>Email to Request From:</h2>
                </label>
                <form className="request-content-container " onSubmit={handleSubmit}>
                    <input type="email" placeholder="mail@site.com" required className="" name="email"/>
                    {error && <h2 className="text-xs md:text-sm font-medium text-red-600 mt-2">{error}</h2>}
                    <button disabled={isLoading}>{!isLoading ? "Continue": <span className={isLoading ? "loading loading-bars loading-sm": null}></span> }</button>
                </form>
             </div>
            </div>: 
            <div className="modal-amount-container">
                <article >
                    <h2>Request money from {giver?.displayName}</h2>
                    <p>Easily ask for payments from friends, family, or clients. </p>
               </article>
               <div className="mt-5">
                    <label className="validator" id="amount"> 
                        <h2 className="mb-1 font-medium text-[14px]" style={{fontFamily: "inherit"}}>Amount:</h2>
                    </label>
                    <form className="request-content-container -mt-0.5" onSubmit={handleRequestMoney}>
                        <input type="number" placeholder="Enter Amount" required className="" name="amount"/>
                        {error && <h2 className="text-xs md:text-sm font-medium text-red-600 mt-2">{error}</h2>}

                        <button disabled={isLoading}>{!isLoading ? "Proceed": <span className={isLoading ? "loading loading-bars loading-sm": null}></span> }</button>
                    </form>
             </div>
                </div>}
        </div>
        </dialog>
    </>
    )
}




export function TransactionDetail({ transaction, uid }) {

    let transactionType;

    switch (transaction?.type) {
        case "deposit":
            transactionType="Fund Wallet by ATM Card"
            break;
        case "withdraw":
            transactionType = `Withdrawal to Bank Account`
            break;
        case "transfer":
            if (transaction?.recipientId === uid) {
                transactionType= `Transfer From ${transaction?.name}`
            }
            else{
                transactionType= `Transfer To ${transaction?.recipientName}`
            }
    
        default:
            break;
    }
    
    return <>
        <dialog id="transaction-detail" className="modal ">
        <div className="modal-box p-10">
            <form method="dialog">
                <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div className="px-5 py-7">
                <article className="transaction-detail-container">
                    <h2>Transaction Details</h2>
                </article>
                <section className="detail-container">
                    <h2>Amount</h2>
                    <p className="text-slate-600">₦{Intl.NumberFormat("en-US").format(transaction?.amount)}</p>

                    <h2>Status</h2>
                    <p className={transaction?.status === "success"?"transaction-status text-green-600 ": transaction?.status === "failed" ? "transaction-status text-red-600 ": "transaction-status text-yellow-600 "}>{`${transaction?.status?.charAt(0)?.toUpperCase()}${transaction?.status?.slice(1,)}`}</p>
                    
                    <h2>Date</h2>
                    <p className="text-slate-600">{new Intl.DateTimeFormat("en-US", {
                         month: "long",
                         day:"numeric",
                         year: "numeric",
                         hour: "2-digit",
                         minute: "2-digit"
                    }).format(transaction?.createdAt) }</p>
                    
                    <h2>Reference</h2>
                    <p className="text-slate-600">{transaction?.reference}</p>
                    
                    <h2>Type</h2>
                    <p className="text-slate-600">{transactionType}</p>
                </section>
            </div>
        </div>
        </dialog>
    
    </>
}