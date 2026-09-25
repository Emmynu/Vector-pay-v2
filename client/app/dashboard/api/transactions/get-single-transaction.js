import { api } from "@/app/libs/interceptors/api-client";
import { url } from "./get-transactions";
import { useQuery } from "@tanstack/react-query";

export function useTransaction(transactionId){
    const { data, isError, isLoading, refetch, isRefetching } = useQuery({
        queryKey:["get-single-transaction", transactionId],
        queryFn: async()=>{
            const response = await api.get(`${url}/${transactionId}`)
            return response
        },
        enabled: Boolean(transactionId)
    })

    return{
        transaction:data?.data,
        isLoading,
        fetchTransaction:refetch,
        isError,
        isRefetching
    }
}