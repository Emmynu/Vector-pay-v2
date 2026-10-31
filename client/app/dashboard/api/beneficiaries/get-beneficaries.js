import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useBeneficiary(params) {
    const skip = params?.skip ?? 0
    const limit = params?.limit ?? 3

    const { data:beneficiaries, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["get-beneficiaries"],
        queryFn: async()=>{
            return await api.get("/account/beneficiaries",{
                params: {
                    skip,
                    limit
                }
            })
        }
    })


    return {
        beneficiaries: beneficiaries?.data,
        isLoading,
        isRefetching,
        fetchBeneficiaries: refetch
    }
}