import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";

export function useRequest() {
    const request = useCustomMutation(async(data)=>{
        return await api.post("/account/requests", data)
    })


    return{
        requestMoney: request.mutateAsync,
        isLoading: request.isPending
    }
}