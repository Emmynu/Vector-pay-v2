import Link from "next/link";
import { Bricolage_Grotesque }  from "next/font/google"

const bricolage = Bricolage_Grotesque({
  weight: "700",
  subsets: ["vietnamese"]
})


function Logo() {
    return ( 
         <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="bg-linear-to-br from-[#01335c] to-blue-500 px-3 py-2 rounded-xl text-white font-bold text-sm">V</span>
          </div>
          <h2 className={`font-bold text-lg text-black ${bricolage.className}`}>vectorPay</h2>
         </Link>
     );
}

export default Logo;