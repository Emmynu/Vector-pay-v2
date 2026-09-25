import CustomTable from "../../custom/custom-table";
import { usersColumn } from "./users-column";

export default function UsersTable({ data, isLoading, isRefetching, isError }) {
    return (
        <CustomTable 
        data={data}
        columns={usersColumn()}
        type={"users"}
        isLoading={isLoading}
        isRefetching={isRefetching}
        isError={isError}
    />
    )
}