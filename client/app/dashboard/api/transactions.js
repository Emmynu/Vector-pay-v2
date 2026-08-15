import { api } from "@/app/libs/interceptors/api-client"
import useCustomMutation from "@/app/libs/utils/custom-mutation"
import { useQuery } from "@tanstack/react-query"

export function useTransactions(){

    const transactions_mutation = useCustomMutation(
        async({ skip, limit})=>{
            const response = await api.get(`/account/transactions?skip=${skip}&limit=${limit}`)
            return response
    })

    const fetchSingleTransaction = useCustomMutation(
        async({ transactionId })=>{
 
            const response = await api.get(`/account/transactions/${transactionId}`)
            return response
    })

    const verifyTransaction = useCustomMutation(async({ reference })=>{
            const response = await api.get(`/account/transaction/verify/${reference}`)
            return response
    })


    return {
        fetchTransactions:transactions_mutation.mutate,
        isLoading: transactions_mutation.isLoading,
        transactions: transactions_mutation.data,
        fetchSingleTransaction:fetchSingleTransaction.mutate,
        isFetching: fetchSingleTransaction.isPending,
        transaction:fetchSingleTransaction.data,
        verifyTransaction: verifyTransaction.mutateAsync,
        isVerifying:verifyTransaction.isPending
    }
}