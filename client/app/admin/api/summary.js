import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useSummary() {
    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: async()=>{
            const response = await api.get("/admin/dashboard/summary")
            return response
        }
    })

    return{
        summary:data?.data,
        isLoading,
        fetchSummary: refetch,
        isRefetching
    }
}