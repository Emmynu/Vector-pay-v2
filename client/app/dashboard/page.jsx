"use client"
import DashboardWallet from "../libs/ui/wallet";
import DashboardTier from "../libs/ui/tier";
import RecentTransactions from "../libs/ui/dashboard-transactions";
import { TransactionChart } from "../libs/ui/chart";
import { bricolage, montserrat } from "../libs/utils/font";
import { useUser } from "../auth/api/profile";



function Dashboard() {
    const { data:user, isLoading } = useUser()

 return ( 
       <main>

        

        <section className="flex justify-between items-center">
           {isLoading ? <div className="skeleton h-4 bg-slate-300 w-40"></div> :  <h1 className={`${bricolage.className} text-xl md:text-2xl`}>Welcome {`${user?.firstName} ${user?.lastName.slice(0, 1).toUpperCase()},`}</h1>}

        </section>

        <section className="grid grid-cols-1 md:grid-cols-5 items-start gap-3 md:gap-5 mt-5">
            <DashboardWallet />
            <DashboardTier />
        </section>

              
        <section className="grid grid-cols-1 md:grid-cols-5  gap-3 md:gap-5 mt-2">
            <RecentTransactions />
            <section className="mt-6 md:col-span-2 shadow-md bg-white rounded-2xl border border-slate-200 px-5 py-8">
                <section>
                    <h2 className="font-medium text-[#03457C] text-sm" style={montserrat.style}>Transactions Chart </h2>
                    <p className={`text-[11px] tracking-wide opacity-60 mb-5`}>Keep track of your deposits, withdrawals, and transfers</p>
                </section>
                <TransactionChart />
            </section>  
        </section>
  
       </main>
     );
}

export default Dashboard;