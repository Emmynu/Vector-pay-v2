"use client"
import { X, Upload, RefreshCcw, AlertCircle } from "lucide-react"
import { bricolage, montserrat, quicksand } from "../../utils/font";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "../../supabase/supabase";
import { useUser } from "@/app/auth/api/profile";

function EditProfileModal({ id = 'my-modal-2', user }) {
    const fileRef = useRef()
    const [draft, setDraft] = useState({ avatar: "", firstName: user?.firstName || "", lastName: user?.lastName || "" })
    const [file, setHandleFile] = useState(null)
    const [error, setError] = useState(null)
    const { isEditing, editProfile } = useUser()
    const [isUploading, setIsUploading] = useState(false)

    // Sync draft values when user prop updates
    useEffect(() => {
        if (user) {
            setDraft((prev) => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]

        if (!allowedTypes.includes(file.type)) {
            setError("Please upload JPEG, JPG or PNG image.")
            setHandleFile(null)
        } else {
            setError("");
            const tempUrl = URL.createObjectURL(file)
            setDraft((prev) => ({ ...prev, avatar: tempUrl }))
        } 
    }, [file])

    const closeModal = () => {
        setError(null);
        setHandleFile(null);
        setDraft({
            avatar: "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || ""
        });

        document.getElementById(id).close();
    }

    async function handleProfileUpdate(e) {
        e.preventDefault()

        if (!draft.firstName || draft.firstName.trim().length < 3 || !draft.lastName || draft.lastName.trim().length < 3) {
            setError("First name and Last name must be at least 3 characters.")
            return;
        }

        setError("");
        let url = null

        if (file) {
            setIsUploading(true)
            const { url: uploadUrl, error: uploadError } = await uploadFile("avatars", file, `/avatar/${file.name}`)

            if (uploadError) {
                setError(uploadError)
                setIsUploading(false)
                return;
            }

            url = uploadUrl
            setIsUploading(false)
        }

        const data = {
            photoURL: url || user?.photoURL || null,
            firstName: draft.firstName.trim(),
            lastName: draft.lastName.trim()
        }

        const response = await editProfile(data)

        if (response.status === 200) {
            closeModal()

        }else{
            setError(response?.msg)
        }
    }

    return (  
        <dialog id={id} className="modal bg-black/60 backdrop-blur-xs p-2 ">
            <div className="modal-box bg-white shadow-2xl rounded-3xl w-full max-w-lgborder border-slate-100 text-slate-800">
                <form className="w-full" onSubmit={handleProfileUpdate}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className={`font-bold text-xl text-slate-900 ${montserrat.className}`} style={bricolage.style}>
                            Edit profile
                        </h3>
                        <button 
                            type="button" 
                            onClick={closeModal} 
                            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer !outline-none !border-none"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Inline Alert Banner */}
                    {error && (
                        <div 
                            className="mt-4 flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in duration-200"
                            style={quicksand.style}
                        >
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Profile Photo Section */}
                    <div className="mt-5 flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold overflow-hidden shrink-0 border border-slate-200">
                            {draft?.avatar ? (
                                <img src={draft?.avatar} alt="draft-profile" className="w-full h-full object-cover" />
                            ) : user?.photoURL ? (
                                <img src={user?.photoURL} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full text-white bg-[#03457c] font-bold text-xl flex items-center justify-center gap-0.5" style={bricolage.style}>
                                    <span>{user?.firstName?.[0]?.toUpperCase()}</span>
                                    <span>{user?.lastName?.[0]?.toUpperCase()}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <p className={`text-sm font-semibold text-slate-800 ${bricolage.className}`}>Profile photo</p>
                            <p className="text-[11px] text-slate-500" style={quicksand.style}>PNG or JPG. Square images work best.</p>
                            
                            <div className="mt-2 flex items-center gap-2">
                                <button 
                                    type="button"  
                                    className="px-4 py-1.5 transition-all border border-[#03457C] font-semibold text-xs text-[#03457C] hover:bg-[#03457C] hover:text-white rounded-full flex items-center gap-1.5 cursor-pointer disabled:opacity-50" 
                                    onClick={() => fileRef.current?.click()} 
                                    disabled={isEditing || isUploading} 
                                    style={bricolage.style}
                                >
                                    <Upload className="w-3.5 h-3.5" /> Upload
                                </button>
                                
                                {draft?.avatar && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDraft((d) => ({ ...d, avatar: "" }));
                                            setHandleFile(null);
                                        }}
                                        disabled={isEditing || isUploading}
                                        className="text-red-600 transition-all bg-red-50 hover:bg-red-100 font-semibold text-xs cursor-pointer px-4 py-1.5 rounded-full"
                                        style={bricolage.style}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setHandleFile(e.target.files?.[0])}
                            />
                        </div>
                    </div>

                    {/* Input Fields */}
                    <section className="mt-6 space-y-4">
                        <div className="flex flex-col w-full">
                            <label className={`${quicksand.className} font-semibold text-xs text-slate-700 mb-1`} htmlFor="firstName">
                                First Name
                            </label>
                            <input 
                                className="border border-slate-300 focus:border-[#03457C] focus:outline-none px-3 py-2 font-normal rounded-xl text-sm transition" 
                                value={draft?.firstName} 
                                onChange={(e) => {
                                    setDraft({ ...draft, firstName: e.target.value });
                                    if (error) setError("");
                                }} 
                                style={quicksand.style} 
                                name="firstName"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <label className={`${quicksand.className} font-semibold text-xs text-slate-700 mb-1`} htmlFor="lastName">
                                Last Name
                            </label>
                            <input 
                                className="border border-slate-300 focus:border-[#03457C] focus:outline-none px-3 py-2 font-normal rounded-xl text-sm transition" 
                                value={draft?.lastName} 
                                onChange={(e) => {
                                    setDraft({ ...draft, lastName: e.target.value });
                                    if (error) setError("");
                                }} 
                                style={quicksand.style} 
                                name="lastName"
                            />
                        </div>

                        <p className="text-xs text-slate-500 pt-1" style={quicksand.style}>
                            NIN can only be updated through identity verification.
                        </p>
                    </section>

                    {/* Modal Footer Actions */}
                    <div className="mt-4 flex items-center justify-end gap-3 pt-3 ">
                        <button 
                            type="button" 
                            disabled={isEditing || isUploading}  
                            className="btn bg-transparent border-2 border-[#03457C] text-[#03457C] font-medium hover:bg-slate-50 disabled:opacity-50 rounded-full shadow-sm" 
                            onClick={closeModal} 
                            style={bricolage.style}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn border-none shadow-md bg-[#03457C] hover:bg-[#02335c] text-white font-semibold rounded-full px-6 disabled:opacity-60 flex items-center gap-2" 
                            disabled={isEditing || isUploading} 
                            style={bricolage.style}
                        >
                            {isEditing || isUploading ? (
                                <>
                                    <RefreshCcw className="animate-spin w-4 h-4" />
                                    <span>{isEditing ? "Saving..." : "Uploading..."}</span>
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </button>
                    </div> 

                </form>   
            </div>
        </dialog>
    );
}

export default EditProfileModal;