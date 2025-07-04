import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/NextAuthProvider"; // プロバイダーをインポート
import Header from "@/components/Header"; // ヘッダーをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "スタンプラリーアプリ",
  description: "市内の観光地を巡ろう！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <NextAuthProvider> {/* ここでラップ */}
          <Header />
          <main>{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}