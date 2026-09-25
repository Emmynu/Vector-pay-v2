import Select from "react-select"
import { quicksand } from "../../utils/font"



export default function CustomSelect({options,handleChange, placeholder}) {
    return (
        <Select 
            options={options}
            onChange={handleChange}
            className={`${quicksand.className}`}
            unstyled
            isClearable
            placeholder={placeholder}
            classNames={{
                control: ({ isFocused }) =>
                `px-3 py-1 rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs ${
                    isFocused
                        ? "border-[#03457C] ring-2 ring-[#03457C]/15 bg-white"
                        : "border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300"
                }`,
            valueContainer: () => "gap-1.5 p-0",
            placeholder: () => "text-slate-600 text-xs sm:text-[13px] font-medium",
            singleValue: () => "text-slate-600 text-xs sm:text-[13px]  capitalize",
            indicatorsContainer: () => "gap-1 text-slate-400",
            dropdownIndicator: ({ isFocused }) =>
                `p-0 transition-transform duration-200 ${isFocused ? "text-[#03457C] rotate-180" : "text-slate-400 hover:text-slate-600"}`,
            clearIndicator: () => "p-0 text-slate-400 hover:text-rose-300 transition-colors",
            menu: () =>
                "mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden text-[13px] z-50 py-1 animate-in fade-in zoom-in-95 duration-100",
            option: ({ isFocused, isSelected }) =>
                `px-4 py-2 cursor-pointer text-xs sm:text-[13px] font-medium transition-colors capitalize ${
                    isSelected
                        ? "bg-[#03457C] text-white font-semibold"
                        : isFocused
                        ? "bg-[#03457C]/10 text-[#03457C]"
                        : "text-slate-700 hover:bg-slate-50"
                }`,
            noOptionsMessage: () => "text-xs text-slate-400 py-2",
            }}
            styles={{
                control: (base) => ({
                    ...base,
                    minHeight: "40px",
                    cursor: "pointer",
                }),
            }}
        />
    )
}