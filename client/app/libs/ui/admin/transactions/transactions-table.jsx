import CustomTable from "../../custom/custom-table";
import { transactionColumn } from "./transactions-column";

export default function TransactionTable({ data, isRefetching, isLoading, handleModal }) {
    return(
        <CustomTable 
        data={data}
        columns={transactionColumn(handleModal)}
        type={"transactions"}
        isLoading={isLoading} 
        isRefetching={isRefetching}
        />
    )
}