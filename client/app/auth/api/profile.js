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
        staleTime: 1000 * 60 * 5,
        retry: 1,
        
    })

    const editProfileMutation = useCustomMutation(
        async (data) => {
            const resp = await api.post("/users/edit-profile", data)

            await queryClient.invalidateQueries({ queryKey: ["get-current-user"]})

        
            if(resp?.status === 200){
                document.getElementById('my-modal-2').close()
                showToast({type: resp?.data?.status, title:resp?.data?.msg})

            }
            else{
                document.getElementById('my-modal-2').close()
                showToast({type:resp?.status, title:resp?.title,  msg: resp?.msg })
            }
        }
    )

 

    const logoutMutation = useCustomMutation(
        async()=>{
           await api.post("/auth/signout")
            window.location="/auth/login"
        }
    )

    return {
        data: data?.data, 
        isLoading, 
        editProfile:editProfileMutation.mutate,
        isEditing: editProfileMutation.isPending,
        logout:logoutMutation.mutate, 
        isLogginOut:logoutMutation.isPending,
       
    }
}