import { api } from "@/app/libs/interceptors/api-client"

export   function useVerify() {
    return {
        async verifyAccount(token){
            const response = await api.post(`/auth/verify/${token}`)
            return response
        }
    }
} 