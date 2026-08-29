import axios from "axios";
import { showToast } from "../toast/sonner";


export const api =  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,

})

export const refreshApi =  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,

})


api.interceptors.response.use(
    (resp) =>resp,
    async (error) =>{
        const { statusText, data } = error?.response
        
        if(error.status === 500 ){
            showToast({
                type: data?.status || "error",
                title: data.msg || "Internal Server Error",
                msg: `ERR_${statusText||"internal server error"}_${error?.status}: ${data?.description || "An error occurred Please try again later."}`,
            })
        }

        if(error.status === 429){
            showToast({
                type: data?.status || "error",
                title: data.msg || "Too Many Request",
                msg: `ERR_${statusText}_${error?.status}: ${data?.description || "An error occurred Please try again later."}`,
             
            })
        }
    
        if(error?.status === 422){
            const errorMessage = data?.description.map(error=> error).join(", ")
            
            return {
                status:  data?.status,
                title: data.msg || "Validation Error",
                msg: `ERR_${statusText}_${error?.status}: ${errorMessage}`
            }
        }
    
       if(error?.status === 401){
     
            if(error?.config?.url?.includes("/auth/otp-verify")){
                window.location = "/auth/login"
            };

            if(error?.config?.url?.includes("/auth/login")){
                return {
                    status: data?.detail?.status,
                    title: data?.detail?.msg,
                    msg: `ERR_${statusText}_${error.status}: ${data?.detail?.description}`
                }
            }
            
            
               if(!error.config._retry){
                    error.config._retry = true
                    // make request to /auth/refresh

                    try {
                        const resp = await refreshApi.post("/auth/refresh")
                            
                        return api(error?.config)

                    } catch (error) {
                        window.location = "/auth/login"  
                        return Promise.reject(error)
                    }
                }
            
       }
        

        return {
            status:  data?.detail?.status,
            title: data?.detail?.msg,
            msg: `ERR_${statusText}_${error?.status}: ${data?.detail?.description}`
        }
    }
)
