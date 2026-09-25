import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useTransactions(params){

    const skip = params?.skip ? params?.skip : 0
    const limit = params?.limit ? params?.limit : 10
    const type = (params?.type && params?.type !== "all") ? params?.type : null
    const status = (params?.status && params?.status !== "all") ? params?.status : null

    const { data:transactions, isLoading, isRefetching, refetch:fetchTransactions, isError  } = useQuery({
        queryKey: ["all-transactions"],
        queryFn: async()=>{
            const response = await api.get("/admin/transactions", {
                params: {
                    skip,
                    limit,
                    type,
                    status
                }
            })

            return response
        },
        enabled: !isNaN(params?.skip) && !isNaN(params?.limit)
    })

    

    return{
        transactions: transactions?.data,
        isLoading,
        isRefetching,
        fetchTransactions,
        isError
    }   
}