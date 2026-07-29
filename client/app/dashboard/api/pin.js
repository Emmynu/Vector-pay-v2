import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQueryClient } from "@tanstack/react-query";

export function usePin() {
    const queryClient = useQueryClient()

       const transactionPinMutation = useCustomMutation(
        async (data) => {
           const resp =  await api.post("/users/pin/setup",data)

 
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
           const resp =  await api.post("/users/pin/update", data)

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

    return {
        setTransactionPin:transactionPinMutation.mutate,
        updatetransactionPin:updatetransactionPinMutation.mutate,
        isSubmitting:transactionPinMutation.isPending || updatetransactionPinMutation.isPending
    }
}