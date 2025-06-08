
import SideBarProvider from "../../libs/provider";

export const metadata = {
  title: "VectorPay - Dashboard", // generate a dynamic metadata
  description: "",
};



export default function RootLayout({ children }) {
     return (
    <html lang="en" suppressHydrationWarning data-theme="light" >
      <body>
       <main  className="main-container ">
            <SideBarProvider />
            <section>
                {children}
            </section>
       </main>

      </body>
    </html>
  );
}
