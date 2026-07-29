import "./globals.css";
import { Toaster } from "sonner";
import Provider from "./libs/providers/provider";

export const metadata = {
  title: "VectorPay - Your Financial Future!",
  description: "Your Financial Future!",
 
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
         <Provider>{children}</Provider>
        <Toaster duration={3000} closeButton/>
      </body>
    </html>
  );
}
