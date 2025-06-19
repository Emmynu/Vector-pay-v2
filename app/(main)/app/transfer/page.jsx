"use client"

import { useEffect, useRef, useState } from "react";
import { handleAccountNumber } from "../../../actions/main";
import "../../../styles/transfer.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase-client";
import { toast, Toaster } from "sonner";
import OtpInput from "react-otp-input";
import { findUser } from "../../../actions/auth";
import { getBeneficiary, saveBeneficiary, saveTransaction, updateBalance, updateBalanceDecrement, updateDailyAmountUsed } from "../../../actions/payment";
import Beneficiaries from "../../../libs/beneficiaries";

function TransferPage() {
    const [uid, setUid] = useState(null)
    const [amount, setAmount] = useState("")
    const [sender, setSender] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [recipient, setRecipient] = useState(null)
    const [beneficiary, setBeneficiary] = useState([])
    const [pin, setPin] = useState(null)
    const [error, setError] = useState("")
    const [transactionError, setTransactionError] = useState("")
    const transferModalRef = useRef(null)
    const pinModalRef = useRef(null)

    useEffect(()=>{
        onAuthStateChanged(auth, user => setUid(user?.uid))
    },[])

    useEffect(()=>{
        async function getUser() {
            if (uid) {
                const user = await findUser(uid)  
                const res = await getBeneficiary(uid, 4)
                setSender(user)
                setBeneficiary(res)
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

    

    async function handleBeneficiary() {
        const isABeneficiary = beneficiary.find(user=> user?.beneficiaryId === recipient?.uid)
        if (!isABeneficiary) {
                await saveBeneficiary(uid, recipient?.uid, `${recipient?.firstName} ${recipient?.lastName}`, recipient?.accountNumber)
                toast.success(`${recipient?.firstName} added to beneficiaries `)

                setTimeout(() => {
                    window.location = "/app/transfer"
                }, 500);
        } else {
            toast.error(`${recipient?.firstName} is already a beneficiary`)   
        }
        
    }

  

    async function transferFunds() {
        setIsLoading(true)
        if ((sender?.currentDailyAmountUser + parseInt(amount)) <= sender?.dailyTransactionLimit) {
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
                        const response  = await updateDailyAmountUsed(sender?.uid, parseInt(amount))
                        if (!response?.error) {

                            const resp = await saveTransaction(sender?.uid,parseInt(amount), "transfer", "success", reference, recipient?.uid, `${recipient?.firstName} ${recipient?.lastName}`, recipient?.accountNumber, `${sender?.firstName} ${sender.lastName}`)

                            if (resp?.error) {
                                setTransactionError(resp?.error)
                            } else {
                                pinModalRef.current.close()
                                toast.success(`Transaction Successful`)
                                window.location = "/app"
                            }
                        } else {
                            setTransactionError(response?.error)
                        }
                        
                    }   
                }
                
                
            } else {
                setTransactionError("Incorrect Transaction PIN")
            }
        } else {
            setTransactionError("Daily Transaction Limit Reached")
        }
        setTimeout(() => {
            setIsLoading(false)
            setTransactionError("")
        }, 1500);
    }

    return ( 
        <main >

           <section className="transfer-container">
             <h2 className="transfer-label">
                Transfer To VectorPay Account
              </h2>

             <section className="lg:w-1/2">
                <article className=" bg-gray-100 p-8  border-t-main border-t-[5px] rounded-md border-gray-200 border-2">
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
                            <input
                            type="number"
                            id="accountNumber"
                            name="accountNumber"
                            className="input"
                            required
                            disabled={!sender?.transactionPin}
                            placeholder="VectorPay account number"
                            />
                        </form>

                { recipient !== null  && <section className="mt-7 flex rounded-[4px] justify-between items-center bg-white p-4 ">
                            <div className="flex items-center"> 
                                <img src="https://th.bing.com/th/id/OIP.LkKOiugw5AFfDfUzuPAG4QHaI5?rs=1&pid=ImgDetMain" alt="" className="w-7 h-7 mx-1.5 rounded-full"/>
                                <div className="ml-1 outline-none border-none">
                                    
                                    <h2 className="font-medium text-sm md:text-base">{`${recipient?.firstName} ${recipient?.lastName}`}</h2>
                                    <p className=" text-[11px] text-slate-500 italic -mb-1.5">{recipient?.accountNumber}</p>
                                    <button className="text-[13px] text-main font-medium" onClick={handleBeneficiary}>save beneficiary</button>
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
                                            title="Transfer range is ₦50-₦500,000"
                                            />
                                            <p className="validator-hint">Transfer range is ₦50-₦500,000</p>
                                            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
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
                                        {transactionError && <p className="text-xs text-red-600 font-medium">{transactionError}</p>}
                                        <button disabled={isLoading || !pin} onClick={transferFunds}>{isLoading ? <span className="loading loading-bars"></span>:<span >Proceed</span>}</button>
                                </section>
                                </div>
                            </div>
                        </dialog>
                </article>
                <section>
                    <Beneficiaries uid={uid} beneficiary={beneficiary}/>
                </section>
             </section>
                <Toaster richColors closeButton position="bottom-right" className="z-[4000]"/>
           </section>
        </main>
     );
}

export default TransferPage;