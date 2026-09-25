"use client"

import Link from "next/link";
import Logo from "../logo";
import Image from "next/image";
import image from "../../images/credits.jpg"
import "@/app/globals.css"
import { useRegister } from "@/app/auth/api/register";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { User, Mail } from "lucide-react"
import CustomPasswordInput from "./customInput";
import { bricolage, quicksand } from "../../utils/font";



function Register() {
    const { register, isPending:isLoading } =  useRegister()
    const [formData, setFormData] =  useState({firstName: "", lastName: "", email:"".toLowerCase(), password: ""})
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const pathname = usePathname()

    const isAdmin = pathname.includes("admin") 

    function handleFormData(e) {
        const { name, value } = e.target

        setFormData(prev=>({
            ...prev,
            [name]:value.trim()
        }))
    }


    async function handleRegister(e) {
        const data = {
            ...formData,
            role: isAdmin ? "admin" : "user"
        }
        
       
        e.preventDefault()
        register(data)        
    }

   return ( 
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center gap-5 ">
           <section className="col-span-1 flex flex-col mt-[15%] lg:mt-0 items-center mx-2">
                <section >
                   <Logo />
                </section>
                <section className="mt-5  p-4 flex flex-col items-center">
                    <article className="text-center">
                        <h2 className="font-semibold text-xl" style={bricolage.style}>Create a VectorPay Account</h2>
                        <p className={`text-[12.5px] opacity-90 tracking-wide`} style={quicksand.style}>Set up your account in minutes.</p>
                    </article>
                   
                    <article className="mt-4">
                       <form onSubmit={handleRegister}>

                        <section>
                            <h2 className=" text-[12px] tracking-wide mb-0.5" style={quicksand.style}>Fullname: </h2>
                            <div className="flex">
                                <label className="input validator bg-input mr-2">
                                    <User className="w-3.5 h-3.5 text-gray-600"/>
                                    <input
                                        type="text"
                                        required
                                        name="firstName"
                                        onChange={handleFormData}
                                        value={formData.firstName}
                                        placeholder="Firstname"
                                        pattern="[A-Za-z][A-Za-z0-9]*"
                                        minLength="3"
                                        maxLength="30"
                                        disabled={isLoading}
                                        title="Only letters, numbers or dash"
                                        className="text-[13px]" 
                                        style={quicksand.style}
                                    />
                                </label>
                               
                                <label className="input validator bg-input">
                                    <User className="w-3.5 h-3.5 text-gray-600"/>

                                    <input
                                        type="text"
                                        required
                                        name="lastName"
                                        onChange={handleFormData}
                                        value={formData.lastName}
                                        disabled={isLoading}
                                        placeholder="Lasttname"
                                        pattern="[A-Za-z][A-Za-z0-9]*"
                                        minLength="3"
                                        maxLength="30"
                                        title="Only letters, numbers or dash"
                                        className="text-[13px]" 
                                        style={quicksand.style}
                                    />
                                </label>
                                

                                
                            </div>

                           <div className="mt-2.5">
                                <h2 className=" text-[12px] tracking-wide mb-0.5" style={quicksand.style}>Email Address: </h2>
                                <label className="input validator bg-input  w-full">
                                    <Mail className="w-3.5 h-3.5 text-gray-600"/>

                                    <input type="email" placeholder="mail@site.com" required name="email" onChange={handleFormData} value={formData.email}className="text-[13px]" style={quicksand.style}/>
                                </label>
                                <div className="validator-hint hidden mb-0.5">Enter valid email address</div>
                           </div>

                           <CustomPasswordInput isPasswordVisible={isPasswordVisible} setIsPasswordVisible={setIsPasswordVisible} value={formData.password} onChange={handleFormData} isLoading={isLoading} 
                           />
                        </section>

                       
                        <button type="submit" disabled={isLoading} className="btn outline-none border-none bg-[#03457C] text-sm py-6 rounded-md my-2.5 w-full text-white disabled:bg-[#03457C]/60 " style={bricolage.style}>
                        {isLoading ? <h2 className="flex items-center"><span className="loading loading-xs loading-spinner mr-1"></span>Loading...</h2> : "Continue"}
                    </button>
                    </form>
                    </article>
                <h2 className="text-center font-semibold mt-0.5 text-[13px]" style={quicksand.style}>Already have an account? <Link href={isAdmin ? "/admin/login" : "/auth/login"} className="italic text-[#03457C] underline-offset-2 underline">Login</Link></h2>
                </section>
           </section>


            <section className="col-span-2 cursor-pointer select-none hidden lg:block">
                <Image src={image}  alt="auth-image" loading="eager" />
            </section>

        </main>
      
     );
}

export default Register;