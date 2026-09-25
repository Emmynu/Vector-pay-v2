"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useKYC } from "../../api/kyc/get-kycs"
import KYCTable from "@/app/libs/ui/admin/kyc/kyc-table"
import "../../../globals.css"
import KycDetailModal from "@/app/libs/ui/admin/kyc/kyc-detail-modal"
import KYCSummary from "@/app/libs/ui/admin/kyc/kyc-summary"
import KYCHeader from "@/app/libs/ui/admin/kyc/kyc-header"
import { containerVariants, itemVariants } from "@/app/libs/ui/admin/kyc/variants"
import CustomPagination from "@/app/libs/ui/custom/custom-pagination"


export default function KYCVerificationPage() {
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        limit: 10,
    })
    const [status, setStatus] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const skip = (paginationData.currentPage - 1) * paginationData.limit

    const { kyc, isError, isLoading, fetchKYC, isRefetching } = useKYC({ skip, limit: paginationData.limit, status })




    useEffect(() => {
        fetchKYC()
    }, [paginationData, status])

   

    function handlePrev() {
       if (paginationData.currentPage > 1) {
            setPaginationData((v) => ({ ...v, currentPage: v.currentPage - 1 }))
       }
    }

    function handleNext() {
        if (hasMore) {
            setPaginationData((v) => ({ ...v, currentPage: v.currentPage + 1 }))
        }
    }

    function handleModal(userId) {
        setSelectedId(userId)
        document.getElementById("kyc-detail-modal").showModal()
    }

    const kycTableData = {
        kyc: kyc?.kyc?.submitted_kycs ?? [],
        isLoading,
        handleModal:handleModal, 
        isRefetching,
        isError
    }

    return (
        <motion.main 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col space-y-7"
        >
           
            <KYCSummary kyc={kyc?.kyc} isLoading={isLoading}/>
            <motion.section 
                variants={itemVariants}
                className="!w-full space-y-6 !bg-white rounded-2xl border border-gray-200 p-7 "
            >
                
                <KYCHeader setStatus={setStatus} fetchKYC={fetchKYC}/>
                <KYCTable {...kycTableData}/>

               <CustomPagination 
               currentPage={paginationData.currentPage}
               limit={paginationData.limit}
               handleNext={handleNext}
               handlePrev={handlePrev}
               hasMore={kyc?.hasMore}
               total={kyc?.total ?? 0}
               isLoading={isLoading}
               itemLabel="document"
               pluralLabel={"documents"}
               />
            </motion.section>
            <KycDetailModal id={"kyc-detail-modal"} userId={selectedId}/>
        </motion.main>
    )
}