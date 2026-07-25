"use client"
import { X, Upload } from "lucide-react"
import { bricolage, montserrat } from "../utils/font";
import { useEffect, useRef, useState } from "react";
import { showToast } from "../toast/sonner";
import { supabase } from "../supabase/supabase";


function EditProfileModal({ id, user }) {
    const fileRef = useRef()
    const [draft, setDraft] = useState({avatar: "", firstName: user?.firstName, lastName: user?.lastName})
    const [file, setHandleFile] = useState(null)
    const [error, setError] = useState(null)
  
    

    useEffect(()=>{
        // generate a temp link for photoURL
        const allowedTypes = ["image/jpeg", "image/png", "image/png"]

        if(!allowedTypes.includes(file?.type)){
           
            setError("Please upload JPEG, JPG or PNG image.")
            setHandleFile(null)

            setTimeout(() => {
                setError("")
            }, 2000);
        }
        else{
            const tempUrl =  URL.createObjectURL(file)
            setDraft((prev)=> ({ ...prev, avatar: tempUrl}))
        }
    },[file])
    
    
    async function handleProfileUpdate(e) {
        e.preventDefault()
        if (!draft?.avatar || !draft.firstName || !draft.lastName) {
            setError("Please provide a valid input.")

        }

        // console.log(file);
        
       else{
            const { data, error } = await supabase.storage.from("avatars").upload(`/avatar/${file.name}`, file,{upsert:true})

            if(error){
                setError(error)
            }

            if(data){
                const url = await supabase.storage.from("avatars").getPublicUrl(`/avatar/${file.name}`)
                console.log(url);
                
                // url to db
            }
       }

       setTimeout(() => {
            setError("")
        }, 2000);
    }

    return (  
        
        <div className="modal bg-black/60 border border-slate-400" id={id} popover="true">
            <div className="modal-box bg-white">
                <form className=" rounded-2xl  w-full max-w-lg px-0 md:px-6 py-4" onSubmit={handleProfileUpdate}>
                    <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-xl ${montserrat.className}`}>Edit profile</h3>
                        <button type="button" popoverTarget={id} popoverTargetAction="hide" className="cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                   </div>
                    <div className="mt-5 flex items-center gap-4">
                        <div className="relative w-20 transition-all h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-content text-2xl font-bold overflow-hidden">
                            {draft?.avatar ? <img src={draft?.avatar} alt="draft-profile" className="w-22 h-22 rounded-full"/>:
                             (
                                user?.photoURL ? (
                                <img src={user?.photoURL} alt="preview" className="w-22 h-22 rounded-full " />
                                ) : (
                                // "initials"
                                <div className="w-22 h-22 rounded-full text-white bg-[#03457c] font-bold text-3xl flex items-center justify-center">
                                    <h2>{user?.firstName.split(" ").map((s) => s[0]).join("").toUpperCase()}</h2>
                                    <h2>{user?.lastName.split(" ").map((s) => s[0]).join("").toUpperCase()}</h2>
                            </div>
                                )
                            )}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${bricolage.className}`}>Profile photo</p>
                            <p className="text-xs opacity-60">PNG or JPG. Square images work best.</p>
                            
                            <div className="mt-2 flex gap-2">
                                <button type="button"  className="btn btn-sm transition-all btn-outline border-2 font-medium hover:bg-[#03457C] hover:text-[#fff] tracking-wide border-[#03457c] text-[#03457C] rounded-full" onClick={()=>fileRef.current.click()}>
                                    <Upload className="w-3.5 h-3.5" /> Upload
                                </button>
                                {draft?.avatar && (
                                <button
                                type="button"
                                onClick={() => setDraft((d) => ({ ...d, avatar: "" }))}
                                className="text-red-600 transition-all hover:bg-red-200  font-medium text-sm cursor-pointer hover:px-5 py-2 rounded-full"
                                >
                                Remove
                                </button>
                                )}
                                                           
                            </div>
                            <h2 className="my-1.5 text-[11px] font-medium text-red-600">{error}</h2>
                            <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setHandleFile(e.target.files?.[0])}
                            />
                        </div>
                    </div>
                <section className="mt-7 space-y-4">
                    
                    <div className="flex flex-col w-full ">
                        <label className="text-xs mb-1" style={{fontWeight: 350}} htmlFor="firstName">First Name</label>
                        <input className="border px-2 py-1.5 rounded-md text-sm " value={draft?.firstName} onChange={(v) => setDraft({ ...draft, firstName: v.target.value })} name="firstName"/>
                    </div>

                    <div className="flex flex-col w-full ">
                        <label className="text-xs mb-1" style={{fontWeight: 350}} htmlFor="lastName">Last Name</label>
                        <input className="border px-2 py-1.5 rounded-md text-sm " value={draft?.lastName} onChange={(v) => setDraft({ ...draft, lastName: v.target.value })} name="lastName"/>
                    </div>

                    <p className="text-xs opacity-60 pt-1">
                    NIN can only be updated through identity verification.
                    </p>
                </section>

                <div className="mt-6 flex gap-3 justify-end">
                    <button type="button"  className="btn rounded-full border-none " popoverTarget={id} popoverTargetAction="hide">
                    Cancel
                </button>
                <button type="submit" className="btn bg-[#03457C] border-none rounded-full">
                Save changes
                </button>
                </div> 
                </form>
            </div>
        </div>

    );
}

export default EditProfileModal;