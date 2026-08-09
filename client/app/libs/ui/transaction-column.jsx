import { formatDate, formatAmount } from "../utils/utils";
import { Eye, Download } from "lucide-react";


export const transactionsColumn = (id, handleSelect, handleDownload) => [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => {
      const rawId = row.original.id || "";
      const shortId = `TXN-${rawId.slice(0, 6).toUpperCase()}`;

      return (
        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {shortId}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Description",
    cell: ({ row }) => {
      const isCredit = row.original.recipientId === id;
      const sender = row.original.sender;
      const recipient = row.original.recipient;

      let title = "Transfer";
      if (isCredit && sender) {
        title = `Transfer from ${sender.firstName} ${sender.lastName ? sender.lastName.slice(0, 1).toUpperCase() + "." : ""}`;
      } else if (!isCredit && recipient) {
        title = `Transfer to ${recipient.firstName} ${recipient.lastName ? recipient.lastName.slice(0, 1).toUpperCase() + "." : ""}`;
      }

      return (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 text-[13px]">{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize text-xs font-medium text-[#4A90E2] bg-[#E6F0FA] px-2.5 py-1 rounded-md">
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return <span className="text-gray-500 text-xs">{formatDate(row.original.date)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original.status || "").toLowerCase();

      const statusMap = {
        successful: "bg-green-50 text-green-700 ring-green-600/20",
        pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
        failed: "bg-red-50 text-red-600 ring-red-600/20",
      };

      const style =
        statusMap[status] || "bg-gray-50 text-gray-600 ring-gray-500/10";

      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset capitalize ${style}`}
         >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const isCredit = row.original.recipientId === id;
      const rawAmount = Number(row.original.amount) || 0;
      return (
        <span
          className={`font-semibold text-sm ${
            isCredit ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCredit ? `+${formatAmount(rawAmount)}` : `-${formatAmount(rawAmount)}`}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
            <Eye className="w-4.5" onClick={()=>{
                handleSelect(row.original.id)
            }}/> 
            <Download className="w-4.5 ml-1.5" onClick={()=>handleDownload(row.original)}/>
           
        </div>
      );
    },
  }
];