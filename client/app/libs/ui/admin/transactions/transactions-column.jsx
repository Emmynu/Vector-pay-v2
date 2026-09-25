import { formatDate, getStatusBadge } from "@/app/libs/utils/utils";
import { bricolage } from "@/app/libs/utils/font";
import { Eye } from "lucide-react"

export const transactionColumn = (handleModal) => [
  {
    accessorKey: "reference",
    header: "Transaction Ref",
    cell: ({ row }) => {
      const ref = row.original.reference || row.original.id || "";
      const shortId = `TXN-${ref.slice(0, 6).toUpperCase()}`;
      return (
        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {shortId}
        </span>
      );
    },
  },
  {
    accessorKey: "sender",
    header: "Sender",
    cell: ({ row }) => {
      const sender = row.original.sender;
      if (!sender) return <span className="text-xs text-slate-400">N/A</span>;

      const rawName = `${sender.firstName || ''} ${sender.lastName || ''}`.trim() || sender.userName || "Unknown";
      const fullName = rawName.length > 15 ? `${rawName.slice(0, 15)}...` : rawName;

      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-[13px]" title={rawName}>
            {fullName}
          </span>
          <span className="text-[11px] text-slate-400">
            {sender.accountNumber || "No Account Number"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
    cell: ({ row }) => {
      const { recipient, withdrawal_info, type } = row.original;

      // Handle withdrawal transactions
      if (type === "withdrawal" || withdrawal_info) {
        const bankName = withdrawal_info?.bankName || withdrawal_info?.bank_name || "Withdrawal";
        const accountNum = withdrawal_info?.accountNumber || withdrawal_info?.account_number || "Bank Payout";
        const rawBank = bankName.length > 15 ? `${bankName.slice(0, 15)}...` : bankName;

        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-[13px]" title={bankName}>
              {rawBank}
            </span>
            <span className="text-[11px] text-slate-400">
              {accountNum}
            </span>
          </div>
        );
      }

      if (!recipient) return <span className="text-xs text-slate-400">N/A</span>;

      const rawName = `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || recipient.userName || "Unknown";
      const fullName = rawName.length > 15 ? `${rawName.slice(0, 15)}...` : rawName;

      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-[13px]" title={rawName}>
            {fullName}
          </span>
          <span className="text-[11px] text-slate-400">
            {recipient.accountNumber || "No Account Number"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type || "transfer";
      return (
        <span className="capitalize text-xs font-medium text-[#03457C] bg-[#E6F0FA] px-2.5 py-1 rounded-md">
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number(row.original.amount || 0);
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return (
        <span className="text-xs font-bold text-slate-900" style={bricolage.style}>
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "pending";
      return (
        <span className={`text-[11px] ${getStatusBadge(status.toLowerCase())}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-slate-500 text-xs whitespace-nowrap">
        {row.original.date ? formatDate(row.original.date) : "N/A"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <button
        onClick={() => handleModal(row.original.id)}
        className="p-1.5 cursor-pointer rounded-md transition-colors"
        title="View Details"
      >
        <Eye className="w-4.5 h-4.5"/>
      </button>
    ),
  },
];