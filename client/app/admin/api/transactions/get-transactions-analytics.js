import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useAnalytics(){
    const { data, isLoading, refetch, isRefetching, isError } = useQuery({
        queryKey: ["admin-analytics"],
        queryFn:async()=>{
            const response = await api.get("/admin/transactions/analytics")
            return response
        }
    })

    return{
        analytics: data?.data,
        isLoading,
        isError,
        isRefetching,
        fetchAnalytics:refetch
    }
}