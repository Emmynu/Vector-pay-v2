import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";

export function useVerifyKYC(userId) {

    const verifyKyc = useCustomMutation(async(data)=>{
        const response = await api.patch(`/admin/kyc/${userId}/status`,data)
        return response
    })

    
    return {
        verify:verifyKyc.mutateAsync,
        isVerifying: verifyKyc.isPending,
    }
}