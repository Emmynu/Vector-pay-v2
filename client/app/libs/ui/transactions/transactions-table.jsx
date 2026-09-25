import CustomTable from "../custom/custom-table";
import { transactionsColumn } from "./transaction-column";


export default function TransactionsTable({ data, id, handleSelect, handleDownload, isLoading, isRefetching }) {
  
  return (
    <CustomTable 
      data={data}
      columns={transactionsColumn(id, handleSelect, handleDownload, isLoading)}
      type={"transactions"}
      isLoading={isLoading}
      isRefetching={isRefetching}
    />
  );
}