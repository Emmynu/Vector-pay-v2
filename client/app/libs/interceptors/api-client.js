import axios from "axios";
import { showToast } from "../toast/sonner";


export const api =  axios.create({
    baseURL: "/api/v1/",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,

})

export const refreshApi =  axios.create({
    baseURL: "/api/v1/",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,

})


api.interceptors.response.use(
    (resp) =>resp,
    async (error) =>{
        console.log();
        
        if(error.status === 500 || error?.response?.status === 500){
            showToast({
                type: "error",
                title: "Oops...something went wrong!",
                msg: `ERR_${error?.response?.statusText}_${error?.response?.status}: Please try again later or contact support.`,
             
            })
        }
    
        if(error?.status === 422){
            return {
                status:  error?.response?.data?.status,
                title:"Oops...something went wrong!",
                msg: `ERR_${error?.response?.statusText}_${error?.response?.status}: ${error?.response?.data?.msg}`
            }
        }
    
       if(error?.status === 401){
     
            if(error?.config?.url?.includes("/auth/otp-verify")){
                window.location = "/auth/login"
            };

            if(error?.config?.url?.includes("/auth/login")){
                return {
                    status: error?.response?.data?.detail?.status,
                    title: error?.response?.data?.detail?.msg,
                    msg: `ERR_${error?.response?.statusText}_${error?.response?.status}: ${error?.response?.data?.detail?.description}`
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
            status:  error?.response?.data?.detail?.status,
            title: error?.response?.data?.detail?.msg,
            msg: `ERR_${error?.response?.statusText}_${error?.response?.status}: ${error?.response?.data?.detail?.description}`
        }
    }
)
