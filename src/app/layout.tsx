import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenAi Project",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="w-full  bg-red-100 flex justify-center items-center">
          HEADER
        </div>
        {children}
        <div className="w-full h-[100px] bg-red-100 flex justify-center items-center">
          FOOTER
        </div>
      </body>
    </html>
  );
}
