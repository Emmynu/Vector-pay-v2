"use client"

import { useFormStatus } from "react-dom"
import "../../styles/auth.css"

function AuthButton({ loading }) {  
    const { pending } = useFormStatus()

    return ( 
        <button className="auth-button" type="submit" disabled={(pending || loading)}>{(pending || loading) ? <span className="loading loading-dots">Loading...</span> : "Submit"}</button>
     );
}

export default AuthButton;