import { useTable, tableFeatures } from "@tanstack/react-table";
import { transactionsColumn } from "./transaction-column";
import { bricolage, quicksand, montserrat } from "../utils/font";

const features = tableFeatures({});

export default function TransactionsTable({ data, id, handleSelect, handleDownload, isLoading }) {
  const table = useTable({
    key: "transactions-table",
    data,
    columns: transactionsColumn(id, handleSelect, handleDownload),
    features,
  });

  
  return (
    <div className="w-full overflow-x-auto ">
      <table className="w-full text-left text-sm text-gray-600 border-collapse">
        <thead className=" border-b border-gray-200 text-xs uppercase font-semibold text-gray-500 tracking-wider" style={bricolage.style}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-6 py-3.5">
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y  divide-gray-100" style={quicksand.style}>
          {isLoading ? (
            <tr >
              <td className="flex items-center text-center justify-center py-12"> 
                <div className="w-5 h-5 mr-1 border-3 border-[#E6F0FA] border-t-black rounded-full animate-spin"></div>
                    <p className="text-xs text-[#0000] font-medium skeleton skeleton-text" style={montserrat.style}>
                    Fetching transactions...
                    </p>
                </td>    
            </tr>
          ): (table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/80 cursor-pointer transition-colors duration-150"
              >
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-5 whitespace-nowrap">
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={transactionsColumn(id).length}
                className="px-6 py-8 text-center text-gray-400"
              >
                No transactions found.
              </td>
            </tr>
          ))}
      
        </tbody>
      </table>
    </div>
  );
}