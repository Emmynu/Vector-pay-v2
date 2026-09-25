import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { showToast } from "@/app/libs/toast/sonner";

export function useBanks() {
    const { data, isLoading, isError } =  useQuery({
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

    return{
        banks: data?.data,
        isFetchingBanks: isLoading,
        isError,

        fetchBankDetails: resolveBankDetails.mutateAsync,
        isFetchingDetails: resolveBankDetails.isPending,
    }
}