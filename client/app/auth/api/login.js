import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { showToast } from "@/app/libs/toast/sonner";
import { api } from "@/app/libs/interceptors/api-client";
import Cookies from "js-cookie"

export function useLogin() {
   const loginMutation = useCustomMutation(
        async (data)=>{
            const path =  data.role === "admin" ? "/admin/verify-otp" : "/auth/verify-otp"
            const response = await api.post("/auth/login", data)
            
            
            if(response?.status === 200){
                Cookies.set("2fa", response?.data?.token,{
                    expires: 5/1440,
                    sameSite: "strict",
                    secure: false // True
                })
                showToast({type: response?.data?.status, title: response?.data?.msg, msg: response?.data?.description})
                window.location = path

            }else{
                showToast({ type: response?.status, title: response?.title, msg: response?.msg})
            }

        }
    )

    return {
        login: loginMutation.mutate,
        isLoading: loginMutation.isPending
    }
}

