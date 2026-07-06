import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"
import { showToast } from "@/app/libs/toast/sonner"

export function useRegister() {
        const registerMutation = useCustomMutation(
        async (data)=>{
            const response = await api.post("/auth/register", data)
         
            if(response?.status === 201){
                showToast({type: response?.data?.status, msg: response?.data?.msg, title: "User successfully created"})
              

                window.location = "/auth/login"
            }else{
            showToast({ type: response?.status, title: response?.title, msg: response?.msg})
            }
        }
    )

    return {
        registerUser: registerMutation.mutate,
        isPending: registerMutation.isPending
    }
}