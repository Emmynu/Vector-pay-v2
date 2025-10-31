"use client"

import { useEffect, useState } from "react";
import "../../../styles/notifications.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase-client";
import { getNotifications, updateNotificationStatus } from "../../../actions/payment";
import { formatDistanceToNow } from "date-fns";
import { toast, Toaster } from "sonner";


function Notifications() {
    const [uid, setUid] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [notifications, setNotifications] = useState(null)

    useEffect(()=>{
        onAuthStateChanged(auth, user => setUid(user?.uid))
    },[])

    useEffect(()=>{
        async function fetchNotifications() {
            if (uid) {
                const notifications = await getNotifications(uid)
                if (notifications?.error) {
                    toast.error(notifications?.error);
                } else {
                    setNotifications(notifications)
                } 
            }
        }
        fetchNotifications()
    },[uid])

    async function updateStatus(id) {
        setIsLoading(true)
       const result = await updateNotificationStatus(id)
       if (result?.error) {
            toast.error(result.error)
       } else {
            toast.success("Successfully marked as read")
            setTimeout(() => {
                window.location = "/app/notifications"
            }, 1000);
       }
       setIsLoading(false)   
    }

    function handleTransfer(accountNumber, amount){
        localStorage.setItem("requester-info", JSON.stringify({accountNumber, amount}))
        setTimeout(() => {
            window.location = "/app/transfer"
        }, 1000);
    }
    
    return ( 
        <main className="notifications-container">
            <section>
                <h2>All Notifications</h2>
            </section>
           {notifications?.length > 0 ? <section className="notification-container">
                {notifications?.map(notification=>{
                    const {status, type, accountNumber, amount, senderId, senderName, createdAt, name, id} =  notification
                    console.log(notifications);
                    
                    const formattedAmount =  new Intl.NumberFormat("en-US").format(amount)
                    const time =  formatDistanceToNow(createdAt)
                    return(
                        <article className={status === "unread" ? "bg-blue-50 shadow-sm" : "bg-slate-50 shadow-sm"}>
                            <img src="https://th.bing.com/th/id/OIP.LkKOiugw5AFfDfUzuPAG4QHaI5?rs=1&pid=ImgDetMain" alt="" className="w-8 md:w-10 h-8 md:h-10 rounded-full"/>
                           <main className="ml-2 md:ml-5 w-full">
                            {/* userId = senderId (sender is logged in) ___ requested money from you */}
                            {/* userId != senderId (requester is logged in) you requested money from senderName */}
                                <div className="flex justify-between ">
                                    <div className="flex flex-col items-start">
                                        <h2 className="title">{type === "request" ? 
                                            <div>
                                                {uid === senderId ? <h6>{name} requested ₦{formattedAmount} from you</h6>: <h6>You requested ₦{formattedAmount} from {senderName}</h6>}
                                            </div>
                                            :
                                            <div>
                                                {uid === senderId ? <h6>You sent ₦{formattedAmount} to {name}</h6>: <h6> ₦{formattedAmount} as been sent by {senderName}</h6>}
                                            </div>}
                                        </h2>
                                        <h4 className="time">{time}</h4>
                                    </div>
                                    <button className=" text-main font-medium text-xs md:text-sm" onClick={()=>updateStatus(id)}>{isLoading ? <span className="loading loading-spinner loading-xs"></span>: "View"}</button>
                                </div>
                                {(type=== "request" && senderId === uid) && <div>
                                    <button className="notification-button" onClick={()=>handleTransfer(accountNumber,amount)}>Transfer</button>
                                    <button className="notification-button n-btn2">Decline</button>
                                    </div>}
                           </main>
                           <hr/>
                        </article>
                    )
                })}
            </section>: 
            
            <section className="notification-empty">
                <img src="https://th.bing.com/th/id/OIP.ZsjPQuS9XJsVY_JFsHvn9QHaHa?rs=1&pid=ImgDetMain" alt="" />
                <h2>Notification History empty</h2> 
            </section>}
         <Toaster richColors closeButton position="bottom-right" />

        </main>
        
     );
}

export default Notifications;