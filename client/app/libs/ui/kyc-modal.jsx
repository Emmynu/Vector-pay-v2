import { useEffect, useState } from "react";
import {
  X,
  Upload,
  Loader2,
} from "lucide-react";
import "@/app/globals.css"
import { uploadFile } from "../supabase/supabase";
import { useKyc } from "@/app/dashboard/api/kyc";
import { bricolage, quicksand } from "../utils/font";


export default function KYCModal({ id }) {
  const [nin, setNin] = useState({ninNumber: "", fullName: "", dob: "", ninSlip: ""})
  const [error, setError] = useState(false);
//   const [inputError, setInputError] = useState(false);
  const [isUploading, setIsUploading] = useState(false)

  const { uploadKyc, isSubmitting } = useKyc()

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]

  const valid = nin.ninNumber.length === 11 && nin.fullName.trim().length > 3 && nin.dob.length > 0 && nin.ninSlip && allowedTypes.includes(nin.ninSlip?.type);


  useEffect(()=>{
    if(!allowedTypes.includes(nin.ninSlip?.type)){
        setError("Please upload PDF, JPEG, JPG or PNG image.")
    }

    setTimeout(() => {
        setError("")
    }, 3000);

  },[nin.ninSlip])



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valid) {
        setError("Invalid Input. Please provide a valid input")
    };

  
    setTimeout(() => {
        setError("")
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
            const kycResponse = await uploadKyc(data)

            if(kycResponse?.status !== "error"){
                setNin({ninNumber: "", fullName: "", dob: "", ninSlip: ""})
            }
        }

    }
   
  };

  return (
     <dialog id={id} className="modal bg-black/60 backdrop-blur-xs">
            <div className="modal-box  bg-white" onClick={()=>document.getElementById('my-modal-3').close()}>
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg py-4 px-3 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-display font-bold text-xl" style={bricolage.style}>Verify your identity</h3>
                        <p className="text-xs opacity-60 mt-0l5" style={quicksand.style}>Manual KYC · National Identification Number</p>
                    </div>
                    <button type="button" onClick={()=>document.getElementById('my-modal-3').close()} className="btn bg-transparent border-none shadow-none text-black btn-sm btn-square">
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
                        <span className="text-xs font-semibold opacity-70"  style={quicksand.style}>Date of birth</span>
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
                        <span className=" text-xs font-semibold opacity-70" style={quicksand.style}>Upload NIN slip</span>
                        <div className="bg-white w-full mt-1 border-2 border-dashed border-black rounded-xl p-2.5 flex items-center gap-3 hover:border-[#03457C]/40 text-[13px]  transition cursor-pointer placeholder:opacity-70">
                            <Upload className="w-4 h-4 opacity-60" />
                            <input
                                type="file"
                                accept="image/*, application/pdf"
                                onChange={(e) => setNin({...nin, ninSlip:e.target.files[0]})}
                                className="text-sm file:hidden flex-1"
                                title="Invalid File Format"
                                style={quicksand.style}
                            />
                           
                        </div>
                        {/* {inputError && <h2 className="mt-1 text-xs text-red-600">{inputError} </h2>} */}
                    </label>

                    <p className="text-xs opacity-60" style={quicksand.style}>
                        Your details will be reviewed manually. You'll be notified once your verification is complete.
                    </p>
                </div>

                {error && <h2 className="text-[11px] mt-2 text-red-600 truncate font-semibold" style={quicksand.style}>{error}</h2>}

                <div className="mt-6 flex gap-3 justify-end">
                    <button type="button" disabled={isSubmitting || isUploading} onClick={()=>document.getElementById('my-modal-3').close()} className="btn bg-transparent border-2 border-[#03457C] text-[#03457C] font-medium shadow-sm hover:opacity-80 disabled:opacity-70 rounded-full" style={bricolage.style}>
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting || isUploading || !valid} className="btn bg-[#03457C] disabled:bg-[#03457C]/60 shadow-sm text-white rounded-full border-none" style={bricolage.style}>
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
      <span className="text-xs font-semibold opacity-70" style={quicksand.style}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        className={`input validator mt-0.5 w-full px-4 py-2.5 rounded-xl border border-black bg-[#ffff] focus:outline-none focus:ring-2 focus:ring-[#03457C]/20 focus:border-[#03457C] transition text-[13px] text-black placeholder:opacity-85 ${className}`} style={quicksand.style}
      />
      <span className="validator-hint hidden text-[11px] text-red-500 font-semibold" style={quicksand.style}>{error}</span>
    </label>
  );
}

