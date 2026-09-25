import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";


export function useKYCDetails(userId) {
    const { data:userKyc, isLoading:isDetailLoading, refetch:fetchKycDetail} = useQuery({
        queryKey: ["kyc-detail", userId],
        queryFn: async()=>{
            const response = await api.get(`/admin/kyc/${userId}`)
            return response 
        },
        enabled: Boolean(userId),
        staleTime: 0,
        refetchOnMount: "always"
    })
    
    return {
        userKyc:userKyc?.data,
        loading:isDetailLoading,
        fetchKycDetail,
    }
}