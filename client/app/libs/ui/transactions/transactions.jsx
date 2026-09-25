"use client"
import { useEffect, useState } from "react";
import { useUser } from "@/app/auth/api/profile";
import { bricolage, quicksand } from "../../utils/font";
import TransactionsTable from "./transactions-table";
import TransactionDetailsModal from "./transactions-details-modal";
import { generateReceipt } from "../../utils/receipt";
import { Download } from "lucide-react";
import { showToast } from "../../toast/sonner";
import "@/app/globals.css"
import { downloadBlob, getSelectOptions } from "../../utils/utils";
import CustomSelect from "../custom/custom-select";
import CustomPagination from "../custom/custom-pagination";
import { useTransactions } from "@/app/dashboard/api/transactions/get-transactions";
import { useExport } from "@/app/dashboard/api/transactions/export-transactions";

export default function AllTransactions() {
    const [selectedTransactionId, setSelectedId] = useState(null)
    const [isDownloading, setIsDownloading] = useState(null)
    const [initialLoad, setInitialLoad] = useState(true)
    const [status, setStatus] = useState([])
    const [type, setType] = useState([])
    const [filter, setFilter] = useState({type: "all", status: "all"})

    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        total: 0,
        hasMore: false,
        limit: 10,
    });
    const { data: user } = useUser();

    const skip = (paginationData.currentPage - 1) * paginationData?.limit;

    const { transactions, isError, isRefetching, isLoading, fetchTransactions } = useTransactions({ 
        skip:skip,
        limit:paginationData.limit,
        status:filter.status,
        type:filter.type
     })
     
    const { exportTransactions } = useExport()

  

    useEffect(() => {
        if (transactions && initialLoad) {    
            const statusFilterArray = new Set(transactions?.transactions?.map(transaction => transaction.status))
            const typeFilterArray = new Set(transactions?.transactions?.map(transaction => transaction.type))

            setStatus(Array.from(["all", ...statusFilterArray]))
            setType(Array.from(["all", ...typeFilterArray]))
            setInitialLoad(false)
        }
    }, [transactions, initialLoad])

    useEffect(() => {
        // if(paginationData){
            fetchTransactions()
        // }
    }, [paginationData.currentPage, filter]);

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

    function handleSelect(id) {
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

    async function handleExport() {
        const transactionBlob = await exportTransactions()

        if (transactionBlob.status !== 200) {
            showToast({ type: "error", title: "Download Failed", msg: "Failed to download transactions history" })
            return;
        }
        
        downloadBlob(transactionBlob?.data, transactionBlob.headers["content-disposition"].slice(21))
    }


    const transactionData = {
        data: transactions?.transactions ?? [],
        id: user?.id,
        handleSelect: handleSelect,
        handleDownload: handleDownload,
        isLoading,
        isRefetching,
        isError,
    }


    return (
        <section className="w-full space-y-6 bg-white rounded-2xl border border-gray-200 p-7">
            <div className="space-y-4">
                {/* Top Row: Title & Action Buttons */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <section>
                        <h2 className="text-xl font-bold tracking-tight text-gray-900" style={bricolage.style}>
                            All transactions
                        </h2>
                        <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5" style={quicksand.style}>
                            View and manage your recent account activities
                        </p>
                    </section>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button 
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg border border-none bg-[#03457C] hover:bg-[#02335c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            style={bricolage.style}
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Dropdown for Type */}
                    <div className="w-full">
                        <CustomSelect 
                            options={getSelectOptions(type)}
                            placeholder={"All Types"}
                            handleChange={(e) => setFilter((f) => ({ ...f, type: e ? e.value : "all" }))}
                        />
                    </div>

                    {/* Select for Status */}
                    <div className="w-full">
                        <CustomSelect 
                            options={getSelectOptions(status)}
                            placeholder={"All Statuses"}
                            handleChange={(e) => setFilter((f) => ({ ...f, status: e ? e.value : "all" }))}
                        />


                    </div>
                </section>
            </div>

            <div className="space-y-4">
                <TransactionsTable {...transactionData} />
                <CustomPagination 
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    currentPage={paginationData.currentPage}
                    limit={paginationData.limit}
                    hasMore={paginationData.hasMore}
                    isLoading={isLoading}
                    total={paginationData.total}
                    itemLabel="Transaction"
                    pluralLabel={"Transactions"}
                />
            </div>
            <TransactionDetailsModal id={"my-modal-5"} transactionId={selectedTransactionId} currentUserId={user?.id} handleDownload={handleDownload} isDownloading={isDownloading} />
        </section>
    )
}

