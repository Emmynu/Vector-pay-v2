import { useEffect, useState } from "react";
import {
  X,
  Upload,
  Loader2,
} from "lucide-react";
import "@/app/globals.css"
import { uploadFile } from "../supabase/supabase";
import { useKyc } from "@/app/dashboard/api/kyc";


export default function KYCModal({ id }) {
  const [nin, setNin] = useState({ninNumber: "", fullName: "", dob: "", ninSlip: ""})
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState(false);
      const [isUploading, setIsUploading] = useState(false)

  const { uploadKyc, isSubmitting } = useKyc()

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]

  const valid = nin.ninNumber.length === 11 && nin.fullName.trim().length > 3 && nin.dob.length > 0 && nin.ninSlip && allowedTypes.includes(nin.ninSlip?.type);


  useEffect(()=>{
    if(!allowedTypes.includes(nin.ninSlip?.type)){
        setInputError("Please upload PDF, JPEG, JPG or PNG image.")
    }

    setTimeout(() => {
        setInputError("")
    }, 3000);

  },[nin.ninSlip])



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valid) {
        setError("Invalid Input. Please provide a valid input")
    };

  
    setTimeout(() => {
        setError("")
        setInputError("")
    }, 3000);

    if(valid){
        // upload slip
        setIsUploading(true)


        const { url:uploadUrl, error:uploadError } = await uploadFile("kyc-slip", nin.ninSlip, `slip/${nin.ninSlip.name}`)

        setIsUploading(false)

        if(uploadError){
            setError(uploadError)
        }
        else{
        
            const data = {
                full_name: nin.fullName,
                nin_number:nin.ninNumber,
                dob: nin.dob,
                nin_slip: uploadUrl, 
            }

            //upload data
            uploadKyc(data)
            setNin({ninNumber: "", fullName: "", dob: "", ninSlip: ""})
        }

    }
   
  };

  return (
     <dialog id={id} className="modal bg-black/60 backdrop-blur-xs ">
            <div className="modal-box  bg-white" onClick={()=>document.getElementById('my-modal-3').close()}>
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg p-6 lg:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-display font-bold text-xl">Verify your identity</h3>
                        <p className="text-xs opacity-60 mt-1">Manual KYC · National Identification Number</p>
                    </div>
                    <button type="button" onClick={()=>document.getElementById('my-modal-3').close()} className="btn btn-ghost text-black hover:text-white btn-sm btn-square">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="mt-5 space-y-4">
                    <Input label="Full name (as on NIN slip)" name="fullName" value={nin.fullName} onChange={(v)=>setNin({...nin, fullName: v.target.value})} placeholder="John Doe"
                    error={"Required"}
                    minLength="3"
                    maxLength="30"
                    />

                    <Input
                        label="NIN (11 digits)"
                        value={nin.ninNumber}
                        onChange={(v) =>setNin({...nin, ninNumber: v.target.value.slice(0,11).replace(/\D/g, "")})}
                        placeholder="12345678901"
                        name={"ninNumber"}
                        maxLength={11}
                        minLength={11}
                        error={"Must be 11 digits"}
                        pattern="[0-9]*"
                    />
                    <label className="block">
                        <span className="text-xs font-semibold opacity-70">Date of birth</span>
                        <Input
                        type="date"
                        value={nin.dob}
                        name="dob"
                        error={"Must be a valid date"}
                        onChange={(e) => setNin({...nin, dob:e.target.value.trim()})}
                        className="custom-date-input-indicator "
                        />
                    </label>

                    <label className="block">
                        <span className=" text-xs font-semibold opacity-70">Upload NIN slip</span>
                        <div className="bg-white w-full mt-1 border-2 border-dashed border-base-200 rounded-xl p-2.5 flex items-center gap-3 hover:border-primary/40 text-sm transition cursor-pointer">
                            <Upload className="w-4 h-4 opacity-60" />
                            <input
                                type="file"
                                accept="image/*, application/pdf"
                                onChange={(e) => setNin({...nin, ninSlip:e.target.files[0]})}
                                className="text-sm file:hidden flex-1"
                                title="Invalid FIl"
                            />
                           
                        </div>
                        {inputError && <h2 className="mt-1 text-xs text-red-600">{inputError} </h2>}
                    </label>

                    <p className="text-xs opacity-60">
                        Your details will be reviewed manually. You'll be notified once your verification is complete.
                    </p>
                </div>

                {error && <h2 className="text-xs mt-2 text-red-600 truncate">{error}</h2>}

                <div className="mt-6 flex gap-3 justify-end">
                    <button type="button" onClick={()=>document.getElementById('my-modal-3').close()} className="btn rounded-full">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting || isUploading || !valid} className="btn bg-[#03457C] disabled:bg-[#03457C]/60 shadow-sm text-white rounded-full border-none">
                        {isSubmitting || isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /><span>{isUploading ? "Uploading...": " Submitting..."}</span>
                        </>
                        ) : (
                        "Submit"
                        )}
                    </button>
                    </div>
                </form>
            </div>
        </dialog>

  );

}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
  name,
  error,
  maxLength,
  minLength,
  pattern,
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold opacity-70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        className={`input validator mt-1 w-full px-4 py-2.5 rounded-xl border border-base-200 bg-[#ffff] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm placeholder:text-black/60 ${className}`}
      />
      <span className="validator-hint hidden text-red-500">{error}</span>
    </label>
  );
}

