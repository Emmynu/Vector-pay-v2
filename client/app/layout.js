import "./globals.css";
import { Toaster } from "sonner";
import Provider from "./libs/providers/provider";

export const metadata = {
  title: {
    default: "VectorPay | Your Financial Future",
  },
  description: "Your central workspace to move money, manage your wallet, view analytics, and handle fast settlements with zero friction.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
         <Provider>{children}</Provider>
        <Toaster duration={3000} closeButton style={{zIndex: 100}}/>
      </body>
    </html>
  );
}
