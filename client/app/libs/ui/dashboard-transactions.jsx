import Link from "next/link";
import { ArrowUpRight, Wallet, Building2, ArrowDownLeft, History, Dot } from "lucide-react";
import { formatAmount, formatDate } from "../utils/utils";
import { ubuntu, montserrat, quicksand } from "../utils/font";
import { useTransactions } from "@/app/dashboard/api/transactions";
import { useUser } from "@/app/auth/api/profile";
import { useEffect, useState } from "react";

function RecentTransactions() {
  const [params, setParams] = useState({ skip: 0, limit: 5 });

  const { isLoading, transactions, fetchTransactions } = useTransactions({
    skip: params.skip,
    limit: params.limit,
  });

  const { data: user } = useUser();

  useEffect(() => {
    fetchTransactions();
  }, [params.skip, params.limit]);

  return (
    <section className="mt-6 shadow-md bg-white rounded-2xl border border-slate-200 px-5 py-8">
      <header className="flex justify-between items-center">
        <h2 className="font-medium text-[#03457C] text-xs md:text-sm" style={montserrat.style}>
          Recent Transactions
        </h2>
        <Link href={"/dashboard/transactions"} className="text-[#03457C] text-xs font-medium hover:opacity-70" style={ubuntu.style}>
          View All
        </Link>
      </header>

      {isLoading || !transactions?.transactions ? (
        <div className="my-5">
          <SkeletonLoading />
          <SkeletonLoading />
          <SkeletonLoading />
          <SkeletonLoading />
          <SkeletonLoading />
        </div>
      ) : transactions?.transactions.length > 0 ? (
        <section className="mt-3">
          {transactions?.transactions.map((transaction) => {
            const isCredit = transaction.recipientId === user?.id;
            const sender = transaction.sender;
            const recipient = transaction.recipient;
            const statusMap = {
              successful: "text-green-700",
              pending: "text-amber-700",
              failed: "text-rose-700",
            };

            let title = "";
            let transactionTypeIcon = null;
            if (transaction.type === "deposit") {
              title = transaction.narration;
              transactionTypeIcon = <Wallet className="w-4" />;
            } else if (transaction.type === "withdraw") {
              title = `Withdrawal to ${transaction?.withdrawal_info?.bank_name || "Bank"}`;
              transactionTypeIcon = <Building2 className="w-4" />;
            } else if (transaction.type === "transfer") {
              if (isCredit && sender) {
                title = `Transfer from ${sender.firstName} ${sender.lastName ? sender.lastName.slice(0, 1).toUpperCase() + "." : ""}`;
                transactionTypeIcon = <ArrowDownLeft className="w-4.5" />;
              } else if (!isCredit && recipient) {
                title = `Transfer to ${recipient.firstName} ${recipient.lastName ? recipient.lastName.slice(0, 1).toUpperCase() + "." : ""}`;
                transactionTypeIcon = <ArrowUpRight className="w-4.5" />;
              }
            }

            return (
              <article key={transaction.id} className="flex items-center justify-between my-1">
                <div className="flex items-center">
                  <div className="py-1.5 px-2.5 mt-3 rounded-full text-[#4A90E2] bg-[#E6F0FA]">
                    {transactionTypeIcon}
                  </div>

                  <div className="ml-1.5 mt-2">
                    <h2 className="text-[11px] md:text-xs mt-2 text-[#03457C] font-medium" style={montserrat.style}>
                      {title}
                    </h2>

                    <h6 className="text-[11px] md:text-xs -mt-0.5 tracking-wide opacity-75 flex items-center" style={quicksand.style}>
                      <span className="-mr-1.5">{formatDate(transaction.date)}</span>
                      <Dot />
                      <span className={`-mr-1.5 -ml-1 font-semibold ${statusMap[transaction.status]}`}>
                        {transaction.status}
                      </span>
                    </h6>
                  </div>
                </div>

                <h4
                  style={montserrat.style}
                  className={`font-semibold text-xs ${
                    transaction?.type === "deposit" || (transaction?.type === "transfer" && isCredit)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction?.type === "deposit" || (transaction?.type === "transfer" && isCredit)
                    ? `+${formatAmount(transaction?.amount)}`
                    : `-${formatAmount(transaction?.amount)}`}
                </h4>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="w-full my-6 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-3 bg-[#E6F0FA] rounded-full text-[#4A90E2] mb-2">
            <History className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-semibold text-slate-700" style={montserrat.style}>
            No Recent Transaction
          </h4>
          <p className="text-[11px] text-slate-400 max-w-[200px] mt-1" style={quicksand.style}>
            You haven't made any transactions yet.
          </p>
        </section>
      )}
    </section>
  );
}

function SkeletonLoading() {
  return (
    <section className="flex justify-between items-center my-2">
      <section className="flex items-center gap-1.5">
        <div className="w-[38px] h-[38px] bg-gray-300 rounded-full animate-pulse"></div>
        <div className="mt-1.5">
          <div className="w-30 h-2.5 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-45 h-2.5 my-1 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </section>
      <div className="w-15 h-3 bg-gray-300 rounded-full animate-pulse"></div>
    </section>
  );
}

export default RecentTransactions;