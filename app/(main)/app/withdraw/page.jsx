"use client"
import { findUser } from "../../../actions/auth";
import { auth } from "../../../../firebase/firebase-client";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import { toast, Toaster } from "sonner";
import "../../../styles/withdraw.css"
import { saveTransaction, updateBalanceDecrement, updateDailyAmountUsed } from "../../../actions/payment";

function Withdraw() {
    const [banks, setBanks] = useState([])
    const [accountNumber, setAccountNumber] = useState("")
    const [pin, setPin] = useState("")
    const [amount, setAmount] = useState("")
    const [uid, setUid] = useState(null)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [transactionError, setTransactionError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [accountName, setAccountName] = useState("")
    const [selectedBank, setSelectedBank] = useState("")
    const transferModalRef = useRef(null)
    const pinModalRef = useRef(null)

    useEffect(()=>{
        async function getBanks() {
          if (localStorage.getItem("banks")) {
                setBanks(JSON.parse(localStorage.getItem("banks")))
          } else {
            const res = await fetch("https://api.paystack.co/bank", {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": process.env.NEXT_PUBLIC_PAYSTACK_KEY,
                }
            }).then(res=>res.json()).catch(err=>console.error(err?.message))  
           setBanks(res.data)
           res?.data.length > 0 && localStorage.setItem("banks", JSON.stringify(res?.data))
          }
            
        }
       getBanks()
    },[])

    useEffect(()=>{
        onAuthStateChanged(auth, user=>setUid(user?.uid))
    },[])

    useEffect(()=>{
        async function getUser() {
            const result = await findUser(uid)
            setUser(result)
        }
        getUser()
    },[uid])

 

 

    async function verifyBankDetails() {
        setIsProcessing(true)
        if (selectedBank > 0) {
            if (accountNumber.length === 10) {
                const result =  await fetch("https://api.korapay.com/merchant/api/v1/misc/banks/resolve", {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": process.env.NEXT_PUBLIC_KORAPAY_SECRET_KEY
                    },
                    body:JSON.stringify({
                        "bank": selectedBank,
                        "account": accountNumber,
                        "currency": "NGN",
                    })
                })
                .then(res=>res.json())
                .catch(err=>toast.error(err?.message))
                .finally(()=>{
                    setAccountNumber("")
                    setSelectedBank("")
                })

                console.log( result);
                
                if (result?.status) {
                    setAccountName(result?.data?.account_name)
                    document.querySelector("#transfer-modal").showModal()
                } else {
                    toast.error(result?.message)
                }
            } else {
                toast.error("Please provide a valid 10 digit account number")
            }
        } else {
            toast.error("Please select a bank")
        }
        
     setTimeout(() => {
        setIsProcessing(false)
     }, 1000);
    }

    function confirmDetails() {
      if(amount >= 50 && amount <= 500000){
        if (amount <= user?.balance) {
            //open pin modal
            document.querySelector("#pin-modal").showModal()
            transferModalRef.current.close()
        } else{
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
            document.querySelector("#transfer-modal").showModal()
        }
    }

    async function handleWithdraw() {
        setIsLoading(true)
        if ((user?.currentDailyAmountUser + parseInt(amount)) < user?.dailyTransactionLimit) {
            if (pin === user?.transactionPin) {
                try {
                    const reference = new Date().getTime().toString()
                    // decrease the balaANCE
                    await updateBalanceDecrement(user?.uid, parseInt(amount))
                    // add the amount to the dailyAmountUsed
                    await updateDailyAmountUsed(user?.uid, parseInt(amount))
                    // save the transaction
                    await saveTransaction(user?.uid, parseInt(amount), "withdraw", "success", reference)
                    // close the modal
                    pinModalRef.current.close()
                    // show success message
                    toast.success("Withdrawal Complete!")
                } catch (error) {
                    setTransactionError(error?.message)
                }
                finally{
                    setTimeout(() => {
                        window.location = "/app"
                    }, 2000);
                }
            } else {
                // show error message
                setTransactionError("Incorrect Transaction PIN")
            }
        } else {
            setTransactionError("Daily Transaction Limit Reached")
        }
        
        setTimeout(() => {
            setTransactionError("")
            setIsLoading(false)
            
        }, 1500);
    }
    
    return ( 
     <>
        <div role="alert" className="alert alert-horizontal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info h-6 w-6 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Withdrawals to Microfinance Banks are Temporarily Unavailable.</span>
        </div>
        <main className="withdraw-container">
           <section>
                <h2 className="withdraw-label">Withdraw Funds</h2>
           </section>

          <section className="withdraw-content-container">
            <label htmlFor="">Select Bank:</label>
               <select value={selectedBank} onChange={(e)=>setSelectedBank(e.target.value)}> 
                {banks.map((bank)=>{
                        return (
                            <option value={bank.code}>{bank?.name}</option>
                        )
                    })}
               </select>
               
               <label htmlFor="accountNumber" className="mt-4">Account Number: </label>
               <input
                type="number"
                id="accountNumber"
                className="input validator"
                required
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e)=>setAccountNumber(e.target.value)}
                disabled={!banks}
                title="Must not be less than 10 in length"
                />
                {/* <p className="validator-hint">Must be between be 1 to 10</p> */}
                <button onClick={verifyBankDetails} disabled={isProcessing || user === null || !user?.transactionPin }>{isProcessing ? <span className="loading loading-bars loading-sm"></span>: "Continue"}</button>
           </section>

           <dialog id="transfer-modal" className="modal modal-bottom md:modal-middle" ref={transferModalRef}>
                <div className="modal-box p-10">
                    <form method="dialog">
                        <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-1">✕</button>
                    </form>
                    <div className="modal-amount-container">
                        <article>
                            <h2 >Withdraw Amount for {accountName}</h2>
                        </article>
                    
                    <section className="mt-3">
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
                        title="Withdrawal range is ₦50-₦500,000"
                        />
                        <p className="validator-hint ">Withdrawal range is ₦50-₦500,000</p>
                        {error && <p className="text-sm -mb-3 text-red-600 font-medium">{error}</p>}
                        <button disabled={(amount <= 0 && amount >=500000)} className="-mt-2" onClick={confirmDetails}>Continue</button>
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
                            <p >Confirm details before proceeding</p>
                        </article>
                        
                    <section>
                        <OtpInput
                            value={pin}
                            onChange={setPin}
                            numInputs={4}
                            renderSeparator={<span> </span>}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={{border: "1px solid gray", padding: "15px", width:"40px", height: "45px" , marginLeft:"4px",borderRadius: "7px", fontSize: "14px", marginBottom: "5px"} }
                            
                            />
                            {transactionError && <p className="text-xs text-red-600 font-medium mt-1">{transactionError}</p>}
                            <button disabled={isLoading || !pin} onClick={handleWithdraw}>{isLoading ? <span className="loading loading-bars loading-sm"></span>: <span>Proceed</span>}</button>
                    </section>
                    </div>
                </div>
            </dialog>
           <Toaster richColors closeButton position="bottom-right" />
        </main>
     </>

     );
}

export default Withdraw;