import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useTransactionDetails(transactionId) {
    const { data, isLoading, refetch, isRefetching, isError } = useQuery({
        queryKey: ["transaction-details", transactionId],
        queryFn: async()=>{
            const response =  await api.get(`/admin/transactions/${transactionId}`)
            return response
        },
        enabled: Boolean(transactionId)
    })

    return{
        transaction:data?.data,
        isLoading, 
        fetchTransactionDetail: refetch,
        isRefetching,
        isError
    }
}