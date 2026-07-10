"use client"

import Link from "next/link";
import Logo from "@/app/libs/ui/logo";
import Image from "next/image";
import image from "@/app/libs/images/credits.jpg"
import "../../globals.css"
import { useLogin } from "../api/login";
import { RefreshCcw } from "lucide-react"





function Login() {
   const { login, isLoading } = useLogin()

    async function handleLogin(e) {
        e.preventDefault()

        const { email, password } =  Object.fromEntries(new FormData(e.currentTarget))

        const data = {
            email: email.trim().toLowerCase(),
            password: password.trim()
        }
 
        login(data)
        
        
    }

   return ( 
        <main className="grid grid-cols-1  lg:grid-cols-3 items-center gap-12">
           <section className="col-span-1 flex flex-col mt-[15%]  items-center lg:mt-0 mx-3">
                <section className="">
                   <Logo />
                </section>
                <section className="mt-3 p-1.5 lg:p-4 flex flex-col w-full">
                    <article className="text-center">
                        <h2 className="font-semibold text-2xl">Account Login</h2>
                        <p className="text-sm font-thin">Welcome back! Enter your login details.</p>
                    </article>
                   
                    <article className="mt-2.5  px-6 md:px-12">
                       <form action=""  className="flex flex-col" onSubmit={handleLogin}>
                        <div className="mt-2.5 ">
                            <h2 className="font-thin mb-1 text-sm">Email Address: </h2>
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
                                <input type="email" placeholder="mail@site.com" required name="email" />
                            </label>
                            <div className="validator-hint hidden mb-0.5">Enter valid email address</div>
                        </div>

                        <div className="mt-2.5">
                            <h2 className="font-thin mb-1 text-sm">Password: </h2>
                            <label className="input validator bg-input w-full">
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
                                placeholder="Password"
                                minLength="8"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                            />
                            </label>
                            <p className="validator-hint hidden mb-0.5">Must be more than 8 characters, including<br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter</p>
                        </div>

                        <Link href={"/auth/forgot-password"} className="text-right hover:underline mt-1.5 italic text-[#03457c] font-medium  text-sm">Forgot Password?</Link>

                    <button type="submit" disabled={isLoading} className="btn outline-none border-none bg-[#03457C] text-base py-6 rounded-md my-2.5 w-full text-white disabled:bg-[#03457C]/60 ">
                        {isLoading ? <h2 className="flex items-center"><span><RefreshCcw className="animate-spin w-4 mr-1"/></span>Loading...</h2> : "Continue"}
                    </button>

                    </form>
                    </article>
                <h2 className="text-center font-medium mt-0.5">Don't have an account yet? <Link href={"/auth/register"} className="italic text-[#03457C] underline-offset-2 underline">Register</Link></h2>
                </section>
           </section>


            <section className="col-span-2 cursor-pointer select-none hidden lg:block">
                <Image src={image}  alt="auth-image" loading="eager" />
            </section>

        </main>
      
     );
}

export default Login;