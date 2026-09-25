import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import Cookies from "js-cookie";
import { showToast } from "@/app/libs/toast/sonner";



export function useVerifyOtp() {
    const verifyOtpMutation = useCustomMutation(
        async(data)=>{
            const { code, path} = data
         
            
            const response = await api.post("/auth/otp-verify", {code} , {
                headers: {
                    "Authorization": `Bearer ${Cookies.get("2fa")}`
                }
            })            

            
            if(response?.status === 200){
                showToast({type: response?.data?.status, msg: null, title: response?.data?.msg})
              
                window.location.href = path 
            }else{
                showToast({ type: response?.status, title: response?.title, msg: response?.msg})
            }
            
        }
    )

    const resendMutation = useCustomMutation(
        async(data)=>{
            const response = await api.post("/auth/resend-otp", data, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get("2fa")}`
                }
            })  

            if(response?.status === 200){
                Cookies.set("2fa", response?.data?.token)
                showToast({type: response?.data?.status, title:response?.data?.msg})
            }
            else{
                showToast({ type: response?.status, title: response?.title, msg: response?.msg})
            }
            return response
        }
    )

    return {
        verifyOtp: verifyOtpMutation.mutate,
        resendOtp: resendMutation.mutateAsync,
        isPending: resendMutation.isPending,
        isLoading: verifyOtpMutation.isPending
    }
}