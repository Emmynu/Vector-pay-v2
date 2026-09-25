

export const metadata = {
  title: "VectorPay - Account Access & Onboarding",
  description: "Log in or create your VectorPay account to manage instant deposits, fast transfers, real-time settlements, and workspace balances securely.",
};

export default function RootLayout({ children }) {
  return (
   
      <main className={`h-full antialiased`}>
        <div className="min-h-full">
            {children}
        </div>
        
      </main>
    
  );
}
