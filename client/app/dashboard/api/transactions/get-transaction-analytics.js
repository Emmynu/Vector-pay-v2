import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";
import { url } from "./get-transactions";

export function useAnalytics() {
    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["transaction-analytics"],
        queryFn: async () => {
            const response = await api.get(`${url}/analytics`)
            return response
        },
       
    })

    return{
        fetchAnalytics:refetch,
        isLoading,
        analytics:data?.data,
        isRefetching,
    }
}