import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "A2 Ghee, Raw Honey, Atta & Cold Pressed Oils | YourBrand",
  description: "Pure, traditional foods delivered across India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-white text-gray-900 antialiased`}>{children}</body>
    </html>
  );
}
