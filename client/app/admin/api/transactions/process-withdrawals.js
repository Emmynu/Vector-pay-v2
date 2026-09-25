import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";


export function useProcessWithdrawals(transactionId) {
    const processWithdrawalMutation = useCustomMutation(async (status) => {
        const response = await api.patch(`/admin/transactions/${transactionId}/withdraw`,{}, {
            params: {
                status
            }
        })
    

        return response
    })
    return {
        processWithdrawal: processWithdrawalMutation.mutateAsync,
        isProcessing: processWithdrawalMutation.isPending,
    }
}