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