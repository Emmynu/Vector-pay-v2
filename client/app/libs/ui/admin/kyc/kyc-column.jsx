import { formatDate, getStatusBadge } from "@/app/libs/utils/utils"
import { Eye } from "lucide-react"



export const kycColumn = (handleModal) => 
    [
      {
        accessorKey: "id",
        header: "KYC ID",
        cell: ({ row }) => {
            const rawId = row.original.id
            const shortId = `KYC-${rawId.slice(0, 6).toUpperCase()}`
            return (
                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {shortId}
                </span>
            )
            
        },
     },
      {
        accessorKey: "full-name",
        header: "Full Name",
        cell: ({ row }) => {
            const fullName = row.original.full_name
    
            return (
                <h2  className="font-medium  text-[13px]">
                    {fullName}
                </h2>
            )
            
        },
     },
     {
        accessorKey: "nin",
        header: "NIN Number",
        cell: ({ row }) => {
            const nin = row.original.nin_number
           
            return (
                <h2  className="font-medium  text-[13px]">
                    {nin}
                </h2>
            )
            
        },
     },

     {
        accessorKey: "dob",
        header: "DOB",
        cell: ({ row }) => {
            const dob = row.original.dob
 
            return (
                <h2>
                    {dob}
                </h2>
            )
            
        },
     },

     {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
 
            return (
                <h2 className={` ${getStatusBadge(status)}`}>
                    {status}
                </h2>
            )
            
        },
     },

      {
        accessorKey: "submission date",
        header: "Submitted",
        cell: ({ row }) => {
            const date = row.original.date
         
            return (
                <h2 className="text-gray-500 text-xs">
                    {formatDate(date)}
                </h2>
            )
            
        },
     },

    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const userId = row.original.userId
            return (
                <div>
                    <Eye className="w-4 h-4" onClick={()=>{handleModal(userId)}}/>
                </div>
            )
            
        },
     },

    ]
