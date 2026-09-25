import DashboardLayout from "../libs/ui/dashboard/dashboard-layout";
import ProtectedRoute from "../libs/ui/protectedRoutes";


export const metadata = {
  title: "VectorPay - Dashboard",
  description: "",
};

export default function RootLayout({ children }) {
  return (
   
      <main className={`h-full antialiased`}>
        <div className="min-h-full">
           <ProtectedRoute role={"user"} children={children}>
              <DashboardLayout isAdmin={false} children={children} />
            </ProtectedRoute>            
        </div>
        
      </main>
    
  );
}
