import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useRequests(params) {
    const skip = params?.skip ?? 0
    const limit = params?.limit ?? 3
    const status = params?.status ?? null
    const type = params?.type ?? "sent"

    const { data:requests, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["get-requests", type],
        queryFn:async()=>{
            return await api.get("/account/requests",{
                params: {
                    type,
                    status,
                    skip,
                    limit,
                },
            })
        }
    })

    return {
        requests: requests?.data,
        isLoading,
        fetchRequests:refetch,
        isRefetching
    }
}