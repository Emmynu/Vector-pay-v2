import "@/app/globals.css"
import { bricolage, quicksand } from "../../utils/font"
import { ChevronRight, ChevronLeft } from "lucide-react"


export default function CustomPagination({ 
    currentPage = 1, 
    limit = 10, 
    total = 0, 
    hasMore = false, 
    isLoading = false, 
    handlePrev, 
    handleNext, 
    itemLabel = "item",       
    pluralLabel          
}) {
    const totalPages = Math.ceil(total / limit) || 1;
    const label = total === 1 ? itemLabel : (pluralLabel || `${itemLabel}s`);

    return (
        <div className="flex justify-between items-center pt-2">
            <div>
                <p className="text-xs text-gray-500" style={quicksand.style}>
                    Page <span className="font-semibold text-gray-800">{currentPage}</span> of{" "}
                    <span className="font-semibold text-gray-800">{totalPages}</span>{" "}
                    <span>({total} {label})</span>
                </p>
            </div>

            <div className="flex items-center space-x-1">
                <button 
                    type="button"
                    onClick={handlePrev} 
                    className={`${bricolage.className} pagination-btn !bg-white border border-[#03457c] !hover:opacity-80 !disabled:opacity-80 disabled:cursor-not-allowed`} 
                    disabled={currentPage === 1 || isLoading}
                >
                    <ChevronLeft className="w-4 h-4 "/>
                    Previous
                </button>
                <button 
                    type="button"
                    onClick={handleNext} 
                    className={`${bricolage.className} pagination-btn !bg-[#03457C] !text-white disabled:opacity-50 disabled:cursor-not-allowed`} 
                    disabled={!hasMore || isLoading}
                >
                    Next
                    <ChevronRight className="w-4 h-4"/>
                </button>
            </div>
        </div>
    )
}