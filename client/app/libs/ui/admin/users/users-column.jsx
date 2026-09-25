import { ShieldCheck, MoreHorizontal } from "lucide-react";
import { getStatusBadge, formatAmount, formatDate } from "@/app/libs/utils/utils";

export const usersColumn = () => [
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName || "N/A";
      
      return (
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={fullName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#03457C]  text-[#fff] font-semibold text-xs flex items-center justify-center">
              {fullName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 text-xs sm:text-[13px]">
              {fullName}
            </span>
            <span className="text-slate-500 text-[11px]">@{user.userName || "no_username"}</span>
          </div>
        </div>
      );
    },
  },


  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-slate-800 text-xs font-medium">{row.original.email}</span>
        <span className="text-[10px] text-slate-400 font-mono">
          ID: {row.original.id ? `${row.original.id.slice(0, 8)}...` : "N/A"}
        </span>
      </div>
    ),
  },

  // 3. Account Number
  {
    accessorKey: "accountNumber",
    header: "Account No.",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-700 font-medium">
        {row.original.accountNumber || "N/A"}
      </span>
    ),
  },

  // 4. Tier
  {
    accessorKey: "tier",
    header: "Tier",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1 bg-blue-50 text-[#4A90E2] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100">
        <ShieldCheck className="w-3 h-3" /> Tier {row.original.tier}
      </span>
    ),
  },

  // 5. Balance
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900 text-xs sm:text-sm">
        {formatAmount(row.original.balance)}
      </span>
    ),
  },

  // 6. KYC Status
  {
    accessorKey: "kycStatus",
    header: "KYC Status",
    cell: ({ row }) => {
      const status = row.original.kycStatus?.toLowerCase();

    return <span className={getStatusBadge(status)}>{status}</span>
      
    },
  },


  // 7. Created At
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500 whitespace-nowrap">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },

  // 8. Last login At
  {
    accessorKey: "loginAt",
    header: "Last Active", // or "Last Seen"
    cell: ({ row }) => (
      <span className="text-xs text-slate-500 whitespace-nowrap">
        {formatDate(row.original.loginAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        // onClick={() => onActionClick && onActionClick(row.original)}
        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
        title="View Actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    ),
  },
];