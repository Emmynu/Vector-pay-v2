import { format, parseISO } from "date-fns";


export function generateUserName(first, last) {
    
    const length = 5
    const char =  first + last + "0123456789_"
    let generateduserName = ""

    for (let i = 0; i < length; i++) {
    const userNameIndex = Math.floor(Math.random() * char.length)
        generateduserName += char.charAt(userNameIndex)
    }

    return `${generateduserName}@vectorpay.io`

}

export function formatAmount(value){
    const newValue = new Intl.NumberFormat("en-NG",{currency:"NGN", style:"currency", minimumFractionDigits: 2}).format(value)

    return newValue
}

export function formatDate(date) {
//    const newDate = new Date(date)
    const formattedDate = new Date(date).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
            })

    return formattedDate
}


export function formatChartDate(date){
    const formattedDate = date 
    ? format(parseISO(date), "MMMM") 
    : null;

    return formattedDate
}