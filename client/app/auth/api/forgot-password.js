import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";

export function useForgotPassword() {
    const forgotPasswordMutation = useCustomMutation(
        async (data) => {
            const response = await api.post("/auth/forgot-password", data)
            
            
           if(response?.status === 200){
                showToast({type: response?.data?.status, msg: response?.data?.msg, title: "Forgot Password successful"})
            }else{
            showToast({ type: response?.status, title: response?.title, msg: response?.msg})
            }
        }
    )
    return{
        forgotPassword: forgotPasswordMutation.mutate,
        isLoading: forgotPasswordMutation.isPending
    }
}