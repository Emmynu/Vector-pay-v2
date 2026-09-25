"use client"
import { useUser } from "@/app/auth/api/profile";
import ProfileHeader from "@/app/libs/ui/profile/profile-header";
import ProfileDetails from "@/app/libs/ui/profile/profile-info";
import TransactionPINPanel from "@/app/libs/ui/profile/transaction-pin-panel";
import KYCPanel from "@/app/libs/ui/profile/kyc-panel";

function Profile() {
  const { data: user, isLoading } = useUser()

    return (    
        <main className="space-y-4">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
            <ProfileHeader user={user} isLoading={isLoading} />
            <ProfileDetails user={user} isLoading={isLoading}/>
          </section>

          <TransactionPINPanel user={user} isLoading={isLoading}/>
          <KYCPanel user={user} isLoading={isLoading}/>

        </main> 

     );
}
export default Profile;