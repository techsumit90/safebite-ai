import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SafeBite AI — AI-Powered Food Safety Analyzer",
  description:
    "Scan food labels with AI to instantly know if ingredients are safe for your health conditions. Get Green/Yellow/Red safety ratings powered by OpenAI.",
  keywords: "food safety, AI food analyzer, ingredient scanner, health food, OCR food label",
  openGraph: {
    title: "SafeBite AI — AI-Powered Food Safety Analyzer",
    description: "Know exactly what's in your food before you eat it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
