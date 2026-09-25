import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"
import { showToast } from "@/app/libs/toast/sonner"

export function useRegister() {
        const registerMutation = useCustomMutation(
        async (data)=>{
            const path =  data.role === "admin" ? "/admin/login" : "/auth/login"
            
            const response = await api.post("/auth/register", data)
         
            if(response?.status === 201){
                showToast({type: response?.data?.status, title: response?.data?.msg, msg:response?.data?.description})
                setTimeout(() => {
                    window.location = path
                }, 1500);
            }else{
            showToast({ type: response?.status, title: response?.title, msg: response?.msg})
            }
        }
    )

    return {
        register: registerMutation.mutate,
        isPending: registerMutation.isPending
    }
}