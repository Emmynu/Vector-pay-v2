import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";

export function useBroadcast() {
    const broadcast = useCustomMutation(async (data) => {
        const response = await api.post(`/admin/broadcasts`,data)
        if(response?.status === "error"){
            showToast({ type: response?.status || "error", title: response?.title, msg:response?.msg})
        }else{
            showToast({ type: response?.data?.status || "success" , title: response?.data.msg || `New broadcast mail sent successfuly`})
        }
        console.log(response);
        
        return response
    })

    return{
        broadcast:broadcast.mutateAsync,
        isBroadcasting:broadcast.isPending
    }
}