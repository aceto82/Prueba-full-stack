import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/contexts/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App de Prescripciones",
  description: "Sistema de prescripciones médicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <SessionProvider>{children}</SessionProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}