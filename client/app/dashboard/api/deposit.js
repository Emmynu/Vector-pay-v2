import { api } from "@/app/libs/interceptors/api-client";
import { showToast } from "@/app/libs/toast/sonner";
import useCustomMutation from "@/app/libs/utils/custom-mutation";

export function useDeposit(){
    const depositMutation = useCustomMutation(async({ amount })=>{
        const data ={
            amount
        }
        
       const response =  await api.post("/account/deposit/initialize", data)

       if(response?.status === 200){
           return response.data
          
       }
       else{
            document.getElementById("amount-modal").close()
            showToast({ type: response.status, title:response?.title,msg: response?.msg }) 
       }
       
    })

 

    return{
        deposit:depositMutation.mutateAsync,
        isDepositing:depositMutation.isPending
    }
}