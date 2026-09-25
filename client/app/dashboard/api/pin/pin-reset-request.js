import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"

export function usePINResetRequest() {

    const resetTransactionPinRequest = useCustomMutation(async()=>{
        const response = await api.post("/account/pin/reset-request")
    
        if(response?.status === 200){
            document.getElementById("pin_reset_modal").showModal()
        }else{
            showToast({type:response?.status, title:response?.title,  msg: response?.msg })
        }
    }) 
    

    return {
        resetTransactionPinRequest: resetTransactionPinRequest.mutate,
        isRequestting: resetTransactionPinRequest.isPending
    }
}