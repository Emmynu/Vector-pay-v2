import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";

export function useRequestsAction() {
    const action = useCustomMutation(async(args)=>{
        return await api.patch(`/account/requests/${args?.requestId}/${args?.actionType}`,args?.data)
    })

    return{
        action: action.mutateAsync,
        isLoading: action.isPending
    }
}