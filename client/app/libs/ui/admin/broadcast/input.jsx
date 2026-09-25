"use client"

import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
import { bricolage, quicksand } from "@/app/libs/utils/font";
import { Send, Loader2 } from "lucide-react";
import { useBroadcast } from "@/app/admin/api/broadcast";
import { useState } from "react";
import { showToast } from "@/app/libs/toast/sonner";

function BroadcastInput({
    title,
    setTitle,
    content,
    setContent,
    mailTo,
    setMailTo
}) {
    const { broadcast, isBroadcasting } = useBroadcast();
    const [errors, setErrors] = useState({ title: "", content: "" });

   
    const getPlainContentLength = (htmlString) => {
        if (!htmlString) return 0;
        return htmlString.replace(/<[^>]*>/g, '').trim().length;
    };

    const validate = () => {
        let titleErr = "";
        let contentErr = "";

       
        const titleRegex = /^[A-Za-z0-9\s.,!?'&()\-]+$/;
        if (!title || title.trim().length < 3 || title.trim().length > 90) {
            titleErr = "Title must be between 3 and 90 characters.";
        } else if (!titleRegex.test(title)) {
            titleErr = "Only letters, numbers, and basic punctuation are allowed.";
        }

     
        const plainTextLen = getPlainContentLength(content);
        if (!content || plainTextLen < 3) {
            contentErr = "Message content must be at least 3 characters long.";
        }

        if(!mailTo){
            showToast({ type: "error", title: "Recipient required", msg: "Please select recipient for this broadcast" })
        }


        setErrors({ title: titleErr, content: contentErr });
        return !titleErr && !contentErr;
    };

    async function handleBroadcast() {
        if (!validate()) return;
        
        const formData = {
            title: title.trim(),
            content:content.trim(),
            mailTo
        };

        const resp = await broadcast(formData);
        if(resp?.status === 200){
            setContent("")
            setErrors("")
            setMailTo(null)
            setTitle("")
        }
    }

    return ( 
        <main className="!w-full space-y-6 !bg-white rounded-2xl border border-gray-200 p-7 col-span-1 md:col-span-2 xl:col-span-3">
            <header className="flex flex-col">
                <h2 className="text-[17px] sm:text-lg font-bold text-slate-900 flex items-center gap-2" style={bricolage.style}>Compose message</h2>
                <p className="text-xs text-slate-500" style={quicksand.style}>Title and rich content delivered to the selected audience.</p>
            </header>
            
            <section className="space-y-4">
                {/* Title Input Fieldset */}
                <fieldset className="fieldset">
                    <label htmlFor="title" className="uppercase text-gray-600 font-bold" style={bricolage.style}>Title</label>

                    <input 
                        type="text" 
                        className={`input validator bg-[#FFF] w-full text-xs !border ${errors.title ? '!border-red-500' : '!border-slate-600'} !text-slate-700 placeholder:!text-slate-700 rounded-md`} 
                        style={quicksand.style} 
                        required 
                        placeholder="e.g. New Instant transfer limits are live" 
                        pattern="[A-Za-z0-9\s.,!?'&()\-]+" 
                        minLength={3} 
                        maxLength={90} 
                        title="Only letters, numbers or dash" 
                        value={title} 
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors(prev => ({ ...prev, title: "" }));
                        }}
                    />

                    {errors.title && (
                        <p className="text-red-500 text-xs mt-1" style={quicksand.style}>
                            {errors.title}
                        </p>
                    ) }
                </fieldset>

                {/* Content Rich Editor Fieldset */}
                <fieldset className="my-2">
                    <label htmlFor="content" className="uppercase text-gray-600 text-xs font-bold" style={bricolage.style}>Content</label>
                    <div 
                        className={`!mt-0.5 ${quicksand.className}
                        [&_.ql-toolbar]:bg-slate-50 
                        [&_.ql-toolbar]:!border-gray-400 
                        [&_.ql-toolbar]:rounded-t-xl 
                        [&_.ql-container]:!border-gray-400 
                        [&_.ql-container]:rounded-b-xl 
                        [&_.ql-container]:bg-white 
                        [&_.ql-container]:!font-sans
                        [&_.ql-editor]:min-h-[180px] 
                        [&_.ql-editor]:text-slate-700 
                        [&_.ql-editor]:!font-sans
                        [&_.ql-editor.ql-blank::before]:text-slate-400 
                        [&_.ql-editor.ql-blank::before]:not-italic
                        [&_.ql-editor.ql-blank::before]:!font-sans
                        focus-within:[&_.ql-toolbar]:border-[#03457C]
                        focus-within:[&_.ql-container]:border-[#03457C]
                        ${errors.content ? '[&_.ql-toolbar]:!border-red-500 [&_.ql-container]:!border-red-500' : ''}`}
                        style={{ fontFamily: quicksand.style.fontFamily }}
                    >
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={(val) => {
                                setContent(val);
                                if (errors.content) setErrors(prev => ({ ...prev, content: "" }));
                            }}
                        />
                    </div>

                    {errors.content && (
                        <p className="text-red-500 text-xs mt-1.5" style={quicksand.style}>
                            {errors.content}
                        </p>
                    )}
                </fieldset>
            </section>

            <footer className="flex items-center justify-end">
                <button 
                    disabled={isBroadcasting}
                    className="flex items-center border-none outline-none gap-1 bg-[#03457C] hover:bg-[#023158] text-white btn rounded-lg disabled:opacity-60 transition-all cursor-pointer" 
                    onClick={handleBroadcast}
                >
                    {isBroadcasting ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span style={bricolage.style}>Broadcasting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-3.5 h-3.5"/>
                            <span style={bricolage.style}>Broadcast</span>
                        </>
                    )}
                </button>
            </footer>
        </main>
    );
}

export default BroadcastInput;