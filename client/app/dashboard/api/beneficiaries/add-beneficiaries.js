import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";

export function useBeneficiary() {
    const addBeneficiary = useCustomMutation(async(data)=>{
        return await api.post("/account/beneficiaries", data)
    })


    return {
        addBeneficiary: addBeneficiary.mutateAsync,
        isSubmitting: addBeneficiary.isPending
    }
}