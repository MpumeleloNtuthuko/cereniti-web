import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "sonner"; // <--- Import Sonner Toaster
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/auth-provider"; 

// Configure Fonts
const sansFont = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

const serifFont = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif" 
});

export const metadata: Metadata = {
  title: "Cereniti | Managed Home Care",
  description: "Experience-driven home and space care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans",
          sansFont.variable,
          serifFont.variable
        )}
      >
        {/* WRAP EVERYTHING INSIDE AUTH PROVIDER */}
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Global Toast Notifications */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}