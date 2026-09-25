import CustomTable from "../../custom/custom-table";
import { kycColumn } from "./kyc-column";

export default function KYCTable({ kyc, isLoading, handleModal, isRefetching } ){
    
    return (
        <CustomTable 
            data={kyc}
            isLoading={isLoading}
            columns={kycColumn(handleModal)}
            type={"KYC document"}
            isRefetching={isRefetching}
        />

    )
}