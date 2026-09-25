import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"

export function usePINUpdate() {

    const updatetransactionPinMutation = useCustomMutation(
        async (data) => {
            const resp =  await api.post("/account/pin/update", data)   
            
            if(resp?.status === 200){
                document.getElementById('my_modal_1').close()
                showToast({type: resp?.data?.status, title:resp?.data?.msg})

            }
            return resp
        },
       )

    return {
        updatetransactionPin:updatetransactionPinMutation.mutateAsync,
        isSubmitting:updatetransactionPinMutation.isPending
    }
}