"use client";

import { useStore } from "@/lib/store";
import { User, Shield, Info, LogOut, ChevronRight, Settings } from "lucide-react";

export default function ProfilePage() {
    const { store, updateUser, isInitialized } = useStore();

    if (!isInitialized) return null;

    const calculateAge = (birthday: string) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleUpdate = (field: string, value: any) => {
        updateUser({ ...store.user, [field]: value });
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-shred-neon flex items-center justify-center text-black">
                    <User size={48} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-4xl font-black uppercase">PERFIL</h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-1">Usuario Elite</p>
                </div>
            </div>

            <section className="flex flex-col gap-4">
                <h2 className="text-xs font-black text-shred-neon uppercase tracking-[0.2em] mb-2">Datos Bio</h2>

                <div className="shred-card flex flex-col gap-6">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex flex-col">
                            <span className="font-bold uppercase text-white/60 text-[10px] tracking-widest">Nacimiento</span>
                            <span className="text-xs text-white/20 uppercase font-black">{calculateAge(store.user.birthday)} Años</span>
                        </div>
                        <input
                            type="date"
                            value={store.user.birthday}
                            onChange={(e) => handleUpdate("birthday", e.target.value)}
                            className="bg-transparent text-right font-black text-xl w-40 focus:text-shred-neon outline-none"
                        />
                    </div>

                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                        <span className="font-bold uppercase text-white/60">Altura (CM)</span>
                        <input
                            type="number"
                            value={store.user.heightCm}
                            onChange={(e) => handleUpdate("heightCm", parseInt(e.target.value))}
                            className="bg-transparent text-right font-black text-2xl w-20 focus:text-shred-neon outline-none"
                        />
                    </div>

                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                        <span className="font-bold uppercase text-white/60">Peso (KG)</span>
                        <input
                            type="number"
                            step="0.1"
                            value={store.user.weightKg}
                            onChange={(e) => handleUpdate("weightKg", parseFloat(e.target.value))}
                            className="bg-transparent text-right font-black text-2xl w-24 focus:text-shred-neon outline-none"
                        />
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-xs font-black text-shred-blue uppercase tracking-[0.2em] mb-2">Preferencias</h2>

                <div className="flex flex-col gap-3">
                    <button className="shred-card py-4 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <Shield className="text-white/40 group-hover:text-shred-blue transition-colors" size={20} />
                            <span className="font-bold uppercase">Seguridad</span>
                        </div>
                        <ChevronRight size={18} className="text-white/10" />
                    </button>

                    <button className="shred-card py-4 flex justify-between items-center group">
                        <div className="flex items-center gap-3 text-red-500">
                            <LogOut size={20} />
                            <span className="font-bold uppercase">Cerrar Sesión</span>
                        </div>
                    </button>
                </div>
            </section>

            <div className="mt-8 text-center opacity-20 flex flex-col items-center gap-2">
                <Settings size={24} />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">Versión 1.1.2 (Apple Health Ready)</span>
            </div>
        </div>
    );
}
