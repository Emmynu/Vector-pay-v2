import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";

export function useBeneficiaries() {
    const deleteBeneficiary = useCustomMutation(async(id)=>{     
        return api.delete("/account/beneficiaries",{
            params:{
                id,
            },   
        })
    })


    return{
        deleteBeneficiary: deleteBeneficiary.mutateAsync,
        isDeleting: deleteBeneficiary.isPending
    }
}