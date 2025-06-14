"use client"

import { useEffect, useRef, useState } from "react";
import { handleAccountNumber, updateTransactionPin } from "../../../actions/main";
import "../../../styles/transfer.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase-client";
import { toast, Toaster } from "sonner";
import OtpInput from "react-otp-input";
import { findUser } from "../../../actions/auth";
import Link from "next/link";
import { pinSchema } from "../../../../zod-schema";
import { saveTransaction, updateBalance, updateBalanceDecrement } from "../../../actions/payment";

function TransferPage() {
    const [uid, setUid] = useState(null)
    const [amount, setAmount] = useState("")
    const [sender, setSender] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [recipient, setRecipient] = useState(null)
    const [pin, setPin] = useState(null)
    const [error, setError] = useState("")
    const [pinError, setPinError] = useState("")
    const [transactionError, setTransactionError] = useState("")
    const [newPin, setNewPin] = useState({ newPin: "", confirmPin: ""})
    const transferModalRef = useRef(null)
    const pinModalRef = useRef(null)
    const transactionModalRef =useRef(null)

    useEffect(()=>{
        onAuthStateChanged(auth, user => setUid(user?.uid))
    },[])

    useEffect(()=>{
        async function getUser() {
            if (uid) {
                const user = await findUser(uid)  
                setSender(user)
            }
        }
        getUser()
    },[uid])

    function handleTransfer() {
     
        if (amount >= 50 && amount < 500000) {
            if (sender?.balance >= amount) {
                if (transferModalRef.current) {
                    transferModalRef.current.close()
                    document.getElementById("pin-modal").showModal()
                }
            } else {
                setError("Insufficient Funds, Please top up to complete this transaction. ")
            }
           
        } else {
            setError("Transfer range is ₦50-₦500,000 ")
        }


        setTimeout(() => {
            setError("")
        }, 2000);
    }


    function handleModalToggle() {
        if (pinModalRef.current) {
            pinModalRef.current.close()
            document.getElementById("transfer-modal").showModal()
        }
    }
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
                            window.location = "/app/transfer"
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

    async function transferFunds() {
        setIsLoading(true)
        if (pin === sender?.transactionPin) {
            const reference =  new Date().getTime().toString()
            // decrease the sender balance
            const result = await updateBalanceDecrement(sender?.uid, parseInt(amount))
            // // increase the recipient balance            
            if (result?.error) {
                setTransactionError(result?.error)
            } else {
                const res = await updateBalance(recipient?.uid, parseInt(amount))  
                // save the transaction 
                if (res?.error) {
                    setTransactionError(res?.error)
                } else {
                    const resp = await saveTransaction(sender?.uid,parseInt(amount), "transfer", "success", reference, recipient?.uid, `${recipient?.firstName} ${recipient?.lastName}`)
                    if (resp?.error) {
                        setTransactionError(resp?.error)
                    } else {
                        // save beneficiaries
                        window.location="/app"
                    }
                }   
            }
            
            
        } else {
            setTransactionError("Incorrect Transaction PIN")
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 2000);
    }

    return ( 
        <main >
           {!sender?.transactionPin && 
           <section>
                <div role="alert" className="alert alert-horizontal">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Please set up a Transaction Pin before making transfers.</span>
                    <div>
                        <button className="bg-main text-white px-3 text-sm py-1.5 rounded-[7px]" onClick={()=>document.querySelector("#transaction_modal").showModal()}>Accept</button>
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
                                <label className="transfer-pin-setup-label"  >
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
                                        className="ml-1 outline-none border-none"
                                        placeholder="New Pin"
                                        value={newPin.newPin}
                                        onChange={handlePinInput}
                                    />
                                </label>
                                    
                            </article>

                            <article className="mt-4 flex flex-col" style={{width: "100%"}}>
                                <h2 className="text-sm mb-1.5">Confirm Pin: </h2>
                                <label className="transfer-pin-setup-label"  >
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
                                        className="ml-1 outline-none border-none"
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

           <section className="transfer-container">
             <h2 className="transfer-label">
                Transfer To VectorPay Account
              </h2>

             <section className="lg:w-1/2">
                <article className="bg-blue-100 p-8 md:p-9 rounded-md mt-8 shadow-md ">
                        <form  action={async (formData)=>{
                            if (sender) {
                                const result = await handleAccountNumber(formData);
                                if (result?.error) {
                                    toast.error(result?.error)
                                } else {
                                if (result === null) {
                                        toast.error("User not Found")
                                        setRecipient(null)
                                } else {
                                    if (result?.uid === sender?.uid) {
                                            toast.error("Self-Transfer is not allowed")
                                    } else {
                                        // show the user 
                                        setRecipient(result)
                                    }
                                }
                                }
                            }
                            
                            
                        }} className="transfer-form-container " >
                            <label htmlFor="accountNumber">Recipient Account</label>
                            <input type="number" placeholder="VectorPay account number" name="accountNumber" id="accountNumber" className="input" disabled={!sender?.transactionPin}/>
                        </form>

                { recipient !== null  && <section className="mt-7 flex rounded-[4px] justify-between items-center bg-white p-4 ">
                            <div className="flex items-center"> 
                                <img src="https://th.bing.com/th/id/OIP.LkKOiugw5AFfDfUzuPAG4QHaI5?rs=1&pid=ImgDetMain" alt="" className="w-7 h-7 mx-1.5 rounded-full"/>
                                <div className="ml-1 outline-none border-none">
                                    <h2 className="font-medium text-sm md:text-base" >{`${recipient?.firstName} ${recipient?.lastName}`}</h2>
                                    <p className=" text-xs text-slate-500 italic">{recipient?.accountNumber}</p>
                                </div>
                            </div>
                            <button className="transfer-btn" onClick={()=>document.querySelector("#transfer-modal").showModal()}>Proceed</button>
                        </section>}

                        <dialog id="transfer-modal" className="modal modal-bottom md:modal-middle" ref={transferModalRef}>
                            <div className="modal-box p-10">
                                <form method="dialog">
                                    <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-1">✕</button>
                                </form>
                                <div className="modal-amount-container">
                                    <article>
                                        <h2 >Transfer Amount for {recipient?.firstName}</h2>
                                        <p >Internal VectorPay transfer</p>
                                    </article>
                                    
                                <section>
                                        <label htmlFor="amount">Amount:</label>
                                        
                                        <input
                                        
                                            type="number"
                                            name="amount"
                                            className="input outline-none validator"
                                            value={amount}
                                            min={50}
                                            max={500000}
                                            onChange={(e)=>setAmount(e.target.value)}
                                            required
                                            placeholder="Enter Amount"
                                            title="Minimum deposit is ₦100"
                                            />
                                            <p className="validator-hint">Transfer range is ₦50-₦500,000</p>
                                            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                                            <button disabled={(amount <= 0 && amount >=500000)} onClick={handleTransfer}>Continue</button>
                                </section>
                                </div>
                            </div>
                        </dialog>

                        {/* pin modal */}
                        <dialog id="pin-modal" className="modal modal-bottom md:modal-middle" ref={pinModalRef}>
                            <div className="modal-box p-10">
                            <button onClick={handleModalToggle} className="modal-back-btn"> <img src="https://img.icons8.com/?size=100&id=79026&format=png&color=000000" alt="back-icon" className="w-3 mr-1 h-3"/> <span>Back</span></button>
                                <form method="dialog">
                                    <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-1">✕</button>
                                </form>
                                <div className="modal-amount-container">
                                    <article>
                                        <h2 >Enter Transaction Pin</h2>
                                        <p >Internal VectorPay transfer</p>
                                    </article>
                                    
                                <section>
                                    <OtpInput
                                        value={pin}
                                        onChange={setPin}
                                        numInputs={4}
                                        renderSeparator={<span> </span>}
                                        renderInput={(props) => <input {...props} />}
                                        inputStyle={{border: "1px solid gray", padding: "15px", width:"40px", height: "45px" , marginLeft:"4px",borderRadius: "7px", fontSize: "14px"} }
                                        
                                        />
                                        {transactionError && <p className="text-sm text-red-600 font-medium">{transactionError}</p>}
                                        <button disabled={isLoading || !pin} onClick={transferFunds}>{isLoading ? <span className="loading loading-bars"></span>:<span >Proceed</span>}</button>
                                </section>
                                </div>
                            </div>
                        </dialog>
                </article>
                <section>
                    <article className="beneficiary-nav">
                    <h2>Beneficiaries</h2>
                    <p>
                     <Link href={""}>» See All</Link>
                    </p>
                    </article>
                    {/* <section></section> */}
                </section>
             </section>
                <Toaster richColors closeButton position="bottom-right" className="z-[4000]"/>
           </section>
        </main>
     );
}

export default TransferPage;