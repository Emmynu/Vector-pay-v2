"use client"

import { Toaster, toast } from "sonner";
import Image from "next/image";
import Logo from "../../images/logo.png"
import "../../styles/auth.css"
import { Poppins, Roboto } from "next/font/google";
import credits from "../../images/credits.jpg"
import Link from "next/link";
import { generateQrCode } from "@/app/actions/auth";
import { useEffect, useState } from "react";
import { poppins } from "../login/page";



 function TotpPage() {
    const [totp, setTotp] = useState(null)
    const [copied, setCopied] = useState(false)

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
    }) 

    function handleCopy() {
        navigator.clipboard.writeText(totp?.code)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1500);
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
                    <section className="form-container px-11">
                    <article className="auth-label-container">
                        <h3 className={poppins.className}>Two-Factor Authentication</h3>
                        <p className="my-1">Set up two factor authentication to continue</p>
                        {/* <div><
                        use the code 
                        <h3>{totp?.code}</h3></div> */}
                    </article>
                    <section className="render-container">
                        <ol className="totp-content-container">
                           <li>
                                <h2>Download <strong>Google Authenticator</strong> and scan the QRcode</h2>
                                <div className="qrcode-container">
                                    <img src={totp?.qrcode} alt="qrcode" />
                                </div>
                                <h3 className="divider divider-[rgb(203 213 225)] font-thin  text-sm  font-sans" >Or enter the text manually</h3>
                                <div className="border bg-slate-200 flex items-center rounded-[5px]">
                                    <input type="text" name="code" id="code" className="bg-transparent p-3 text-sm tracking-wider w-full"  readOnly value={totp?.code}/>   
                                    <span className="btn text-sm" onClick={handleCopy}>{copied ? "copied": "copy"}</span>
                                </div>
                           </li>
                           <li className="mt-5">
                               <h2>Enter the 6-digit authentication code generated</h2>
                               {/* handle the code  */}
                               <section></section>
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