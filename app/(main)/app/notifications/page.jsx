"use client"

import { useEffect, useState } from "react";
import "../../../styles/notifications.css"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase-client";
import { getNotifications, updateNotificationStatus } from "../../../actions/payment";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";


function Notifications() {
    const [uid, setUid] = useState(null)
    const [notifications, setNotifications] = useState(null)

    useEffect(()=>{
        onAuthStateChanged(auth, user => setUid(user?.uid))
    },[])

    useEffect(()=>{
        async function fetchNotifications() {
            if (uid) {
                const notifications = await getNotifications(uid)
                if (notifications?.error) {
                    console.log(notifications?.error);
                } else {
                    setNotifications(notifications)
                } 
            }
        }
        fetchNotifications()
    },[uid])

    async function updateStatus(id) {
       const result = await updateNotificationStatus(id)
       if (result?.error) {
            toast.error(result.error)
       } else {
            toast.success("Successfully marked as read")
            setTimeout(() => {
                window.location = "/app/notifications"
            }, 1000);
       }
    }
    
    return ( 
        <main className="notifications-container">
            <section>
                <h2>All Notifications</h2>
            </section>
            <section className="notification-container">
                {notifications?.map(notification=>{
                    const {status, type, accountNumber, amount, senderId, senderName, createdAt, id} =  notification
                    const formattedAmount =  new Intl.NumberFormat("en-US").format(amount)
                    const time =  formatDistanceToNow(createdAt)
                    return(
                        <article className={status === "unread" ? "bg-blue-50" : "bg-slate-50"}>
                            <img src="https://th.bing.com/th/id/OIP.LkKOiugw5AFfDfUzuPAG4QHaI5?rs=1&pid=ImgDetMain" alt="" className="w-8 md:w-10 h-8 md:h-10 rounded-full"/>
                           <main className="ml-2 md:ml-5 w-full">
                                <div className="flex justify-between items-center">
                                    <h2 className="title">{type === "request" ? <span><b>{senderName}</b> requested ₦{formattedAmount} from you</span>: <span>
                                    {formattedAmount} as been sent to your account by  <b>{senderName}</b></span>}</h2>
                                    <h4 className="time">{time}</h4>
                                </div>
                                {(type=== "request" && senderId === uid) && <div>
                                    <button>Transfer</button>
                                    <button>Decline</button>
                                    </div>}
                           </main>
                           {/* <button className="w-3 h-3 bg-main rounded-full ml-5"></button> */}
                        </article>
                    )
                })}
            </section>
        </main>
     );
}

export default Notifications;