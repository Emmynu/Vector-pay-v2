import DashboardLayout from "@/app/libs/ui/dashboard/dashboard-layout";
import ProtectedRoute from "@/app/libs/ui/protectedRoutes";


export const metadata = {
  title: "VectorPay - Admin Dashboard",
  description: "",
};

export default function RootLayout({ children }) {
  return (
   
      <main className={`h-full antialiased`}>
        <div className="min-h-full">
           <ProtectedRoute role={"admin"} children={children}>
               <DashboardLayout isAdmin={true} children={children}/> 
            </ProtectedRoute>           
        </div>
        
      </main>
    
  );
}
