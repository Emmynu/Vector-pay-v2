"use client"
import { useTransactions } from "@/app/dashboard/api/transactions";
import { useEffect, useState } from "react";
import { useUser } from "@/app/auth/api/profile";
import { bricolage, quicksand, montserrat } from "../utils/font";
import TransactionsTable from "./transactions-table";
import TransactionDetailsModal from "./transactions-details-modal";
import { generateReceipt } from "../utils/receipt";
import { showToast } from "../toast/sonner";


export default function AllTransactions() {
    const [selectedTransactionId, setSelectedId] = useState(null)
    // const [selectedTransactionReference, setSelectedReference] = useState(null)
    const [isDownloading, setIsDownloading] = useState(null)

    const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    total: 0,
    hasMore: false,
    limit: 10,
    });
    const { data: user } = useUser();

    const skip = (paginationData.currentPage - 1) * paginationData?.limit;

    const { isLoading, transactions, fetchTransactions } = useTransactions({ skip: skip, limit: paginationData.limit });


    useEffect(() => {
        if (!Number.isNaN(skip)) {
            fetchTransactions()
        }
    }, [paginationData.currentPage, paginationData.limit]);
    

    useEffect(() => {
    if (transactions) {
        setPaginationData((v) => ({
        ...v,
        hasMore: transactions?.has_more,
        total: transactions?.total || 0,
        }));
    }
    }, [transactions]);

    function handleNext() {
    if (paginationData.hasMore) {
        setPaginationData((v) => ({
        ...v,
        currentPage: v.currentPage + 1,
        }));
    }
    }

    function handlePrev() {
    if (paginationData.currentPage > 1) {
        setPaginationData((v) => ({
        ...v,
        currentPage: v.currentPage - 1,
        }));
    }
    }

    function handleSelect(id){
        setSelectedId(id)
        document.getElementById("my-modal-5").showModal()
    }


    function handleDownload(transaction) {
        setIsDownloading(true)
        generateReceipt(transaction, user?.id)

        setTimeout(() => {
            setIsDownloading(false)
            document.getElementById("my-modal-5").close()
        }, 1500);
  }

  

    const totalPages = Math.ceil(paginationData.total / paginationData.limit) || 1;
    const transactionData = {
        data:transactions?.transactions ?? [],
        id: user?.id,
        handleSelect: handleSelect,
        handleDownload: handleDownload,
        isLoading,
    }



    return(
        <section className="w-full space-y-6 bg-white rounded-xl border border-gray-200 p-7">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 ">
                <div>
                <h2 className="text-xl font-bold " style={bricolage.style}>
                    All transactions
                </h2>
                <p className="text-[13px] text-gray-500 mt-0.5" style={quicksand.style}>
                    View and manage your recent account activities
                </p>
                </div>

                {paginationData.total > 0 && (
                <span className="text-[10px] sm:text-[11px] font-medium text-[#03457C] bg-[#E6F0FA] px-3 py-1.5 rounded-full border border-none self-start sm:self-auto" style={montserrat.style}>
                    Total: {paginationData.total} transactions
                </span>
                )}
            </div>

      
            <div className="space-y-4">
                <TransactionsTable
                   {...transactionData}
                />
                <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                    Page <span className="font-semibold text-gray-800">{paginationData.currentPage}</span> of{" "}
                    <span className="font-semibold text-gray-800">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                    <button
                    onClick={handlePrev}
                    disabled={paginationData.currentPage === 1 || isLoading}
                    className="inline-flex cursor-pointer items-center justify-center px-4 py-2 text-xs font-semibold text-[#03457C] bg-white border border-gray-200 rounded-lg hover:bg-[#E6F0FA] hover:border-[#4A90E2]/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-150 shadow-sm"
                    >
                    Previous
                    </button>

                    <button
                    onClick={handleNext}
                    disabled={!paginationData.hasMore || isLoading}
                    className="inline-flex cursor-pointer items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#03457C] rounded-lg hover:bg-[#023158] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
                    >
                    Next
                    </button>
                </div>
                </div>
            </div>
             <TransactionDetailsModal id={"my-modal-5"} transactionId={selectedTransactionId} currentUserId={user?.id} handleDownload={handleDownload} isDownloading={isDownloading} />
    </section>
    )
}