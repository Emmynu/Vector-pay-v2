import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/app/libs/toast/sonner";

export function useKyc() {
    const queryClient =  useQueryClient()

    const uploadKycMutation = useCustomMutation(
        async(data)=>{
           const response =  await api.post("/account/kyc/upload", data)

            await queryClient.invalidateQueries({ queryKey: ["get-current-user"]})
           
                   
            if(response?.status === 200){
                document.getElementById('my-modal-3').close()
                showToast({type: response?.data?.status, title:response?.data?.msg})
            }
            else{
                document.getElementById('my-modal-3').close()
                showToast({type:response?.status, title:response?.title,  msg: response?.msg })
            }
            return response
           
    })


    return {
        uploadKyc: uploadKycMutation.mutateAsync,
        isSubmitting: uploadKycMutation.isPending
    }
}