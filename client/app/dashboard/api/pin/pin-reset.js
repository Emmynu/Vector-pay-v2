import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"


export function usePINReset() {

      const resetTransactionPin = useCustomMutation(async({ code })=>{        
           const response = await api.post(`/account/pin/reset?code=${code}`)
           return response
   
       })
   
    return {
        resetTransactionPin: resetTransactionPin.mutateAsync,
        isResetting: resetTransactionPin.isPending
    }
}