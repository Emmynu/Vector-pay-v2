import axios from "axios";

export const api =  axios.create({
    baseURL: "/api/v1/",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})


api.interceptors.response.use(
    (resp) =>resp,
    async (error) =>{

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
       }
        

        return {
            status:  error?.response?.data?.detail?.status,
            title: error?.response?.data?.detail?.msg,
            msg: `ERR_${error?.response?.statusText}_${error?.response?.status}: ${error?.response?.data?.detail?.description}`
        }
    }
)
