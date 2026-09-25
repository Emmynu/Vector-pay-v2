import { url } from "./get-transactions"
import { api } from "@/app/libs/interceptors/api-client"


export function useExport() {
    const exportTransactions = async()=>{
        const transactionsBlob =  await api.get(`${url}/export`, {
            responseType: "blob",
            
        })
        return transactionsBlob
    }

    
    return{
        exportTransactions,
    
    }

}