import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { showToast } from "@/app/libs/toast/sonner";

export function useResetPassword() {
    const resetPasswordMutation = useCustomMutation(
        async(data)=>{
            const response = await api.post("/auth/reset-password", data)
       
            
           if(response?.status === 200){
                showToast({type: response?.data?.status, title: response?.data?.msg})

                window.location = "/auth/login"
            
            }else{
                showToast({ type: response?.status, title: response?.title, msg: response?.msg})
            }

        }
    )

    return{
         resetPassword: resetPasswordMutation.mutate,
         isLoading: resetPasswordMutation.isPending
    }
}