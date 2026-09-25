"use client"

import { useKYCDetails } from "@/app/admin/api/kyc/get-kyc-details";
import { bricolage, montserrat, quicksand } from "@/app/libs/utils/font";
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  User, 
  Mail, 
  CreditCard, 
  Calendar, 
  FileText,
  ShieldCheck,
  AlertCircle,
  Info
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate, getStatusBadge } from "@/app/libs/utils/utils";
import { showToast } from "@/app/libs/toast/sonner";
import { useKYC } from "@/app/admin/api/kyc/get-kycs";
import { useVerifyKYC } from "@/app/admin/api/kyc/verify-kyc";

function KycDetailModal({ id="kyc-detail-modal", userId }) {
    const { fetchKycDetail, userKyc, loading } = useKYCDetails(userId);
    const { fetchKYC } = useKYC()
    const { isVerifying, verify:verifyKYC } = useVerifyKYC(userId)
    const [actionType, setActionType] = useState(null); 
    const [rejectionReason, setRejectionReason] = useState("");
    const [error, setError] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchKycDetail();
            setShowRejectInput(false);
            setRejectionReason("");
            setError("");
        }
    }, [userId]);

    function closeModal() {
        setShowRejectInput(false);
        setRejectionReason("");
        setError("");
        setActionType(null);
        const modal = document.getElementById(id);
        if (modal) modal.close();
        fetchKYC();
    }

    async function handleApprove() {
        if (!userKyc?.id) return;
        setError("");
        setActionType("approve");  

        const response = await verifyKYC({ status: "verified" });
       
        if (response?.status === 200) {
            closeModal();
            showToast({ type: "success", title: "KYC Document verified successfully" });
        } else {
            const errorMsg = response?.msg || "Failed to verify KYC";
            setError(errorMsg);
        }
    }

    async function handleReject() {
        if (!userKyc?.id) return;
        if (!showRejectInput) {
            setShowRejectInput(true);
            return;
        }

        setError("");
        setActionType("reject");
        const response = await verifyKYC({ status: "declined", reason: rejectionReason });
       
        if (response?.status === 200) {
            closeModal();
            showToast({ type: "success", title: "KYC Document declined successfully" });
        } else {
            const errorMsg = response?.msg || "Failed to decline KYC";
            setError(errorMsg);
        }
    }

    const userInformation = [
        { label: "Account Name", Icon: User, value: `${userKyc?.user?.firstName || ''} ${userKyc?.user?.lastName || ''}`.trim() || "N/A" },
        { label: "Email Address", Icon: Mail, value: userKyc?.user?.email || "N/A" },
        { label: "Account Number", Icon: CreditCard, value: userKyc?.user?.accountNumber || "N/A" },
        { label: "Account Tier", Icon: ShieldCheck, value: userKyc?.user?.tier ? `Tier ${userKyc?.user?.tier}` : "N/A" },
    ];

    const submittedDocs = [
        { label: "Full Name on Slip", Icon: FileText, value: userKyc?.full_name || "N/A" },
        { label: "Date of Birth", Icon: Calendar, value: userKyc?.dob || "N/A" },
        { label: "NIN Number", Icon: CreditCard, value: userKyc?.nin_number || "N/A" },
        { label: "Reason", Icon: Info, value: userKyc?.reason || "N/A" },
    ];

    return (
        <dialog id={id} className="modal backdrop-blur-md">
            <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-xl p-0 relative border border-slate-100 text-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-5 h-5 text-[#03457C]" />
                            <h3 className="text-lg font-bold text-slate-900" style={bricolage.style}>
                                KYC Verification Details
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500" style={quicksand.style}>
                            Review user identity documents and account status
                        </p>
                    </div>

                    <button 
                        onClick={closeModal}
                        type="button"
                        className="p-2 text-slate-400 outline-none hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Error Alert Display */}
                    {error && (
                        <div 
                            className="flex items-center justify-between gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in duration-200"
                            style={quicksand.style}
                        >
                            <div className="flex items-center gap-2.5">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                <span>{error}</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setError("")}
                                className="text-rose-500 hover:text-rose-700 p-0.5 rounded-md"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <KycModalSkeleton />
                    ) : userKyc ? (
                        <>
                            <div className="flex items-center justify-between p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
                                <div>
                                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block" style={quicksand.style}>
                                         Current Status
                                    </span>
                                    <div className={`text-[11px] tracking-wide ${getStatusBadge(userKyc?.status)}`} style={quicksand.style}>{userKyc?.status}</div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block" style={quicksand.style}>
                                        Submitted Date
                                    </span>
                                    <span className="text-xs font-semibold text-slate-700" style={quicksand.style}>
                                        {userKyc?.date ? formatDate(userKyc?.date) : "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* User Account Summary */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] text-slate-400 uppercase tracking-wider" style={montserrat.style}>
                                    Account Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-xs">
                                    {userInformation.map((item) => {
                                        const Icon = item.Icon;
                                        return (
                                            <section className="flex items-center gap-2.5" key={item.label}>
                                                <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-500">
                                                    <Icon className="w-4 h-4 text-[#03457C]" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] tracking-wide text-slate-400" style={quicksand.style}>{item.label}</p>
                                                    <p className="font-semibold tracking-wide text-slate-800" style={quicksand.style}>
                                                        {item.value}
                                                    </p>
                                                </div>
                                            </section>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Submitted Documents Details */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] text-slate-400 uppercase tracking-wider" style={montserrat.style}>
                                    Submitted Document Data
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-xs">
                                    {submittedDocs.map((item) => {
                                        const { Icon, label, value } = item;
                                        return (
                                            <div className="flex items-center gap-2.5" key={label}>
                                                <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-500">
                                                    <Icon className="w-4 h-4 text-[#03457C]" />
                                                </div>
                                                <div style={quicksand.style} className="tracking-wide">
                                                    <p className="text-[10px] text-slate-400">{label}</p>
                                                    <p className="font-semibold text-slate-800">{value}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* NIN Slip Preview */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] text-slate-400 uppercase tracking-wider" style={montserrat.style}>
                                        NIN Slip Attachment
                                    </h4>
                                    {userKyc?.nin_slip && (
                                        <a 
                                            href={userKyc?.nin_slip} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-[#03457C] hover:underline font-semibold"
                                            style={quicksand.style}
                                        >
                                            View Slip <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                <div className="relative w-full bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden flex group">
                                    {userKyc?.nin_slip ? (
                                        <div className="flex p-3 items-center gap-3">
                                            <div>
                                                <FileText className="text-[#03457C]"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-xs text-gray-500" style={bricolage.style}>NIN slip uploaded</p>
                                                <p className="text-xs text-gray-500" style={quicksand.style}>
                                                    {userKyc?.nin_slip?.slice(0, 40)}...{userKyc?.nin_slip?.slice(-4)}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-slate-400 p-4 w-full">
                                            <AlertCircle className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                            <p className="text-xs">No NIN slip image provided</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rejection Reason Textarea */}
                            {showRejectInput && (
                                <div className="space-y-2 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
                                    <label className="block text-xs font-semibold text-rose-600" style={quicksand.style}>
                                        Provide Rejection Reason
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="E.g., NIN slip image is blurry or details do not match profile..."
                                        className="w-full text-xs p-3 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-10 text-slate-400">
                            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                            <p className="text-sm" style={quicksand.style}>Failed to load KYC detail records.</p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                {!loading && userKyc && (
                    <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            style={bricolage.style}
                        >
                            Close
                        </button>

                        {userKyc.status?.toLowerCase() === "pending" && (<div className="w-full sm:w-auto flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={isVerifying || (showRejectInput && !rejectionReason.trim())}
                                className="pagination-btn !bg-rose-50 hover:!bg-rose-100 !text-rose-600 border !border-rose-200 gap-1 disabled:!opacity-50 "
                                style={bricolage.style}
                            >
                                <XCircle className="w-4 h-4" />
                                <span>
                                    {actionType === "reject" && isVerifying 
                                        ? "Rejecting..." 
                                        : showRejectInput 
                                        ? "Confirm Reject" 
                                        : "Reject"}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleApprove}
                                disabled={isVerifying}
                                className="pagination-btn gap-1 !bg-[#03457C] hover:!bg-[#02335c] !text-white disabled:!opacity-50 "
                                style={bricolage.style}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{actionType === "approve" && isVerifying ? "Approving..." : "Approve Verification"}</span>
                            </button>
                        </div>)}
                    </div>
                )}
            </div>

            <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                <button type="button">close</button>
            </form>
        </dialog>
    );
}

function KycModalSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-16 bg-slate-100 rounded-2xl" />
            <div className="space-y-2">
                <div className="h-3 w-32 bg-slate-200 rounded" />
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-slate-100 rounded-xl" />
                    <div className="h-12 bg-slate-100 rounded-xl" />
                    <div className="h-12 bg-slate-100 rounded-xl" />
                    <div className="h-12 bg-slate-100 rounded-xl" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-32 bg-slate-200 rounded" />
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-slate-100 rounded-xl" />
                    <div className="h-12 bg-slate-100 rounded-xl" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-3 w-32 bg-slate-200 rounded" />
                <div className="h-48 bg-slate-100 rounded-2xl" />
            </div>
        </div>
    );
}

export default KycDetailModal;