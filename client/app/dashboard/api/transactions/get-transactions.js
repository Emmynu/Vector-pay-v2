import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/app/libs/interceptors/api-client"

export const url = "/account/transactions"

export function useTransactions(params) {
    const pathname = usePathname()
    
    const skip = params?.skip || 0
    const limit = (pathname === "/dashboard") ? 4 : (params?.limit || 10) 
    const status = (params?.status && params?.status !== "all") ? params?.status : null
    const type = (params?.type && params?.type !== "all") ? params?.type  : null

    const { data:transactions, isLoading, refetch, isRefetching, isError } = useQuery({
        queryKey: ["transactions", limit],
        queryFn: async() =>{       
            const response = await api.get(url, {
                params: {
                    skip,
                    limit,
                    status, 
                    type
                }
            })

            return response
        },
        enabled: !isNaN(Number(skip)) && !isNaN(Number(limit))
    })

    return{
        fetchTransactions: refetch,
        isLoading,
        transactions: transactions?.data,
        isRefetching,
        isError,
    }
}