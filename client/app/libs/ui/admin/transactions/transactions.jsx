"use client"

import { useEffect, useState } from "react"
import { useTransactions } from "@/app/admin/api/transactions/get-transactions"
import CustomPagination from "../../custom/custom-pagination"
import TransactionTable from "./transactions-table"
import { bricolage, quicksand } from "../../../utils/font"
import { getSelectOptions } from "../../../utils/utils"
import CustomSelect from "../../custom/custom-select"
import { RefreshCcw } from "lucide-react"
import TransactionDetailsModal from "./transactions-detail-modal"
import { useAnalytics } from "@/app/admin/api/transactions/get-transactions-analytics"


export default function AdminTransactions(){
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        limit: 10,
    })
    const [type, setType] =  useState([])
    const [status, setStatus] =  useState([])
    const [initialLoad, setInitialLoad] = useState(true)
    const [transactionId, setTransactionId] = useState(null)
    const [filter, setFilter] = useState({type: "all", status: "all"})

    const skip = (paginationData.currentPage - 1) * paginationData.limit
    const { transactions, isError, isLoading, isRefetching, fetchTransactions } = useTransactions({ skip, limit:paginationData.limit, type:filter.type, status:filter.status })
    const { fetchAnalytics } = useAnalytics()

    useEffect(()=>{
        fetchTransactions()
    },[paginationData, filter])


    useEffect(()=>{
        if(transactions?.transactions && initialLoad){
            const statusFilter = new Set(transactions?.transactions?.map(t=>t?.status))
            const TypeFilter = new Set(transactions?.transactions?.map(t=>t?.type))

            setStatus(Array.from(["all", ...statusFilter]))
            setType(Array.from(["all", ...TypeFilter]))

            setInitialLoad(false)
        }
    },[transactions, initialLoad])


    function handleModal(id) {
        setTransactionId(id)
        document.getElementById("admin-transaction-details").showModal()
    }    


    function handleNext() {
        if(transactions?.has_more){
            setPaginationData((v)=>({
            ...v,
            currentPage: v.currentPage +  1
            }))
        }
    }

    function handlePrev() {
        if(paginationData.currentPage > 1){
            setPaginationData((v)=>({
            ...v,
            currentPage: v.currentPage -  1
            }))
        }
    }
    
    const tableData={
        data:transactions?.transactions,
        isRefetching, 
        isLoading, 
        isError,
        handleModal,
    }

    return (
        <main>
           <section className="!w-full space-y-6 !bg-white rounded-2xl border border-gray-200 p-7">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <section>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900" style={bricolage.style}>
                        All transactions
                    </h2>
                    <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5" style={quicksand.style}>
                        View and manage all account activities
                    </p>
                </section>
                <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <button className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-[13px] text-gray-600 h-full flex items-center gap-1 cursor-pointer group hover:bg-white transition-colors w-full sm:w-fit" style={quicksand.style} onClick={()=>{
                        fetchTransactions()
                        fetchAnalytics()
                    }}>
                        <RefreshCcw className="w-[15px] h-[15px] "/>
                        <span>Refresh</span>
                    </button>

                    {/* Dropdown for Type */}
                    <div >
                        <CustomSelect 
                            options={getSelectOptions(type)}
                            placeholder={"All Types"}
                            handleChange={(e) => setFilter((f) => ({ ...f, type: e ? e.value : "all" }))}
                        />
                    </div>

                    {/* Select for Status */}
                    <div >
                        <CustomSelect 
                            options={getSelectOptions(status)}
                            placeholder={"All Statuses"}
                            handleChange={(e) => setFilter((f) => ({ ...f, status: e ? e.value : "all" }))}
                        />
                    </div>
                </section>

            </header>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
            </section>

            <section>
                <TransactionTable {...tableData}/>
            </section>

            <section>
                <CustomPagination 
                currentPage={paginationData.currentPage}
                limit={paginationData.limit}
                total={transactions?.total ?? 0}
                isLoading={isLoading}
                handleNext={handleNext}
                handlePrev={handlePrev}
                hasMore={transactions?.has_more ?? false}
                itemLabel="transaction"
                pluralLabel={"transactions"}
                />
            </section>
           </section>

           <TransactionDetailsModal id={"admin-transaction-details"} transactionId={transactionId}/>
        </main>

    )
}