"use client";

import AddBeneficiaryModal from "@/app/libs/ui/dashboard/beneficiaries-modal";
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { Users2, Plus, ArrowUpRight, ArrowDownLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useBeneficiary } from "../api/beneficiaries/get-beneficaries";
import CustomPagination from "@/app/libs/ui/custom/custom-pagination";
import Link from "next/link";
import { formatDateStandard } from "@/app/libs/utils/utils";
import { useBeneficiaries } from "../api/beneficiaries/delete-beneficiaries";
import { showToast } from "@/app/libs/toast/sonner";


function Beneficiaries() {
  const [pagination, setPagination] = useState({ limit: 10, currentPage: 1 });
  const { deleteBeneficiary, isDeleting } = useBeneficiaries()

  const skip = (pagination.currentPage - 1) * pagination.limit;
  const { beneficiaries, isLoading, fetchBeneficiaries, isRefetching } = useBeneficiary({
    skip,
    limit: pagination.limit,
  });


  const metadata = beneficiaries?.metadata;
  const hasMore = metadata?.hasMore;
  const list = beneficiaries?.beneficiaries || [];

  useEffect(() => {
    fetchBeneficiaries();
  }, [skip, pagination.currentPage, pagination.limit]);

  function handlePrev() {
    if (pagination.currentPage > 1) {
      setPagination((v) => ({ ...v, currentPage: v.currentPage - 1 }));
    }
  }

  function handleNext() {
    if (hasMore) {
      setPagination((v) => ({ ...v, currentPage: v.currentPage + 1 }));
    }
  }

  async function handleDelete(id) {
    const response = await deleteBeneficiary(id)

    if(response?.status === 200){
        fetchBeneficiaries()
    }
    else{
        showToast({ type: "error", title: response?.title, msg:response?.msg })
    }
  }

 

  return (
    <main className="rounded-2xl bg-[#fff] border border-slate-200 p-6 lg:p-8 shadow-sm space-y-6">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <article>
          <h2 className="flex items-center gap-1 md:gap-2">
            <div className="p-2 rounded-xl bg-[#E6F0FA] text-[#03457c]">
              <Users2 className=" w-4 md:w-5 h-4 md:h-5" />
            </div>
            <span style={bricolage.style} className="text-lg md:text-xl font-bold text-slate-900">
              Beneficiaries
            </span>
          </h2>
          <p style={quicksand.style} className="text-xs md:text-[12.5px] opacity-75 ">
            Save people you pay often for faster transfers and requests.
          </p>
        </article>

        <div className="flex items-center gap-2.5">
          
          {/* Add Beneficiary Button */}
          <button
            className="btn flex items-center justify-center gap-2 bg-[#03457C] text-white hover:bg-[#02335c] px-5 py-2.5 rounded-full shadow-sm outline-none border-none text-xs md:text-[13px] font-semibold cursor-pointer transition-all active:scale-[0.98]"
            style={bricolage.style}
            onClick={() => document.getElementById("beneficiary-modal")?.showModal()}
          >
            <Plus className="w-4 h-4" />
            <span>Add Beneficiary</span>
          </button>
        </div>
      </header>

      {/* Beneficiaries Content Grid  */}
      <section className="min-h-[280px] my-8 md:mt-7">
        {isLoading || isRefetching ? (
          /* Skeleton Loading Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
            <div className="p-3.5 rounded-full bg-[#E6F0FA] text-[#03457c] mb-3">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 style={bricolage.style} className="text-base font-bold text-slate-800">
              No beneficiaries saved yet
            </h3>
            <p style={quicksand.style} className="text-xs text-slate-500 max-w-sm mt-1">
              Save your frequent contacts here to make future transfers much faster.
            </p>
            <button
              onClick={() => document.getElementById("beneficiary-modal")?.showModal()}
              style={bricolage.style}
              className="mt-4 text-xs font-bold text-[#03457c] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add your first beneficiary</span>
            </button>
          </div>
        ) : (
          /* Beneficiary Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((item) => {
              const fullName = `${item?.beneficiary?.firstName || ""} ${
                item?.beneficiary?.lastName || ""
              }`.trim();
              

              const hasNickname = !!item?.nickname;
              const primaryName = hasNickname ? item.nickname : (fullName || "User");
              const secondaryText = (item?.beneficiary?.userName || "");
              
              const initials = (primaryName.slice(0, 1) || "U").toUpperCase();
              const accountNumber = item?.beneficiary?.accountNumber || "N/A";
              const addedDate = formatDateStandard(item?.createdAt);

              return (
                <div
                  key={item?.id}
                  className="p-5 rounded-2xl border  bg-white border-[#03457c]/30 hover:shadow-md transition-all flex flex-col justify-between gap-4 group cursor-pointer"
                >
                  {/* Top info section */}
                  <div className="flex items-start gap-3">
                    {item?.beneficiary?.photoURL ? (
                      <img
                        src={item?.beneficiary?.photoURL}
                        alt={primaryName}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-100"
                      />
                    ) : (
                      <div
                        style={bricolage.style}
                        className="w-11 h-11 rounded-full bg-[#E6F0FA] text-[#03457c] font-bold text-sm flex items-center justify-center shrink-0 uppercase border border-[#03457c]/10"
                      >
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h4
                        style={bricolage.style}
                        className="font-bold text-[13px] md:text-sm text-slate-900 truncate"
                      >
                        {primaryName}
                      </h4>

                      {secondaryText && (
                        <p style={quicksand.style} className="text-[11px] text-slate-500 truncate">
                          {secondaryText}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-1">
                        <span
                          style={quicksand.style}
                          className="text-xs font-mono font-semibold text-slate-700 tracking-wide"
                        >
                          {accountNumber}
                        </span>
                        {addedDate && (
                          <span style={quicksand.style} className="text-[10px] text-slate-400">
                            Added {addedDate}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <Trash2 className="w-4 h-4 text-red-600" onClick={()=>handleDelete(item?.id)}/>
                    </div>
                  </div>

                  {/* 2 Action Buttons: Send & Request */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <Link
                      href={`/dashboard/transfer?to=${accountNumber}`}
                      style={bricolage.style}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#03457c] text-[#03457c] text-white text-xs font-semibold transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </Link>

                    <Link
                      href={`/dashboard/request?account=${accountNumber}`}
                      style={bricolage.style}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>Request</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Pagination Footer */}
     {list?.length > 0  && <CustomPagination
        currentPage={pagination.currentPage}
        limit={metadata?.limit ?? pagination.limit}
        total={metadata?.total ?? 0}
        hasMore={hasMore}
        isLoading={isLoading}
        handlePrev={handlePrev}
        handleNext={handleNext}
        itemLabel={"beneficiary"}
        pluralLabel={"beneficiaries"}
      />}

      <AddBeneficiaryModal />
    </main>
  );
}

export default Beneficiaries;