import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"


export function usePIN() {
   
    const transactionPinMutation = useCustomMutation(
        async (data) => {
            const resp =  await api.post("/account/pin/setup",data)
    
            if(resp?.status === 200){
                document.getElementById('my_modal_1').close()
                showToast({type: resp?.data?.status, title:resp?.data?.msg})
            }
            
            return resp
        },

    )
    return {
        setTransactionPin:transactionPinMutation.mutateAsync,
        isSubmitting:transactionPinMutation.isPending
    }
}