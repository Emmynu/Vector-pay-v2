"use client"
import Image from "next/image";
import Logo from "../../images/logo.png"
import alertIcon from "../../images/alert.png"
import credits from "../../images/credits.jpg"
import eye from "../../images/eye.png"
import invisble from "../../images/invisible.png"
import "../../styles/auth.css"
import  { Poppins,  Roboto } from "next/font/google"
import { emailSchema, nameSchema, passwordSchema } from "../../../zod-schema";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword, deleteUser, getIdToken, sendEmailVerification, updateProfile } from "firebase/auth";
import { toast, Toaster } from "sonner";
import { auth } from "../../../firebase/firebase-client";
import { verifyToken } from "../../actions/auth";


 const poppins = Poppins({
    subsets: ["latin"],
    weight: "800"
})

 const roboto = Roboto({
    subsets: ["latin"],
    weight: "300"
})


function Register() {
    const [steps, setSteps] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({email: "", password: "", firstName: "", lastName: ""})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    function handleInputChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    function handleFirstStep() {
        //    using zod to verify the input 
        const res = emailSchema.safeParse(formData)
       if (res.success) {
           setSteps(2)
            
       } else {
           toast.error("Invalid Input")
       }
    }

    function handleSecondStep() {
        const res = passwordSchema.safeParse(formData)
        if (res?.success) {
            setSteps(3)
        } else {
           (res?.error.errors.map(error=>{
                toast.error(error?.message);
                
            }));
            
        }
    }

    async function handleRegister() {
        setIsLoading(true)
        const res = nameSchema.safeParse(formData)
        const { email , password, lastName, firstName} = formData
        if (!formData.lastName || !formData.firstName) {
            toast.error("Invalid Input")
        } else {
            if (res?.success) {
                try {
                   // create a new user
                    const { user } =  await createUserWithEmailAndPassword(auth, email, password)
                    await updateProfile(user,{
                        displayName: `${firstName} ${lastName}`,
                        photoURL: "null"
                    })
                    //get & verify  jwttoken 
                    const token = await getIdToken(user)
                    const result = await verifyToken(token, firstName, lastName )
                    if (result?.error) {
                        toast.error(result?.error)
                        await deleteUser(user)
                    } else {
                        //send verification link
                        await sendEmailVerification(user)
                        setIsLoggedIn(true)
                        toast.success("Authentication sucessful");
                        setTimeout(() => {
                            window.location = ("/login")
                        }, 2000);
                    }
                } catch (error) {
                    toast.error(error?.message)
                }
            } else {
                res.error.errors.map(error=>{
                    toast.error(error?.message)
                })
            }   
        }        
        setIsLoading(false)
    }

    const render = () => {
        if (steps === 1) {
            return (
                <div className="step-container">
                    
                    <h2 className={roboto.className}>Email Address: </h2>
                    <label className=" flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input type="email" placeholder="Email"  name="email" value={formData.email} onChange={handleInputChange} />
                    </label>
                    <button onClick={handleFirstStep} >Continue</button>
                </div>
            )
        }else if (steps === 2) {
            return(
                <div className="step-container">
                    <div className="alert-container">
                        <Image src={alertIcon} alt="alert-image"/>
                        <h2> Password should contain 6 numerical(numbers) characters</h2>
                    </div>
                    <h2>Password: </h2>
                    <label className=" flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                        </svg>
                        <input type={!showPassword ? "password": "text"} className="grow" placeholder="Password" value={formData.password} name="password" onChange={handleInputChange} />
                        <Image src={!showPassword ? eye : invisble} alt="eye" className="w-4 cursor-pointer" onClick={()=>setShowPassword(!showPassword)}/>
                    </label>
                    <button onClick={handleSecondStep}>Next</button>
                </div>
            )
        } 
        
        else if(steps === 3){
            return (
                <div >
                   <section className="step-container">
                  {isLoggedIn &&  <div className="alert-container">
                        <Image src={alertIcon} alt="alert-image"/>
                        <h2>An email verification link has been sent to your inbox.</h2>
                    </div>}
                    <label className=" flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input type="text" className="grow" placeholder="First Name" name="firstName" value={formData.firstName}  onChange={handleInputChange}/>
                        </label>
                   </section>

                    <section className="step-container mt-3">
                    <label className=" flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input type="text" className="grow" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange}/>
                        </label>
                   </section>

                   <button onClick={handleRegister} disabled={isLoading} ><span className={isLoading ? "loading loading-bars loading-sm mr-2": ""}></span>{isLoading ? "": "Create Account"}</button>

                </div>
            )
        }
    } 
    

    return ( 
        <main className="auth-container">
            {/* logo section */}
           <section className="auth-form-container">
            <section className="auth-logo-container">
                    <Image src={Logo} width={40} height={40} alt="Logo"/>
                    <h2 className="font-sans font-bold">VectorPay</h2>
                </section>
                <section className="form-container">
                    <article className="auth-label-container">
                        <h2 className={poppins.className}>Create a VectorPay Account</h2>
                        <p className={roboto.className}>Set up your account in minutes.</p>
                    </article>
                   
                    <article className="render-container">
                        {render()}
                    </article>
                <article className="auth-footer-container"><h2 className={roboto.className}>Already have an account? <Link href={"/login"}>Login</Link></h2></article>

                </section>
           </section>
            <section className="auth-img-container">
                <Image src={credits}  alt="auth-image"/>
            </section>

            <Toaster richColors closeButton position="bottom-right"/>
        </main>
      
     );
}

export default Register;