import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQueryClient } from "@tanstack/react-query";


export function useTransfer() {
    const queryClient =  useQueryClient()

    const accountLookupMutation = useCustomMutation(async(data)=>{
        const response = await api.post("/account/resolve", data)

        if(response.status === 200){
            return response
        }
        else{
            showToast({type:response?.status, title:response?.title,  msg: response?.msg })
        }
    })

    const transferMutation = useCustomMutation(async(data)=>{
        const response = await api.post("/account/transfer", data)

      
        if(response.status === 200){
            document.getElementById("my-modal-4").close()
            showToast({type: response?.data?.status, title:response?.data?.msg, msg: response?.data?.description })
        }
        
        await queryClient.invalidateQueries({ queryKey: ["get-current-user"]})
        return response
         
    })
    
    return {
        accountLookup: accountLookupMutation.mutateAsync,
        isLookupLoading: accountLookupMutation.isPending,
        transfer: transferMutation.mutateAsync,
        isTransferLoading: transferMutation.isPending
    }
}