"use client"

import Link from "next/link";
import Logo from "@/app/libs/ui/logo";
import Image from "next/image";
import image from "@/app/libs/images/credits.jpg"
import "../../globals.css"
import { RefreshCcw } from "lucide-react"
import { useRegister } from "../api/register";
import { useEffect, useState } from "react";
import { generateUserName as userNameFunc } from "@/app/libs/utils/utils";






function Register() {
    const { registerUser, isPending:isLoading } =  useRegister()
    const [formData, setFormData] =  useState({firstName: "", lastName: "", userName: "", email:"".toLowerCase(), password: ""})
    

    useEffect(()=>{
       generateUserName()
    },[formData.firstName, formData.lastName])


    function handleFormData(e) {
        const { name, value } = e.target

        setFormData(prev=>({
            ...prev,
            [name]:value.trim()
        }))
    }


    function generateUserName() {
        if(formData.firstName.length >= 3 && formData.lastName.length >= 3){
            const timer = setTimeout(() => {
                const generatedUserName = userNameFunc(formData.firstName, formData.lastName)
                setFormData(prev=>({
                    ...prev,
                    userName: generatedUserName
                }))
            }, 600);

            return ()=> clearTimeout(timer)
        }
    }

    async function handleRegister(e) {
        e.preventDefault()
        registerUser(formData)        
    }

   return ( 
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center gap-5 ">
           <section className="col-span-1 flex flex-col mt-[15%] lg:mt-0 items-center mx-2">
                <section >
                   <Logo />
                </section>
                <section className="mt-5  p-4 flex flex-col items-center">
                    <article className="text-center">
                        <h2 className="font-semibold text-2xl">Create a VectorPay Account</h2>
                        <p className="text-sm font-thin">Set up your account in minutes.</p>
                    </article>
                   
                    <article className="render-container mt-4">
                       <form onSubmit={handleRegister}>

                        <section>
                            <h2 className="font-thin text-sm mb-0.5">Fullname: </h2>
                            <div className="flex">
                                <label className="input validator bg-input mr-2">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                        >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                        </g>
                                    </svg>
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
                                        title="Only letters, numbers or dash"
                                    />
                                </label>
                               
                                <label className="input validator bg-input">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                        >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                        </g>
                                    </svg>
                                    <input
                                        type="text"
                                        required
                                        name="lastName"
                                        onChange={handleFormData}
                                        value={formData.lastName}
                                        placeholder="Lasttname"
                                        pattern="[A-Za-z][A-Za-z0-9]*"
                                        minLength="3"
                                        maxLength="30"
                                        title="Only letters, numbers or dash"
                                    />
                                </label>
                                

                                
                            </div>

                           {formData.userName && <div className="flex text-sm mt-1 font-medium  text-[#03457c]">
                                <h2 className="flex mr-2 ">username: {formData.userName}</h2>
                                <div ><RefreshCcw className="w-4 cursor-pointer" onClick={generateUserName}/></div>
                            </div>}

                           <div className="mt-2.5">
                                <h2 className="font-thin text-sm mb-0.5">Email Address: </h2>
                                <label className="input validator bg-input  w-full">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                        >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                        </g>
                                    </svg>
                                    <input type="email" placeholder="mail@site.com" required name="email" onChange={handleFormData} value={formData.email}/>
                                </label>
                                <div className="validator-hint hidden mb-0.5">Enter valid email address</div>
                           </div>

                           <div className="mt-2.5">
                            <h2 className="font-thin text-sm mb-0.5">Password: </h2>   
                            <label className="input validator  bg-input w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="password"
                                    required
                                    name="password"
                                    onChange={handleFormData}
                                    // value={formData.password}
                                    placeholder="Password"
                                    minLength="8"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                />
                            </label>
                            <p className="validator-hint hidden mb-0.5">Must be more than 8 characters, including<br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter</p>
                            </div>
                        </section>

                       
                        <button type="submit" disabled={isLoading} className="btn outline-none border-none bg-[#03457C] text-base py-6 rounded-md my-2.5 w-full text-white disabled:bg-[#03457C]/60 ">
                        {isLoading ? <h2 className="flex items-center"><span><RefreshCcw className="animate-spin w-4 mr-1"/></span>Loading...</h2> : "Continue"}
                    </button>
                    </form>
                    </article>
                <h2 className="text-center font-medium mt-0.5">Already have an account? <Link href={"/auth/login"} className="italic text-[#03457C] underline-offset-2 underline">Login</Link></h2>
                </section>
           </section>


            <section className="col-span-2 cursor-pointer select-none hidden lg:block">
                <Image src={image}  alt="auth-image" loading="eager" />
            </section>

        </main>
      
     );
}

export default Register;