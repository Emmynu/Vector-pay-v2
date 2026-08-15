'use client';

import { useTransactions } from '@/app/dashboard/api/transactions';
import { useEffect, useState } from 'react';
import { BounceLoader, CircleLoader } from 'react-spinners';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { bricolage, quicksand } from '../utils/font';


export default function VerifyPaymentModal({ id, reference }) {
  const { verifyTransaction, fetchTransactions } = useTransactions();
  
  const [status, setStatus] = useState('verifying');
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (!reference) return;

    async function verify() {
      setStatus('verifying');
      try {
        const response = await verifyTransaction({ reference });
        

        if(response.data?.status === "success" || response.data?.status === "pending"){
            setStatus(response.data?.status)
            setResultData({
                msg: response?.data?.msg,
                description: response?.data?.description ,
          });
        }

        if(response?.status === "error"){
            setStatus("error")
            setResultData({
                msg: response?.title,
                description: "Transaction was declined by the payment provider" ,
          });
        }
      } catch (err) {
        setStatus("error")
            setResultData({
                msg: response?.title,
                description: "Transaction was declined by the payment provider" ,
          });
      }
      
      localStorage.removeItem("reference")
      
      setTimeout(() => {
        document.getElementById(id).close()
      }, 2000);

       fetchTransactions({ skip: 0, limit: 5 })
    }

    verify();
  }, [reference, verifyTransaction]);


  

 

  return (
    <dialog id={id} className="modal backdrop-blur-md">
      <div className="modal-box relative w-full max-w-sm rounded-2xl bg-white text-black p-6 shadow-2xl">

        { (status === 'verifying' ) &&(
          <div className="flex flex-col items-center  justify-center text-center py-6">
            <div className="relative flex items-center  justify-center my-4 animate-spin">
              <CircleLoader color="oklch(87.9% 0.169 91.605)" size={65} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-amber-300" style={bricolage.style}>
              Verifying Payment...
            </h2>
            <p className="mt-2 text-xs opacity-50 text-black" style={quicksand.style}>
              Please wait while we confirm your transaction with the provider.
            </p>
          </div>
        )}

        {status === "pending" && (
            <div className='flex flex-col items-center  justify-center text-center py-6'>
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
                  <BounceLoader color="oklch(87.9% 0.169 91.605)" size={65} />
                </div>
                <h1 className="text-2xl font-bold font-display tracking-tight text-amber-400" style={bricolage.style}>
                  {resultData?.msg}
                </h1>
                <p className="mt-2 text-xs opacity-50 text-black" style={quicksand.style}>
                  {resultData?.description}
                </p>
             
            </div>
        )}
        
        {status === 'success' &&  (
           <div className='flex flex-col items-center  justify-center text-center py-6'>
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h1 className="text-2xl font-bold font-display tracking-tight text-green-600" style={bricolage.style}>
                  {resultData?.msg}
                </h1>
                <p className="mt-2 text-xs opacity-50 text-black" style={quicksand.style}>
                  {resultData?.description}
                </p>
                <div className="mt-6 flex flex-col  gap-3 w-full">
                    <button className="btn border-none outline-none bg-green-600 rounded-full">
                       <h2>Continue</h2> <ArrowRight className="w-4 h-4 mt-1" />
                    </button>
                </div>
            </div>
        )}

       
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="rounded-full bg-red-500/10 p-3 text-red-500 ring-8 ring-red-500/5 mb-4">
              <XCircle className="h-12 w-12" />
            </div>
            
            <h2 className="text-xl font-semibold text-red-600" style={bricolage.style}>
              {resultData?.msg}
            </h2>
            
            <p className="mt-2 text-xs opacity-50 text-black" style={quicksand.style}>
              {resultData?.description}
            </p>

           
          </div>
        )}

      </div>

      {/* Backdrop overlay listener */}
      {/* <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form> */}
   
    </dialog>
  );
}