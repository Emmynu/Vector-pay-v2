"use client"
import { X, Camera, Upload } from "lucide-react"
import { bricolage, montserrat } from "../utils/font";

function EditProfileModal({ id, user }) {
    return (  
        
        <div className="modal bg-black/60 border border-slate-400" id={id} popover="true">
            <div className="modal-box bg-white">
                <form className=" rounded-2xl  w-full max-w-lg px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-xl ${montserrat.className}`}>Edit profile</h3>
                        <button type="button" popoverTarget={id} popoverTargetAction="hide" className="cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                   </div>
                    <div className="mt-5 flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-content text-2xl font-bold font-display overflow-hidden">
                            {/* {draft.avatar ? (
                            <img src={draft.avatar} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                            initials
                            )} */}
                            <button
                            type="button"
                            // onClick={() => fileRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-base-100 border border-base-200 shadow flex items-center justify-center hover:bg-base-200 transition"
                            aria-label="Change photo"
                            >
                            <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold">Profile photo</p>
                            <p className="text-xs opacity-60">PNG or JPG. Square images work best.</p>
                            
                            <div className="mt-2 flex gap-2">
                                <button type="button"  className="btn btn-sm btn-outline rounded-full">
                                    <Upload className="w-3.5 h-3.5" /> Upload
                                </button>
                                {/* {draft.avatar && (
                                <button
                                type="button"
                                onClick={() => setDraft((d) => ({ ...d, avatar: "" }))}
                                className="btn btn-sm btn-ghost rounded-full"
                                >
                                Remove
                                </button>
                                )} */}
                            </div>

                            <input
                            // ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                            />
                        </div>
                    </div>
                <div className="mt-5 space-y-4">
                {/* <Input label="Full name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
                <Input label="Email" type="email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} /> */}
                <p className="text-xs opacity-60 pt-1">
                NIN can only be updated through identity verification.
                </p>
                </div>
                <div className="mt-6 flex gap-3 justify-end">
                <button type="button"  className="btn rounded-full" popoverTarget={id} popoverTargetAction="hide">
                Cancel
                </button>
                <button type="submit" className="btn btn-primary rounded-full">
                Save changes
                </button>
                </div> 
                </form>
            </div>
        </div>

    );
}

export default EditProfileModal;