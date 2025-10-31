"use client"

import Link from "next/link";
import "./styles/home.css"
import credits from "./images/credits.webp"
import Image from "next/image";
import Logo from "./images/logo.png"

export default  function Home() {
  
  
  return (
   <main className=" mx-8 md:mx-20 lg:mx-48">
    <nav className="auth-logo-container">
      <Image src={Logo} width={45} height={45} alt="Logo"/>
      <h2 className="font-sans font-bold text-2xl">VectorPay</h2>
    </nav>
    <div className="hero min-h-[60vh]">
      <div className="hero-content flex-col lg:flex-row-reverse ">
         <Image src={credits} alt="img" className="h-[53%] w-[53%] hidden lg:block"/>
        <div>
          <h1 className="text-[55px] leading-[1.2] font-bold"> Your <span className="text-main">Financial</span> Future!</h1>
          <p className="py-6">
            Send, receive and manage your funds effortlessly . Transfer money to friends, deposit funds into your account and withdraw cash whenever with VectorPay.</p>
          <button className="home-btn"><Link href={"/app"}>Get Started</Link></button>
        </div>
      </div>
    </div>
   </main>
  );
}
