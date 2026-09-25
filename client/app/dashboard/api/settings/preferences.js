import { api } from "@/app/libs/interceptors/api-client";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQueryClient } from "@tanstack/react-query";

export function usePreferences(){
    const query = useQueryClient()
    const updatePreferences = useCustomMutation(async ({ key, value }) => {

        const response = await api.patch(`/account/preferences/${key}/update`,{
            value
        })
 
        query.refetchQueries({ queryKey: ["get-current-user"]})
        return response
    })

    return {
        updatePreferences:updatePreferences.mutateAsync,
        isUpdating:updatePreferences.isPending
    }
}