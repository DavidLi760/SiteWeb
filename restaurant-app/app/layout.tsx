import type { Metadata } from "next";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { Noto_Serif_JP, Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";

const noto = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sushi House",
  description: "Restaurant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getSession();

  return (
    <html
      lang="fr"
      className={`${noto.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-gradient-to-r from-[#FFFBFB] to-[#FFFFFF] min-h-full flex flex-col">
        <Navbar user={user} />
        {children}
        <Footer />
      </body>
    </html>
  );
}