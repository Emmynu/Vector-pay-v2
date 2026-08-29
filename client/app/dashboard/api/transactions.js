import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"

export function useTransactions(params){

    const pathname = usePathname()

    const skip = (pathname === "/dashboard") ? 0 : (params?.skip || 0)
    const limit = (pathname === "/dashboard") ? 5 : (params?.limit || 10)


    const query = useQueryClient()
   
    
    let url = "/account/transactions"

    const { data:transactions, isLoading, refetch } = useQuery({
        queryKey: ["transaction-history"],
        queryFn:async() =>{

       
            const response = await api.get(`${url}/?skip=${skip}&limit=${limit}` )
            return response
        },
        enabled: !isNaN(Number(skip)) && !isNaN(Number(limit))
    })

    const fetchSingleTransaction = useCustomMutation(
        async({ transactionId })=>{
 
            const response = await api.get(`${url}/${transactionId}`)
            return response
    })

    const verifyTransaction = useCustomMutation(async({ reference })=>{
            try{
                const response = await api.get(`/account/transaction/verify/${reference}`)
                return response
            }
            finally{
                // invalid queries
                query.invalidateQueries({queryKey: ["get-current-user"]})
                query.invalidateQueries({queryKey: ["transaction-history"]})
                refetch()
            }
    })


    return {
        fetchTransactions: refetch,
        isLoading,
        transactions: transactions?.data?.transactions,

        chartData: transactions?.data?.chartData,

        fetchSingleTransaction:fetchSingleTransaction.mutate,
        isFetching: fetchSingleTransaction.isPending,
        transaction:fetchSingleTransaction.data,


        verifyTransaction: verifyTransaction.mutateAsync,
        isVerifying:verifyTransaction.isPending
    }
}