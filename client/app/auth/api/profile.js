import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser() {
    const queryClient = useQueryClient()
    const  { data, isLoading } = useQuery({
        queryKey:["get-current-user"],
        queryFn: async()=>{
            const response = await api.get("/users/profile")
            return response
        },
        staleTime: 1000 * 60 * 15,
        retry: 1,
        
    })

    const transactionPinMutation = useCustomMutation(
        async (data) => {
           const resp =  await api.post("/users/pin/setup",data)

            queryClient.invalidateQueries("get-current-user")
            
           if(resp?.status === 200){
                document.getElementById('my_modal_1').close()
                showToast({type: resp?.data?.status, title:resp?.data?.msg})
           }
           else{
                showToast({type:resp?.status, title:resp?.title,  msg: resp?.msg })
           }
        },

    )

    const updatetransactionPinMutation = useCustomMutation(
        async (data) => {
           const resp =  await api.post("/users/pin/update", data)

            queryClient.invalidateQueries("get-current-user")

           if(resp?.status === 200){
                document.getElementById('my_modal_1').close()
                showToast({type: resp?.data?.status, title:resp?.data?.msg})

           }else{
            showToast({type:resp?.status, title:resp?.title,  msg: resp?.msg })
           }
        },

    )

    const logoutMutation = useCustomMutation(
        async()=>{
           await api.post("/auth/signout")
            window.location.reload()
        }
    )

    return {
        data: data?.data, 
        isLoading, 
        logout:logoutMutation.mutate, 
        isLogginOut:logoutMutation.isPending,
        setTransactionPin:transactionPinMutation.mutate,
        updatetransactionPin:updatetransactionPinMutation.mutate,
        isSubmitting:transactionPinMutation.isPending || updatetransactionPinMutation.isPending
    }
}