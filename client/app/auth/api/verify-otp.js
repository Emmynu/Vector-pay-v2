import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import Cookies from "js-cookie";
import { showToast } from "@/app/libs/toast/sonner";


export function useVerifyOtp() {
    const verifyOtpMutation = useCustomMutation(
        async(data)=>{
            const response = await api.post("/auth/otp-verify",data, {
                headers: {
                    "Authorization": `Bearer ${Cookies.get("2fa")}`
                }
            })            

            if(response?.status === 200){
                showToast({type: response?.data?.status, msg: null, title: response?.data?.msg})
              
                window.location = "/dashboard"

               setTimeout(() => {
                 Cookies.remove("2fa")
               }, 2000);
            }else{
                showToast({ type: response?.status, title: response?.title, msg: response?.msg})
            }
            
        }
    )

    return {
        verifyOtp: verifyOtpMutation.mutate,
        isLoading: verifyOtpMutation.isPending
    }
}