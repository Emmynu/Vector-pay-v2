"use client"

import { useUser } from "@/app/auth/api/profile";
import { Loader2, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

function TransactionPinModal({ id, hasPin }) {
    const [show, setShow] = useState(false)
    const [pins, setPins] = useState({ currentPin: "", newPin: "", confirmPin: "" })
    const [error, setError] = useState("");
    const { setTransactionPin, isSubmitting, updatetransactionPin } = useUser()

    
    function handleOnChange(e) {
        const { name, value } = e.target

        setPins(prev=>({
            ...prev,
            [name]:value
        }))
    }

    async function handleSetUp(e) {
        e.preventDefault()

        setError("");
        if (pins.newPin.length !== 4) {
            setError("PIN must be 4 digits.");
            return;
        }
        if (pins.newPin !== pins.confirmPin) {
            setError("PINs do not match.");
            return;
        }
        if (/^(\d)\1+$/.test(pins.newPin) || pins.newPin === "1234" || pins.newPin === "0000") {
            setError("Choose a less predictable PIN.");
            return;
        }

        if(!hasPin){
            const data = {
                pin: pins.newPin
            }

            setTransactionPin(data)
        }
        
        if(hasPin){
            const data = {
                pin: pins.newPin,
                currentPin: pins.currentPin
            }
            updatetransactionPin(data)
        }

        setPins({newPin: "", confirmPin: "", currentPin: ""})
    } 
    
    return ( 
        <dialog id={id} className="modal">
             <div className="">
                <form className="rounded-2xl modal-box bg-white shadow-xl w-full max-w-md p-6 lg:p-8" onSubmit={handleSetUp}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display font-bold text-xl">
                            {hasPin ? "Change transaction PIN" : "Set up transaction PIN"}
                            </h3>
                            <p className="text-xs opacity-60 mt-1">4-digit PIN · Never share with anyone</p>
                        </div>
                        <button type="button"  className="cursor-pointer  " onClick={()=>document.getElementById('my_modal_1').close()}>
                            <X />
                        </button>
                    </div>
                    <div className="mt-5 space-y-4">
                    {hasPin && (
                       <div>
                            <span className="text-xs font-semibold opacity-70">Current PIN</span>
                            <label className="input bg-white validator mt-1 w-full px-4 rounded-xl border border-slate-400 tracking-[0.6em]  font-mono text-lg transition">
                                <input
                                type={show ? "text" : "password"}
                                inputMode="numeric"
                                autoComplete="off"
                                name="currentPin"
                                value={pins.currentPin}
                                onChange={handleOnChange}
                                maxLength={4}
                                className="text-center"
                                placeholder="••••"
                                pattern="^\d{4}$"

                                />
                            </label>
                    </div>

                    )}
                    <div>
                        <span className="text-xs font-semibold opacity-70">New PIN</span>
                        <label className="input bg-white validator mt-1 w-full px-4 rounded-xl border border-slate-400 tracking-[0.6em]  font-mono text-lg transition">
                            <input
                            type={show ? "text" : "password"}
                            inputMode="numeric"
                            autoComplete="off"
                            name="newPin"
                            value={pins.newPin}
                            onChange={handleOnChange}
                            maxLength={4}
                            className="text-center"
                            placeholder="••••"
                            pattern="^\d{4}$"

                            />
                        </label>
                    </div>



                    <div>
                        <span className="text-xs font-semibold opacity-70">Confirm new PIN</span>
                        <label className="input bg-white validator mt-1 w-full px-4 rounded-xl border border-slate-400 tracking-[0.6em]  font-mono text-lg transition">
                            <input
                            type={show ? "text" : "password"}
                            inputMode="numeric"
                            name="confirmPin"
                            autoComplete="off"
                            value={pins.confirmPin}
                            onChange={handleOnChange}
                            maxLength={4}
                            className="text-center"
                            placeholder="••••"
                            pattern="^\d{4}$"

                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="text-xs font-semibold text-primary inline-flex items-center gap-1"
                    >
                        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {show ? "Hide PIN" : "Show PIN"}
                    </button>
                    {error && <p className="text-xs text-error font-semibold">{error}</p>}
                    <p className="text-xs opacity-60">
                        Avoid using your date of birth or repeating digits like 1111 or 1234.
                    </p>
                    </div>
                    <div className="mt-6 flex gap-3 justify-end">
                    <button type="button" className="btn btn-ghost rounded-full" onClick={()=>document.getElementById('my_modal_1').close()}>
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn bg-[#03457C] border-none rounded-full">
                        {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                        ) : hasPin ? (
                        "Update PIN"
                        ) : (
                        "Set PIN"
                        )}
                    </button>
                    </div>
                </form>
                </div>
        </dialog>
     );
}



export default TransactionPinModal;