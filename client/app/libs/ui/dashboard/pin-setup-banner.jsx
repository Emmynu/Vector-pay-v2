import { quicksand, bricolage } from "../../utils/font";
import { ShieldCheck } from "lucide-react";

export default function PinSetupBanner() {
  return (
    <section className="bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-pointer">
      
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="p-2.5 rounded-xl bg-[#E6F0FA] text-[#03457C] shrink-0">
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 
            className="text-[13px] sm:text-sm font-bold text-slate-900 " 
            style={bricolage.style}
          >
            Set up your Transaction PIN
          </h2>
          <p 
            className="text-[12px] text-slate-500  leading-relaxed" 
            style={quicksand.style}
          >
            Enhance your account security to authorize transfers and manage funds seamlessly.
          </p>
        </div>
      </div>


      <button 
        className="self-end sm:self-auto px-4 py-2 bg-[#03457C] hover:bg-[#02335c] text-white text-[12px] font-semibold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        style={bricolage.style}
        onClick={()=> document.getElementById('my_modal_1')?.showModal()}
      >
        Set up now
      </button>
    </section>
  );
}