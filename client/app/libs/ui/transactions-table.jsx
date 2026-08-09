import { useTable, tableFeatures } from "@tanstack/react-table";
import { transactionsColumn } from "./transaction-column";
import { bricolage, quicksand } from "../utils/font";

const features = tableFeatures({});

export default function TransactionsTable({ data, id, handleSelect, handleDownload }) {
  const table = useTable({
    key: "transactions-table",
    data,
    columns: transactionsColumn(id, handleSelect, handleDownload),
    features,
  });
// rounded-xl border border-gray-200 bg-white
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
          {table.getRowModel().rows.length > 0 ? (
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
          )}
        </tbody>
      </table>
    </div>
  );
}