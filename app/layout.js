import "./globals.css";

export const metadata = {
  title: "VectorPay",
  description: "",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light" >
      <body>
       {children}
      </body>
    </html>
  );
}
