import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ことばのクローバー！回答生成",
  description: "ことばのクローバー！の模範回答を生成するアプリ",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
};

export default RootLayout;
