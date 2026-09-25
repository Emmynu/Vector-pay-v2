import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser() {
    const queryClient = useQueryClient()

    const  { data, isLoading, isError, refetch } = useQuery({
        queryKey:["get-current-user"],
        queryFn: async()=>{
            const response = await api.get("/account/profile")
            return response
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
        
    })

    const editProfileMutation = useCustomMutation(
        async (data) => {
            const resp = await api.post("/account/edit-profile", data)

            await queryClient.invalidateQueries({ queryKey: ["get-current-user"]})

        
            if(resp?.status === 200){
                showToast({type: resp?.data?.status, title:resp?.data?.msg})

            }
           
            return resp
        }
    )

    
    const logoutMutation = useCustomMutation(
        async(path)=>{
           await api.post("/auth/signout")
            window.location= path
        }
    )

    return {
        data: data?.data, 
        isLoading, 
        isError,
        refetch,
        editProfile:editProfileMutation.mutateAsync,
        isEditing: editProfileMutation.isPending,
        logout:logoutMutation.mutate, 
        isLogginOut:logoutMutation.isPending,
       
    }
}