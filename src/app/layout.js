import { Inter } from "next/font/google"
import "./globals.css";
import StoreProvider from "./StoreProvider";

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: "QR-Order-Admin",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
