"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, History, LineChart, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Entrenar", icon: Dumbbell, href: "/" },
    { label: "Ejercicios", icon: Search, href: "/exercises" },
    { label: "Historial", icon: History, href: "/history" },
    { label: "Progreso", icon: LineChart, href: "/progress" },
    { label: "Perfil", icon: User, href: "/profile" },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-black/80 backdrop-blur-xl border-t border-white/10 md:hidden">
            <div className="flex justify-around items-center max-w-lg mx-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 transition-colors",
                                isActive ? "text-shred-neon" : "text-gray-500"
                            )}
                        >
                            <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
