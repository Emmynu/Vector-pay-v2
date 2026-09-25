"use client"

import UserSummaryCards from "@/app/libs/ui/admin/users/user-summary";
import { useUsers } from "../../api/users/get-users";
import { useEffect, useState } from "react";
import CustomPagination from "@/app/libs/ui/custom/custom-pagination";
import UsersTable from "@/app/libs/ui/admin/users/users-table";
import UsersHeader from "@/app/libs/ui/admin/users/users.header";
import { motion } from "motion/react";
import { containerVariants, itemVariants } from "@/app/libs/ui/admin/kyc/variants";

export default function Users() {
    const [tier, setTier] = useState(null)
    const [initialLoad, setInitialLoad] = useState(true)
    const [tierOptions, setTierOptions] = useState([])
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10
    })

    const skip = (pagination.currentPage - 1) * pagination.limit

    const { users, isError, isLoading, isRefetching, fetchUsers } = useUsers({
        skip,
        limit:pagination.limit,
        tier,
    })


    useEffect(()=>{
        fetchUsers()
    }, [pagination.currentPage, tier])

    useEffect(()=>{
        if(users && initialLoad){
            const tierFilter = new Set(users?.users?.map(user=>`Tier ${user?.tier}`).sort())
            setTierOptions(Array.from(["All", ...tierFilter]))
            setInitialLoad(false)
        }
    },[users, initialLoad])


    const tableData = {
        data:users?.users,
        isError, 
        isLoading,
        isRefetching
    }
    

    function handleNext() {
        if(users?.hasMore){
            setPagination((v)=>({...v, currentPage:v.currentPage++}))
        }
    }

    function handlePrev() {
        if(pagination.currentPage > 1){
            setPagination((v)=>({...v, currentPage:v.currentPage--}))
        }
    }

    const options = tierOptions.map(option=>({
        label: option,
        value: option?.includes("Tier") ? option?.slice(-1) : option.toLowerCase()
    }))
    

    return(
        <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col space-y-7"
        >
            <UserSummaryCards summary={users?.summary} isLoading={isLoading}/>
            

            <motion.section  variants={itemVariants} className="!w-full space-y-6 !bg-white rounded-2xl border border-gray-200 p-7">
                
                <UsersHeader fetchUsers={fetchUsers} setTier={setTier} options={options}/>
                <UsersTable {...tableData}/>

                <CustomPagination
                currentPage={pagination.currentPage}
                total={users?.total}
                hasMore={users?.hasMore}
                handleNext={handleNext}
                handlePrev={handlePrev}
                isLoading={isLoading}
                itemLabel="user"
                pluralLabel={"users"}
                limit={pagination.limit}
                />
            </motion.section>
        </motion.main>
    )
}