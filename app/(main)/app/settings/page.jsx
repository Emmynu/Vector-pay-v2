"use client"

import { useEffect, useRef, useState } from "react"
import "../../../styles/settings.css"
import { findUser } from "../../../actions/auth"
import { onAuthStateChanged, updatePassword } from "firebase/auth"
import { auth } from "../../../../firebase/firebase-client"
import { toast, Toaster } from "sonner"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { updatePasswordSchema } from "../../../../zod-schema"


const poppins = Poppins({
    subsets: ["latin"],
    weight: "700"
})

export default function Settings() {
    const [uid, setUid] = useState(null)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState("")
    const [password, setPassword] = useState({newPassword: "", confirmPassword: ""})
    const modalRef = useRef(null)

    useEffect(()=>{
        onAuthStateChanged(auth, user => setUid(user?.uid))
    },[])

    useEffect(()=>{
       async function getUser() {
            setIsLoading(true)
          if (uid) {
            const currentUser =  await findUser(uid)
            if (currentUser?.error) {
                toast.error(currentUser?.error)
            } else {
                setIsLoading(false)
                setUser(currentUser)
            }
          }
        }
        getUser()
    },[uid])


    function handleInput(e) {
        const {name,value} = e.target
        setPassword((prev)=>({
            ...prev, [name]:value
        }))
    }
    async function handlePasswordChange() {
        setIsPending(true)
       if (password.newPassword && password.confirmPassword) {
        if (password.newPassword === password.confirmPassword) {
            const newPassword = updatePasswordSchema.safeParse(password)
            if (!newPassword?.success) {
                newPassword.error.errors.map(error=>{
                  setError(error?.message)
                  setIsPending(false)
                })
            } else {
                // update the password
                
                    onAuthStateChanged(auth, user=>{
                        updatePassword(user, newPassword?.data?.newPassword).then(res=>{
                          setIsPending(false)
                          if (modalRef.current) {
                                modalRef.current.close()
                          }
                          toast.success("Password Updated Successfully")
                        }).catch(err=>{
                            setIsPending(false)
                            setError(err?.message)
                        })        
                    })
            }
        } else {
          setError("Passwords must match")
         setIsPending(false)
        }
       } else {
         setError("Password should not be more than 6 numerical characters (numbers)")
         setIsPending(false)
       }

       setTimeout(() => {
            setError("")
       }, 2000);
    }


    
    return (
        <main className="settings-container">

           <section>
                <div className="tabs tabs-border tabs-sm nmd:tabs-md my-9 mx-5 md:m-7 ">
                    <input type="radio" name="my_tabs_2" className="tab " aria-label="Profile" defaultChecked/>
                    <div className="tab-content border-base-300 bg-base-100 ">
                        <h2 className="settings-label">Account  Information</h2>
                        {isLoading ? 
                        <article className="loading-container">
                            <section>
                                <div></div>
                                <div ></div>
                            </section>
                            <section>
                                <div></div>
                                <div ></div>
                            </section>
                            <section>
                                <div></div>
                                <div ></div>
                            </section>
                            <section>
                                <div></div>
                                <div ></div>
                            </section>
                            <section>
                                <div></div>
                                <div ></div>
                            </section>
                        </article> : <section className="loading-container user-info-container">
                            <h3>
                                <span className={poppins.className}>Username: </span>
                                <span>{`${user?.firstName} ${user?.lastName}`}</span>
                            </h3>
                            <h3>
                                <span className={poppins.className}>Wallet Balance: </span>
                                <span>NGN{user?.balance}</span>
                            </h3>
                           
                            <h3>
                                <span className={poppins.className}>Email Address: </span>
                                <span>{user?.email}</span>
                            </h3>

                            <h3>
                                <span className={poppins.className}>BVN: </span>
                                <span>Click here to [ <Link href={"*"}>Link your bvn</Link> ]</span>
                            </h3>

                            
                            <h3>
                                <span className={poppins.className}>Level: </span>
                                <span>Tier 1 [ <Link href={"*"}>Upgrade your account </Link> ]</span>
                            </h3>
                        </section>}
                    </div>

                    <input type="radio" name="my_tabs_2" className="tab" aria-label="Security"  />
                    <div className="tab-content border-base-300 bg-base-100 ">
                        <h2 className="settings-label">Password & Pin</h2>
                        <section className="update-info-container loading-container">
                            <div>
                                <article>
                                    <h2 className={poppins.className}>Update Password</h2>
                                    <h4>Change your old password to a new one</h4>
                                </article>
                                <button onClick={() => document.querySelector("#password_modal").showModal()}>Change Password</button>
                            </div>
                            <div>
                                <article>
                                    <h2 className={poppins.className}>Update Transaction Pin</h2>
                                    <h4>Change your old transaction pin to a new one</h4>
                                </article>
                                <button>Change transaction pin</button>
                            </div>
                            <div>
                                <article>
                                    <h2 className={poppins.className}>Reset Transaction Pin</h2>
                                    <h4>Forgot your transaction pin. Reset your pin</h4>
                                </article>
                                <button>Reset transaction pin</button>
                            </div>
                        </section>
                    </div>

                    {/* Password modal */}
                    <dialog id="password_modal" className="modal modal-bottom md:modal-middle" ref={modalRef}>
                        <div className="modal-box p-10">
                            <form method="dialog">
                                <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-1">✕</button>
                            </form>
                            <div className="modal-amount-container">
                                <article className="mb-7">
                                    <h2 >Update Password</h2>
                                </article>
                                
                            <section className="">
                                <h2 className="text-sm mb-1.5">New Password: </h2>
                                <label className="settings-form-label" >
                                    <svg className="h-[1em] opacity-50 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                                        type="number"
                                        name="newPassword"
                                        required
                                        placeholder="Password"
                                        value={password.newPassword}
                                        onChange={handleInput}
                                        className="ml-1"
                                        min={6}
                                        maxLength={6}
                                        title="Password should not be more than 6 numerical characters (numbers)"
                                    />
                                </label>
                                   

                                    <article className="mt-4 flex flex-col" style={{width: "100%"}}>
                                        <h2 className="text-sm mb-1.5">Confirm Password: </h2>
                                        <label className="settings-form-label"  >
                                            <svg className="h-[1em] opacity-50 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                                                type="number"
                                                name="confirmPassword"
                                                required
                                                className="ml-1"
                                                placeholder="Password"
                                                value={password.confirmPassword}
                                                onChange={handleInput}
                                                title="Password should not be more than 6 numerical characters (numbers)"
                                            />
                                        </label>
                                        {error && <p className="text-red-600 text-sm font-medium mt-1">{error}</p>}
                                </article>

                                  
                                <button onClick={handlePasswordChange} disabled={(user === null) || (isPending)}>{isPending ? <span className="loading loading-bars"></span> :<span>Continue</span>}</button>
                            </section>
                            </div>
                        </div>
                    </dialog>
                </div>
           </section>
           <Toaster richColors closeButton position="bottom-right"/>
        </main>
        
    )
}