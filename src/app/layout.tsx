import type { Metadata } from "next";
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
    <div className="w-full h-[5dvh] flex justify-center items-center">
      HEADER
    </div>
    {children}
    <div className="w-full h-[5dvh] flex justify-center items-center">
      <span>FOOTER</span>
    </div>
    </body>
    </html>
  );
}
