

export const metadata = {
  title: "VectorPay - Admin Portal Authentication",
  description: "Secure administrative login to manage system transactions, KYC approvals, platform settings, and user access.",
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
