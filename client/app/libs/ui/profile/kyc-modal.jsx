"use client";

import { useEffect, useState } from "react";
import { X, Upload, Loader2, AlertCircle } from "lucide-react";
import "@/app/globals.css";
import { uploadFile } from "../../supabase/supabase";
import { useKyc } from "@/app/dashboard/api/kyc";
import { bricolage, quicksand } from "../../utils/font";

export default function KYCModal({ id }) {
    const [nin, setNin] = useState({ ninNumber: "", fullName: "", dob: "", ninSlip: null });
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const { uploadKyc, isSubmitting } = useKyc();

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

    const valid =
        nin.ninNumber.length === 11 &&
        nin.fullName.trim().length >= 3 &&
        nin.dob.length > 0 &&
        nin.ninSlip &&
        allowedTypes.includes(nin.ninSlip?.type);

    useEffect(() => {
        if (nin.ninSlip && !allowedTypes.includes(nin.ninSlip?.type)) {
            setError("Please upload a PDF, JPEG, JPG, or PNG image.");
            setNin((prev) => ({ ...prev, ninSlip: null }));
        } else if (error) {
            setError("");
        }
    }, [nin.ninSlip]);

    const closeModal = () => {
        setError("");
        setNin({ ninNumber: "", fullName: "", dob: "", ninSlip: null });
        document.getElementById(id)?.close();
    };

    const handleInputChange = (field, value) => {
        if (error) setError("");
        setNin((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!valid) {
            setError("Invalid input. Please complete all fields accurately.");
            return;
        }

        setError("");
        setIsUploading(true);

        const { url: uploadUrl, error: uploadError } = await uploadFile(
            "kyc-slip",
            nin.ninSlip,
            `slip/${Date.now()}_${nin.ninSlip.name}`
        );

        setIsUploading(false);

        if (uploadError) {
            setError(uploadError || "Failed to upload file. Please try again.");
            return;
        }

        const data = {
            full_name: nin.fullName.trim(),
            nin_number: nin.ninNumber,
            dob: nin.dob,
            nin_slip: uploadUrl,
        };

        // Submit KYC data
        const kycResponse = await uploadKyc(data);

       
        if (kycResponse?.status === 201 ) {
            closeModal();
        } else {
            setError(kycResponse?.msg  || "Submission failed. Status was not 200.");
        }
    };

    return (
        <dialog id={id} className="modal bg-black/60 backdrop-blur-xs">
            <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-lg p-6 sm:p-8 border border-slate-100 text-slate-800">
                <form className="w-full" onSubmit={handleSubmit}>
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="font-display font-bold text-xl text-slate-900" style={bricolage.style}>
                                Verify your identity
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5" style={quicksand.style}>
                                Manual KYC · National Identification Number
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Inline Alert Banner */}
                    {error && (
                        <div
                            className="mt-4 flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in duration-200"
                            style={quicksand.style}
                        >
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Inputs Container */}
                    <div className="mt-5 space-y-4">
                        <Input
                            label="Full name (as on NIN slip)"
                            name="fullName"
                            value={nin.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            placeholder="John Doe"
                            minLength={3}
                            maxLength={50}
                        />

                        <Input
                            label="NIN (11 digits)"
                            value={nin.ninNumber}
                            onChange={(e) =>
                                handleInputChange("ninNumber", e.target.value.slice(0, 11).replace(/\D/g, ""))
                            }
                            placeholder="12345678901"
                            name="ninNumber"
                            maxLength={11}
                            minLength={11}
                            pattern="[0-9]*"
                        />

                        <div>
                            <span className="text-xs font-semibold text-slate-700" style={quicksand.style}>
                                Date of birth
                            </span>
                            <input
                                type="date"
                                value={nin.dob}
                                name="dob"
                                onChange={(e) => handleInputChange("dob", e.target.value.trim())}
                                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#03457C]/20 focus:border-[#03457C] transition text-sm text-slate-900 custom-date-input-indicator"
                                style={quicksand.style}
                            />
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-slate-700" style={quicksand.style}>
                                Upload NIN slip
                            </span>
                            <div className="bg-slate-50 w-full mt-1 border-2 border-dashed border-slate-300 rounded-xl p-3 flex items-center gap-3 hover:border-[#03457C] text-xs transition cursor-pointer relative">
                                <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="text-slate-600 font-medium truncate flex-1" style={quicksand.style}>
                                    {nin.ninSlip ? nin.ninSlip.name : "Choose PDF, JPEG, or PNG file"}
                                </span>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg, application/pdf"
                                    onChange={(e) => handleInputChange("ninSlip", e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 pt-1" style={quicksand.style}>
                            Your details will be reviewed manually. You'll be notified once your verification is complete.
                        </p>
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="mt-6 flex gap-3 justify-end pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            disabled={isSubmitting || isUploading}
                            onClick={closeModal}
                            className="btn bg-transparent border-2 border-[#03457C] text-[#03457C] font-medium hover:bg-slate-50 disabled:opacity-50 rounded-full"
                            style={bricolage.style}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading || !valid}
                            className="btn bg-[#03457C] hover:bg-[#02335c] disabled:opacity-50 text-white rounded-full border-none px-6 flex items-center gap-2"
                            style={bricolage.style}
                        >
                            {isSubmitting || isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{isUploading ? "Uploading..." : "Submitting..."}</span>
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

function Input({ label, value, onChange, type = "text", placeholder, name, maxLength, minLength, pattern }) {
    return (
        <label className="block">
            <span className="text-xs font-semibold text-slate-700" style={quicksand.style}>
                {label}
            </span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                name={name}
                placeholder={placeholder}
                minLength={minLength}
                maxLength={maxLength}
                pattern={pattern}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#03457C]/20 focus:border-[#03457C] transition text-sm text-slate-900 placeholder:text-slate-400 "
                style={quicksand.style}
            />
        </label>
    );
}