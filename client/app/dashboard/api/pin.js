import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQueryClient } from "@tanstack/react-query";

export function usePin() {
    const queryClient = useQueryClient()

       const transactionPinMutation = useCustomMutation(
        async (data) => {
           const resp =  await api.post("/account/pin/setup",data)
 
            await queryClient.invalidateQueries({ queryKey: ["get-current-user"] })
            
           if(resp?.status === 200){
                document.getElementById('my_modal_1').close()
                showToast({type: resp?.data?.status, title:resp?.data?.msg})
           }
           else{
                document.getElementById('my_modal_1').close()
                showToast({type:resp?.status, title:resp?.title,  msg: resp?.msg })
           }
        },

    )

    const updatetransactionPinMutation = useCustomMutation(
        async (data) => {
           const resp =  await api.post("/account/pin/update", data)

            await queryClient.invalidateQueries({ queryKey: ["get-current-user"] })
            
           if(resp?.status === 200){
                document.getElementById('my_modal_1').close()
                showToast({type: resp?.data?.status, title:resp?.data?.msg})

           }else{
                document.getElementById('my_modal_1').close()

            showToast({type:resp?.status, title:resp?.title,  msg: resp?.msg })
           }
        },
    )

    const resetTransactionPin = useCustomMutation(async()=>{
        const response = await api.post("/account/pin/reset")

        await queryClient.invalidateQueries({ queryKey: ["get-current-user"] })
        
        if(response?.status === 200){
            showToast({type: response?.data?.status, title:response?.data?.msg})

        }else{
            showToast({type:response?.status, title:response?.title,  msg: response?.msg })
        }
    })

    return {
        setTransactionPin:transactionPinMutation.mutate,
        updatetransactionPin:updatetransactionPinMutation.mutate,
        isSubmitting:transactionPinMutation.isPending || updatetransactionPinMutation.isPending,
        resetTransactionPin:resetTransactionPin.mutate,
        isResetting: resetTransactionPin.isPending 
    }
}