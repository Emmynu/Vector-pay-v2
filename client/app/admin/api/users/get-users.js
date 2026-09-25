import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useUsers(params) {

    const skip = params?.skip || 0
    const limit = params?.limit || 10
    const tier = (params?.tier && params?.tier !== "all") ? params?.tier : null


    const { data, isLoading, isRefetching, refetch, isError } = useQuery({
        queryKey: ["users"],
        queryFn:async () => {
            const response =  await api.get("/admin/users",{
                params: {
                    skip,
                    limit,
                    tier
                }
            })
            return response
        },
    })

    return{
        users: data?.data,
        isLoading,
        isRefetching,
        fetchUsers: refetch,
        isError
    }
}