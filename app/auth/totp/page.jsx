"use client"

import { Toaster, toast } from "sonner";
import Image from "next/image";
import Logo from "../../images/logo.png"
import copy from "../../images/copy.png"
import "../../styles/auth.css"
import credits from "../../images/credits.jpg"
import { generateQrCode, verifyCode } from "../../actions/auth";
import { useEffect, useState } from "react";
import  { Poppins   } from "next/font/google"
import OtpInput from "react-otp-input";


 const poppins = Poppins({
    subsets: ["latin"],
    weight: "800"
})




 function TotpPage() {
    const [totp, setTotp] = useState(null)
    const [code, setCode] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=>{
        async function getTotp() {
            try {
                const result = await generateQrCode()
                setTotp(result);
            } catch (error) {
                toast.error(error?.message)
            }
        }
        getTotp()
    },[]) 

    function handleCopy() {
        navigator.clipboard.writeText(totp?.code)
        toast.success("Copied to clipboard")
    }
    
    function handlePaste(event) {
        event.clipboardData.getData('text');
    }
    
   async function handleVerify(){

    if (!code) {
        toast.error("Please enter the OTP.")
    }

    if(code.length === 6 ){
         setIsLoading(true)
        // verify the code
        const result =   await verifyCode(code)
        if (result) {
            window.location = "/app"
        } else {
            toast.error("The OTP code you entered is incorrect. Please try again")
        }
    }
    
    setIsLoading(false)
    }

    return (
        <>
          <main className="auth-container">
            {/* logo section */}
            <section className="auth-form-container">
                <section className="auth-logo-container">
                        <Image src={Logo} width={40} height={40} alt="Logo"/>
                        <h2 className="font-sans font-bold">VectorPay</h2>
                    </section>
                    <section className="form-container px-6 md:px-8">
                    <article className="auth-label-container">
                        <h3 className={poppins.className}>Two-Factor Authentication</h3>
                        <p className="my-1">Set up two factor authentication to continue</p>
                      
                    </article>
                    <section className="render-container">
                        <ol className="totp-content-container">
                           <li>
                                <h2>Download <strong>Google Authenticator</strong> and scan the QRcode</h2>
                                <div className="qrcode-container">
                                    <img src={totp?.qrcode} alt="qrcode" />
                                </div>
                                <h3 className="divider divider-neutral font-thin  text-sm  font-sans" >Or enter the text manually</h3>
                                <div className="border bg-slate-200 flex items-center rounded-[5px]">
                                    <input type="text" name="code" id="code" className="bg-transparent border-none outline-none p-3 text-sm tracking-wider w-full"  readOnly value={totp?.code}/>   
                                    <span className="mr-2" onClick={handleCopy}>
                                        <Image src={copy} alt="copy" className="cursor-pointer w-5" />
                                    </span>
                                </div>
                           </li>
                           <li className="mt-5">
                               <h2>Enter the 6-digit authentication code generated</h2>
                               {/* handle the code  */}
                               <section>
                                <OtpInput
                                    value={code}
                                    onChange={setCode}
                                    numInputs={6}
                                    renderSeparator={<span> </span>}
                                    renderInput={(props) => <input {...props} />}
                                    onPaste={(event)=>handlePaste(event)}
                                    inputStyle={{border: "1px solid gray", padding: "15px", width:"40px", height: "45px" , marginLeft:"4px",borderRadius: "7px", fontSize: "14px"} }
                                    
                                    />
                                    <button onClick={handleVerify} disabled={code?.length < 6 || isLoading} className="disabled:opacity-75"><span className={isLoading ? " loading loading-bars loading-sm mr-2 disabled:opacity-75": ""}></span>{isLoading ? "" : "Next"}</button>
                                </section>
                           </li>
                        </ol>
                    </section>
                    </section>
            </section>
                <section className="auth-img-container">
                    <Image src={credits}  alt="auth-image"/>
                </section>

                <Toaster richColors closeButton position="bottom-right"/>
          </main>
     
        </>
     );
}

export default TotpPage;