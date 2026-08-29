import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useWithdraw(){
    const queryClient = useQueryClient()


    const { data, isLoading } =  useQuery({
        queryKey: ["banks"],
        queryFn:async()=>{
            const banks = await api.get("/account/banks")
            return banks
        },
    })

    const resolveBankDetails = useCustomMutation(async(payload)=>{
        const response = await api.post("/account/bank-details/resolve", payload)
        

        if(response.status === 200){
            return response.data
        }
        else{
            showToast({type:response?.status, title:response?.title,  msg: response?.msg })
        }
    })


    const initiateWithdrawal = useCustomMutation(async (payload) => {
        const response = await api.post("/account/withdraw", payload)

        if(response.status === 200){
            showToast({type: response?.data?.status, title:response?.data?.msg, msg: response?.data?.description })

        }
        else{
            showToast({type:response?.status, title:response?.title,  msg: response?.msg })
        }
        
        document.getElementById("my-modal-4").close()
        await queryClient.invalidateQueries({ queryKey: ["get-current-user"]})
        return response
    })



    return {
        banks: data?.data,
        isFetchingBanks: isLoading,
        fetchBankDetails: resolveBankDetails.mutateAsync,
        isFetchingDetails: resolveBankDetails.isPending,
        withdraw:initiateWithdrawal.mutateAsync,
        isProcessing: initiateWithdrawal.isPending
    }
}