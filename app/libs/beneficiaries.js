"use client"


import "../styles/transfer.css"
import Link from "next/link";


export default function Beneficiaries({ uid, beneficiary }) {

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
                    <div className="flex items-center ">
                        <img src="https://th.bing.com/th/id/OIP.LkKOiugw5AFfDfUzuPAG4QHaI5?rs=1&pid=ImgDetMain" alt="" />
                        <div>
                            <h2>{user?.beneficiaryName}</h2>
                            <p>{user?.beneficiaryAccountNumber}</p>

                        </div>
                    </div>
                    <button>remove</button>
                </article>
            })}
        </section> :
       <section class="transaction-empty">
            <img src="https://th.bing.com/th/id/OIP.ZsjPQuS9XJsVY_JFsHvn9QHaHa?rs=1&pid=ImgDetMain" alt="" />
            <h2>No Beneficiary Found</h2>
        </section>}
      </>
    )
}

