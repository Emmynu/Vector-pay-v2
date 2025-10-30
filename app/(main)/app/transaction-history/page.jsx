"use client"

import { useCallback, useEffect, useState } from "react";
import "../../../styles/transaction-history.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase-client";
import { getPaginatedTransaction, getTransactionSummary } from "../../../../app/actions/payment";
import { TransactionDetail } from "../../../libs/component";
import { PieChart, ResponsiveContainer, Pie, Tooltip, Legend, Cell } from "recharts";


const itemsPerPage =  5

function Page() {
    const [uid, setUid] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [selectedTransaction, setSelectedTransaction] = useState([])
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalTransaction, setTotalTransaction] = useState(null)
    const [outerRadius, setOuterRadius] = useState(null)

    

    useEffect(()=>{
        onAuthStateChanged(auth, user=> setUid(user?.uid))
    },[])

    useEffect(()=>{
        async function fetchTransactions() {
          if (uid) {
            const result =  await getPaginatedTransaction(uid, itemsPerPage, currentPage)
            const resp = await getTransactionSummary(uid)
            setData(resp)
            setTransactions(result?.transactions)
            setTotalTransaction(result?.totalTransactions)
          }
        }
        fetchTransactions()
    },[uid, currentPage])

    function handlePageChange(page) {
        const totalPages = Math.round(totalTransaction / itemsPerPage)
        
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    function handleShowModal(transaction) {
        setSelectedTransaction(transaction)
        document.getElementById("transaction-detail").showModal()
    }

    let margin;

    const calculatePieChartSize = useCallback(()=>{
        if (window.innerWidth < 640) {
            margin="20px"
            return 80
        }
        else {
            margin="50px"
            return 110
        }
    },[])

    useEffect(()=>{
        window.addEventListener("resize",()=>{
            setOuterRadius(calculatePieChartSize())
        })
    },[calculatePieChartSize])

    

    // const newTransaction =  params ? transactions?.filter(res=>res?.type === params) : transactions

    return ( 
        <main className="transaction-history-container">
            <section className="transaction-history-title-container">
                <h2>Transaction History</h2>
            </section>

            <section className="transaction-history-content-container">
                {transactions?.length === 0 ? 
                   <section className="transaction-empty">
                    <img src="https://th.bing.com/th/id/OIP.ZsjPQuS9XJsVY_JFsHvn9QHaHa?rs=1&pid=ImgDetMain" alt="" />
                    <h2>Transaction History empty</h2>   
               </section>
                :
                
                <div className="tabs tabs-border  tabs-sm md:tabs-md ">
                <input type="radio" name="my_tabs_2" className="tab font-medium tracking-wide" aria-label="Transactions" defaultChecked />
                <div className="tab-content">
                    <section className="transactions">
                    {/* <div className="filter-container">
                        <Link href={`?type=`}>All</Link>
                        {data?.map(result =>{
                                return <Link href={`?type=${result?.name}`}>{`${result?.name.charAt(0).toUpperCase()}${result?.name.slice(1,)}`}</Link>
                                
                            })}
                        </div> */}
                        {transactions.map(transaction=>{
                        let icon;
                        let amount
                        let transactionType;
                        let color;
                        switch (transaction?.type) {
                            case "deposit":
                                icon ="https://img.icons8.com/?size=100&id=122074&format=png&color=000000"
                                amount = `+`
                                transactionType="Fund Wallet by ATM Card"
                                color = "#b1d5fc"
                                break;
                            case "withdraw":
                                icon = "https://img.icons8.com/?size=100&id=73812&format=png&color=000000",
                                amount= `-`,
                                transactionType = `Withdrawal to Bank Account`
                                color= "#ccccfa" 
                                break;
                            case "transfer":
                                if (transaction?.recipientId === uid) {
                                    icon = "https://img.icons8.com/?size=100&id=14909&format=png&color=000000",
                                    amount = `+`
                                    transactionType= `Transfer From ${transaction?.name}`
                                    color= "#a1fae4"
                                }
                                else{
                                    icon = "https://img.icons8.com/?size=100&id=14902&format=png&color=000000",
                                    amount = `-`
                                    transactionType= `Transfer To ${transaction?.recipientName}`
                                    color= "#9bbeff"
                                }
                        
                            default:
                                break;
                        }
                        return <>
                       
                        <section className="cursor-pointer" onClick={()=>handleShowModal(transaction)} key={transaction?.id}>
                        <div>
                            <img src={icon} alt={`${transaction?.type}-icon`} className={`mr-4 p-3 rounded-full w-11 h-11`} style={{backgroundColor: color}}/>
                            <section>
                                <h2>{transactionType}</h2>
                                <p>{new Intl.DateTimeFormat("en-US", {
                                    month: "long",
                                    day:"numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }).format(transaction?.createdAt)}<span className={transaction?.status === "success"?"transaction-status text-green-600 ": transaction?.status === "failed" ? "transaction-status text-red-600 ": "transaction-status text-yellow-600 "}> · {transaction?.status?.charAt(0)?.toUpperCase() + transaction?.status?.slice(1)}</span></p>
                            </section>
                        </div>
                        <div>
                            <p className="transaction-amount">{amount}₦{Intl.NumberFormat("en-US").format(transaction?.amount)}</p>
                        </div>
                        <TransactionDetail transaction={selectedTransaction} uid={uid}/>
                    </section>
                        </>
                    })}  
                    </section>
                    <div className="flex justify-center mt-5 ">
                        <button className="px-4 py-2 font-medium bg-blue-100 border border-slate-300 shadow-lg" onClick={()=>handlePageChange(currentPage - 1)}>«</button>
                        <button className="px-4 py-2 font-medium bg-blue-100 border border-slate-300 shadow-lg">Page {currentPage}</button>
                        <button className="px-4 py-2 font-medium bg-blue-100 border border-slate-300 shadow-lg" onClick={ ()=>handlePageChange(currentPage + 1)}>»</button>
                    </div>
                </div>

                <input type="radio" name="my_tabs_2" className="tab font-medium tracking-wide" aria-label="Statistics"  />
                <div className="tab-content border-base-300 bg-base-100 py-3 px-0 md:p-4">
                    {data.length > 0 &&
                  
                     <section className="w-full h-[290px] mt-8 text-xs  md:text-sm font-medium">
                        <ResponsiveContainer >
                            <PieChart>
                                <Pie data={data} cx="50%" cy="50%"   outerRadius={outerRadius} dataKey="value" nameKey="name" label={({ name, percent })=> `${name} ${(percent * 100).toFixed(0)}%`} >
            
                                    <Cell  fill="#03457c" stroke="#000"/>
                                    <Cell  fill="#ffbb28" stroke="#000"/>
                                    <Cell  fill="#cbe7f1" stroke="#000"/>
                                </Pie>
                                
                                <Tooltip isAnimationActive animationDuration={2000}   formatter={(name, value, props)=>{
                                    const amount = new Intl.NumberFormat("en-NG",{
                                        style: "currency",
                                        currency:"NGN",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(name)
                                    return [amount, props.payload.name]
                                }}/>
                               
                                <Legend  layout="vertical" align="right" content={({ payload })=>{
                                    return (
                                        <ul style={{marginLeft: margin,  maxWidth: "fit-content"}}>{payload.map((entry, index)=>{
                                            const { value, payload: dataPayload} = entry
                                            const transactionType = dataPayload?.name
                                            const color = dataPayload?.fill
                                            let icon;

                                            const amount = new Intl.NumberFormat("en-NG",{
                                                style: "currency",
                                                currency:"NGN",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(dataPayload?.value)
                                            

                                            switch (transactionType) {
                                                case "deposit":
                                                    icon ="https://img.icons8.com/?size=100&id=122074&format=png&color=000000"
                                                    break;
                                                case "withdraw":
                                                    icon = "https://img.icons8.com/?size=100&id=73812&format=png&color=000000"
                                                    break;
                                                case "transfer":
                                                    icon = "https://img.icons8.com/?size=100&id=14902&format=png&color=000000"
                                                default:
                                                    break;
                                            }
        

                                            return (
                                                <li style={{ padding: "8px", borderRadius: "5px", marginTop: "5px"}} className="flex items-center border-b ">
                                                    <img src={icon} className={` w-6 rounded-full h-6 p-1.5 mr-1`} style={{background: color}}/>
                                                    <span>{`${transactionType.charAt(0).toUpperCase()}${transactionType.slice(1,)}`}:</span>
                                                    <span className="ml-1.5">{amount}</span>
                                                </li>
                                            )
                                        })}</ul>
                                    )
                                }} />
                                
                            </PieChart>
                        </ResponsiveContainer>
                       
                    </section>}
                </div>
                </div> 
                 }
            </section>
        </main>
     );
}

export default Page ;

