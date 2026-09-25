import { format, parseISO } from "date-fns";


export function formatAmount(value){
    const formattedAmount = new Intl.NumberFormat("en-NG",{currency:"NGN", style:"currency", minimumFractionDigits: 2}).format(value)

    return formattedAmount
}

export function formatAmountShort(value) {
    const formattedAmount =  new Intl.NumberFormat("en-NG", {
        notation: "compact",
        compactDisplay: "short",
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 1,
    }).format(value);

    return formattedAmount
}

export const formatNumber = (val = 0) =>{
     const number = new Intl.NumberFormat("en-US", {
        compactDisplay: "short",
        notation: "compact",
    }).format(val);

    return number
}



export function formatDate(date) {

    const formattedDate = new Date(date).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        
            })

    return formattedDate
}


export function formatChartDate(date){
    const formattedDate = date 
    ? format(parseISO(date), "MMMM") 
    : date;

    return formattedDate
}

export const getStatusBadge = (status) => {
    let statusBadge;
    
    if(status === "successful" || status === "verified"){
       statusBadge =  "bg-green-50 text-green-700 ring-green-600/20"
    }
    else if(status === "pending"){
        statusBadge = "bg-amber-50 text-amber-700 ring-amber-600/20"
    }
    else if(status === "declined" || status === "failed"){
        statusBadge = "bg-red-50 text-red-600 ring-red-600/20"
    }
    else{
        statusBadge =  "bg-gray-50 text-gray-600 ring-gray-500/10"
    }
    
    return `inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset capitalize ${statusBadge}`
  }


  export function getSelectOptions(selectOption){
    const option = selectOption?.map((s)=>({
        label:s[0]?.toUpperCase() + s.slice(1,),
        value:s?.toLowerCase()
    }))


    return option
  }


export function downloadBlob(blob, filename){
    const url = URL.createObjectURL(blob)    
    const anchorElement = document.createElement("a")
    anchorElement.href = url
    anchorElement.download = filename
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
}