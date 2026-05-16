import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VoiceProvider } from "@/contexts/VoiceContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "英语口语练习",
  description: "移动端英语口语练习应用",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "英语口语练习",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <VoiceProvider>{children}</VoiceProvider>
      </body>
    </html>
  );
}
