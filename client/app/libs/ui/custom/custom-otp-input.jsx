import OtpInput from "react-otp-input";
import { bricolage } from "../../utils/font";

export default function CustomOTPInput({ value, handleChange, onPaste, errorMessage = null, numInputs = 6, className }){



    return (
        <OtpInput
            value={value}
            onChange={handleChange}
            numInputs={numInputs}
            onPaste={onPaste}
            shouldAutoFocus
            inputType="number"
            containerStyle="flex items-center justify-center text-center gap-1 w-full"
            renderSeparator={<span className=""></span>}
            renderInput={(props) => (
            <input
                {...props}
                style={{
                ...bricolage.style,
                width: "100%",
                }}
                className={`text-center text-lg sm:text-xl font-bold rounded-xl outline-none transition-all shadow-xs text-slate-900  md:pl-2 ${
                    errorMessage
                      ? `!bg-red-50/50 border !border-red-300 focus:!border-red-500 focus:bg-white ${className}`
                      : className
                  }`}
            />
         )}
     />
    )
}

