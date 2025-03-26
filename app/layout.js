import "./globals.css";
import { Theme } from "./provider/theme";

export const metadata = {
  title: "VectorPay",
  description: "",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body>
        <Theme children={children}></Theme>
      </body>
    </html>
  );
}
