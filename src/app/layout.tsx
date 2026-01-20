import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/ui/BottomNav";
import { AuthWrapper } from "@/components/Auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlacoGym | Shred Workout Tracker",
  description: "Registro de entrenamientos de fuerza para alto rendimiento.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-black transition-colors duration-500`}>
        <AuthWrapper>
          <main className="pb-32 max-w-2xl mx-auto px-4 pt-12">
            {children}
          </main>
          <BottomNav />
        </AuthWrapper>
      </body>
    </html>
  );
}
