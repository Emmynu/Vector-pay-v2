import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"

export   function useVerify() {
    const verifyMutation = useCustomMutation(async(token)=>{
        const response = await api.post(`/auth/verify/${token}`)
        return response
    })
    
    const resendMutation = useCustomMutation(async(data)=>{
        const response = await api.post("auth/resend-verification", data)
        return response
    })

    return {
        verifyAccount: verifyMutation.mutateAsync,
        isLoading:verifyMutation.isPending,
        resendVerificationLink:resendMutation.mutateAsync,
        isResending: resendMutation.isPending
    }


} 