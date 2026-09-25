import { useTable, tableFeatures } from "@tanstack/react-table";
import { bricolage, quicksand, montserrat } from "../../utils/font";
import { Info } from "lucide-react"

const features = tableFeatures({});

export default function CustomTable({ data, columns, type, isLoading, isRefetching, isError }) {
  const table = useTable({
    key: "custom-table",
    data,
    columns: columns,
    features,
  });

  return (
    <div className="w-full overflow-x-auto relative">
   
      <table className="w-full text-left text-sm text-gray-600 border-collapse">
        <thead className="border-b border-gray-200 text-xs uppercase font-semibold text-gray-500 tracking-wider" style={bricolage.style}>
          {table?.getHeaderGroups()?.map((headerGroup) => (
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
        <tbody className="divide-y divide-gray-100" style={quicksand.style}>
          {(isLoading || isRefetching) ? (
            <tr>
              <td colSpan={columns?.length} className="py-12">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#E6F0FA] border-t-[#03457C] rounded-full animate-spin" />
                  <span className="text-xs text-gray-600 font-medium" style={montserrat.style}>
                    Fetching {type}...
                  </span>
                </div>
              </td>
            </tr>
          ):
         isError ? (
           <tr>
              <td colSpan={columns?.length} className="py-12">
                <div className="flex items-center flex-col justify-center gap-2">
                  <Info className="w-5 h-5"/>
                  <span className="text-sm text-gray-600 font-medium" style={quicksand.style}>
                    Failed to fetch {type}...
                  </span>
                </div>
              </td>
            </tr>
         ) 
          : table?.getRowModel()?.rows?.length > 0 ? (
            table?.getRowModel()?.rows.map((row) => (
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
                colSpan={columns?.length}
                className="px-6 py-8 text-center text-gray-400"
              >
                No {type} found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}