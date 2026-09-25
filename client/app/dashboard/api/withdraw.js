import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQueryClient } from "@tanstack/react-query";

export function useWithdraw(){
    const queryClient = useQueryClient()

    const initiateWithdrawal = useCustomMutation(async (payload) => {
        const response = await api.post("/account/withdraw", payload)

        if(response.status === 200){
            document.getElementById("my-modal-4").close()
            showToast({type: response?.data?.status, title:response?.data?.msg, msg: response?.data?.description })

        }
  

        await queryClient.invalidateQueries({ queryKey: ["get-current-user"]})
        return response
    })



    return {
        withdraw:initiateWithdrawal.mutateAsync,
        isProcessing: initiateWithdrawal.isPending
    }
}