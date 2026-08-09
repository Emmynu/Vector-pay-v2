import { Eye, EyeOff } from "lucide-react"


export default function CustomPasswordInput({ isPasswordVisible, setIsPasswordVisible, name = "password", placeholder ="Password", value, onChange,isLoading }){
    return (
        <section className="mt-3">
            <div className="">
                <h2 className="text-[12px] tracking-wide mb-1 text-sm">Password: </h2>
                <label className="input validator  bg-input w-full">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                    >
                    <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                    ></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                </svg>
                <input
                    type={isPasswordVisible ? "text": "password"}
                    required
                    name={name}
                    placeholder={placeholder}
                    minLength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                    value={value}
                    onChange={onChange}
                    disabled={isLoading}
                />
                  <button type="button" onClick={()=>setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? <Eye className="w-4 cursor-pointer"/> : <EyeOff  className="w-4 cursor-pointer"/>}</button>
                </label>
                <p className="validator-hint hidden mb-0.5">Must be more than 8 characters, including<br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter</p>
            </div>

          
            
        </section>
    )
}