import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useKYC(params) {
    const status = (params?.status && params?.status !=="all") ? params?.status : null   
    const skip = params?.skip || 0
    const limit = params?.limit || 10


    const { data, isLoading, refetch, isError, isRefetching } = useQuery({
        queryKey:["admin-kyc"],
        queryFn: async()=>{
            const response = await api.get(`/admin/kyc`, {
                params:{
                    skip,
                    limit,
                    status
                }
            })

            return response
        },
      
        
    })

    
    return {
        kyc:data?.data,
        isError,
        isLoading,
        fetchKYC: refetch,
        isRefetching,
    }
}