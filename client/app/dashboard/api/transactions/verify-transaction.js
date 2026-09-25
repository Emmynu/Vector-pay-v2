import { api } from "@/app/libs/interceptors/api-client";
import { useQuery } from "@tanstack/react-query";

export function useVerify(transactionRef, type= "deposit") {


    const { data, isLoading, refetch, isRefetching, isError } = useQuery({
        queryKey: ["verify-transaction", transactionRef],
        queryFn: async () => {
            const response = await api.get(`/account/transaction/verify/${transactionRef}`)
            return response
        },
        enabled: Boolean(transactionRef) && Boolean(type === "deposit")
    })

    return{
        verifyTransaction:refetch,
        isVerifying:isLoading,
        verifiedTransaction:data,
        isReVerifying:isRefetching,
        isVerificationFailed:isError
    }
}