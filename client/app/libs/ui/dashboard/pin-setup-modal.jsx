"use client";


import { Loader2, Eye, EyeOff, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { bricolage, quicksand } from "../../utils/font";
import { usePIN } from "@/app/dashboard/api/pin/pin-setup";
import { usePINUpdate } from "@/app/dashboard/api/pin/pin-update";
import { useQueryClient } from "@tanstack/react-query";

function TransactionPinModal({ id, hasPin }) {
    const [show, setShow] = useState(false);
    const [pins, setPins] = useState({ currentPin: "", newPin: "", confirmPin: "" });
    const [error, setError] = useState("");
    const queryClient = useQueryClient()
    const { setTransactionPin, isSubmitting } = usePIN();
    const { updatetransactionPin, isSubmitting: isUpdating } = usePINUpdate()

    function handleOnChange(e) { 
        const { name, value } = e.target;

        if (error) setError(""); 

        setPins((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSetUp(e) {
        e.preventDefault();

        setError("");
        let response;
        if (hasPin && pins.currentPin.length !== 4) {
            setError("Current PIN must be 4 digits.");
            return;
        }
        if (pins.newPin.length !== 4) {
            setError("New PIN must be 4 digits.");
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

        if (!hasPin) {
            const data = { pin: pins.newPin };
            response = await setTransactionPin(data);
        } else {
            const data = {
                pin: pins.newPin,
                currentPin: pins.currentPin,
            };
            response = await updatetransactionPin(data);
        }

        if(response?.status !== 200){
            setError(response?.title)
            // setError((v)=>({...v, `${response?.msg}`}))
        }else{
            closeModal()
        }

        queryClient.refetchQueries({ queryKey: ["get-current-user"] })

    }

    const closeModal = () => {
        setError("");
        setPins({ newPin: "", confirmPin: "", currentPin: "" });
        document.getElementById(id)?.close();
    };

    return (
        <dialog id={id} className="modal backdrop-blur-xs">
            <div>
                <form className="rounded-2xl modal-box bg-white shadow-xl w-full max-w-md p-6 lg:p-8" onSubmit={handleSetUp}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-display font-bold text-xl text-slate-900" style={bricolage.style}>
                                {hasPin ? "Change transaction PIN" : "Set up transaction PIN"}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5" style={quicksand.style}>
                                4-digit PIN · Never share with anyone
                            </p>
                        </div>
                        <button
                            type="button"
                            className="cursor-pointer p-1 rounded-full text-slate-400 hover:text-slate-500 hover:bg-blue-50 transition-colors !outline-none !border-none"
                            onClick={closeModal}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="mt-5 space-y-4">
                        {/* Inline Error Message Banner */}
                        {error && (
                            <div
                                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in slide-in-from-top-1 duration-200"
                                style={quicksand.style}
                            >
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                                <span>{error}</span>
                            </div>
                        )}

                        {hasPin && (
                            <div>
                                <span style={quicksand.style} className="text-xs font-semibold text-slate-600">
                                    Current PIN
                                </span>
                                <label className="input bg-white validator mt-1 w-full px-4 rounded-xl border border-slate-300 tracking-[0.6em] font-mono text-lg transition focus-within:border-[#03457C]">
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
                            <span style={quicksand.style} className="text-xs font-semibold text-slate-600">
                                New PIN
                            </span>
                            <label className="input bg-white validator mt-1 w-full px-4 rounded-xl border border-slate-300 tracking-[0.6em] font-mono text-lg transition focus-within:border-[#03457C]">
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
                            <span className="text-xs font-semibold text-slate-600" style={quicksand.style}>
                                Confirm new PIN
                            </span>
                            <label className="input bg-white validator mt-1 w-full px-4 rounded-xl border border-slate-300 tracking-[0.6em] font-mono text-lg transition focus-within:border-[#03457C]">
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
                            style={bricolage.style}
                            className="text-xs font-semibold text-[#03457C] inline-flex items-center gap-1 cursor-pointer hover:underline"
                        >
                            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            {show ? "Hide PIN" : "Show PIN"}
                        </button>

                        <p className="text-xs text-slate-500 pt-1" style={quicksand.style}>
                            Avoid using your date of birth or repeating digits like 1111 or 1234.
                        </p>
                    </div>

                    <div className="mt-6 flex gap-3 justify-end">
                        <button
                            type="button"
                            className="btn bg-transparent border-2 border-[#03457C] text-[#03457C] font-medium shadow-sm hover:opacity-80 disabled:opacity-70 rounded-full"
                            onClick={closeModal}
                            disabled={isSubmitting || isUpdating}
                            style={bricolage.style}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUpdating}
                            className="btn bg-[#03457C] border-none rounded-full text-white disabled:opacity-70 hover:opacity-80 flex items-center gap-2"
                            style={bricolage.style}
                        >
                            {(isSubmitting || isUpdating) ? (
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