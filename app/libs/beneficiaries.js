"use client"

import { toast } from "sonner";
import { removeBeneficiary } from "../actions/payment";
import "../styles/transfer.css"
import Link from "next/link";


export default function Beneficiaries({ beneficiary }) {


    async function deleteBeneficiary(id) {
        console.log(id);
        
        const res = await removeBeneficiary(id)
        if (res?.error) {
            toast.error(res?.error)
        } else {
            toast.success("Beneficiary removed succesfully")
            setTimeout(() => {
                window.location = "/app/transfer"
            }, 1000);
        }
    }
    


    return (
      <>
      <article className="beneficiary-nav">
            <h2>Beneficiaries</h2>
            <p>
                <Link href={"/app/transaction-history"}>» See All</Link>
          </p>
        </article>
        {beneficiary?.length> 0 ? <section className="beneficiary-container">
            {beneficiary?.map(user => {
                return <article>
                    <div className="flex items-center">
                        <img src="https://th.bing.com/th/id/OIP.LkKOiugw5AFfDfUzuPAG4QHaI5?rs=1&pid=ImgDetMain" alt="" />
                        <div>
                            <h2>{user?.beneficiaryName}</h2>
                            <p>{user?.beneficiaryAccountNumber}</p>

                        </div>     
                    </div>
                    <button onClick={()=>deleteBeneficiary(user?.id)}>remove</button>
                </article>
            })}
        </section> :
       <section className="transaction-empty">
            <img src="https://th.bing.com/th/id/OIP.ZsjPQuS9XJsVY_JFsHvn9QHaHa?rs=1&pid=ImgDetMain" alt="" />
            <h2>No Beneficiary Found</h2>
        </section>}
      </>
    )
}

