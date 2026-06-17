import type { Metadata } from "next";
import localFont from "next/font/local";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import "./globals.css";

export const metadata: Metadata = {
  title: "ことばのクローバー！回答生成",
  description: "ことばのクローバー！の模範回答を生成するアプリ",
};

const uzura = localFont({
  src: "../../public/fonts/uzura.ttf",
  variable: "--font-uzura",
  display: "block",
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja" className={`${uzura.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LoadingOverlay />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
