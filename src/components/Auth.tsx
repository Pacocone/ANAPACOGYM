"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { User, Lock, Mail, ChevronRight } from "lucide-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isLogged, login, isInitialized } = useStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    if (!isInitialized) return null;

    if (!isLogged) {
        return (
            <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-shred-dark to-black overflow-y-auto">
                <div className="w-full max-w-sm flex flex-col gap-10">
                    <div className="text-center">
                        <h1 className="shred-title text-5xl mb-2">PLACO<span className="text-shred-neon">GYM</span></h1>
                        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">Élite Training System</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                            <input
                                type="email"
                                placeholder="EMAIL"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 font-black text-lg focus:border-shred-neon outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                            <input
                                type="password"
                                placeholder="CONTRASEÑA"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 font-black text-lg focus:border-shred-neon outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => login(email)}
                        className="shred-button-xl shred-button-primary shred-neon-glow group"
                    >
                        ENTRAR <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">
                        Al continuar aceptas los <span className="text-white underline">Términos de Uso</span> y la <span className="text-white underline">Privacidad</span>.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
