"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Clock, Zap, Target, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type Range = "SEMANA" | "MES" | "AÑO";

export default function ProgressPage() {
    const { store, isInitialized } = useStore();
    const [range, setRange] = useState<Range>("SEMANA");

    if (!isInitialized) return null;

    const getDaysForRange = (r: Range) => {
        if (r === "SEMANA") return 7;
        if (r === "MES") return 30;
        return 365;
    };

    const filteredHistory = store.history.filter(w => {
        const date = new Date(w.startAt);
        const diff = Date.now() - date.getTime();
        return diff <= getDaysForRange(range) * 24 * 60 * 60 * 1000;
    });

    const periodDays = new Set(filteredHistory.map(w => new Date(w.startAt).toDateString())).size;
    const periodDurationMinutes = filteredHistory.reduce((acc, w) => {
        if (!w.endAt) return acc;
        return acc + (new Date(w.endAt).getTime() - new Date(w.startAt).getTime()) / 60000;
    }, 0);
    const periodHours = (periodDurationMinutes / 60).toFixed(1);
    const periodVolume = filteredHistory.reduce((acc, w) => acc + w.totalVolume, 0);

    // Prepare data for Volume Chart (Show up to 12 points depending on range)
    const points = range === "SEMANA" ? 7 : range === "MES" ? 10 : 12;
    const volumeData = filteredHistory
        .map((w) => ({
            date: new Date(w.startAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
            volume: w.totalVolume,
        }))
        .slice(0, points)
        .reverse();

    // Prepare data for Time Chart
    const timeData = filteredHistory
        .map((w) => ({
            date: new Date(w.startAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
            minutos: w.endAt ? Math.floor((new Date(w.endAt).getTime() - new Date(w.startAt).getTime()) / 60000) : 0,
        }))
        .slice(0, points)
        .reverse();

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex justify-between items-end">
                <h1 className="shred-title mb-0">PROGRESO</h1>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    {(["SEMANA", "MES", "AÑO"] as Range[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest transition-all",
                                range === r ? "bg-shred-neon text-black" : "text-white/40"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="shred-card border-b-4 border-b-shred-neon h-full">
                    <div className="flex items-center gap-2 mb-2 text-white/40">
                        <Calendar size={16} />
                        <span className="text-[10px] uppercase font-black tracking-widest">Días Entrenados</span>
                    </div>
                    <div className="text-3xl font-black">
                        {periodDays} <span className="text-sm opacity-40">DÍAS</span>
                    </div>
                </div>
                <div className="shred-card border-b-4 border-b-shred-blue h-full">
                    <div className="flex items-center gap-2 mb-2 text-white/40">
                        <Clock size={16} />
                        <span className="text-[10px] uppercase font-black tracking-widest">Horas Totales</span>
                    </div>
                    <div className="text-3xl font-black">
                        {periodHours} <span className="text-sm opacity-40">H</span>
                    </div>
                </div>
            </div>

            <div className="shred-card">
                <div className="flex items-center gap-2 mb-2 text-white/40">
                    <TrendingUp size={16} />
                    <span className="text-[10px] uppercase font-black tracking-widest">Volumen del Periodo</span>
                </div>
                <div className="text-3xl font-black">
                    {periodVolume.toLocaleString()} <span className="text-sm opacity-40">KG</span>
                </div>
            </div>

            {/* Volume Chart */}
            <section className="shred-card p-4 h-[300px]">
                <h3 className="text-sm font-black uppercase text-shred-neon mb-4 tracking-widest flex items-center gap-2">
                    <Zap size={16} fill="currentColor" /> Evolución de Volumen
                </h3>
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#ffffff40"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: "#000", border: "1px solid #ffffff20", borderRadius: "12px" }}
                                itemStyle={{ color: "#9fff00", fontWeight: "bold" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="volume"
                                stroke="#9fff00"
                                strokeWidth={4}
                                dot={{ fill: "#9fff00", strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 8, stroke: "#000", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Time Chart */}
            <section className="shred-card p-4 h-[300px]">
                <h3 className="text-sm font-black uppercase text-shred-blue mb-4 tracking-widest flex items-center gap-2">
                    <Target size={16} fill="currentColor" /> Tiempo por Sesión (MIN)
                </h3>
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={timeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#ffffff40"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: "#000", border: "1px solid #ffffff20", borderRadius: "12px" }}
                                itemStyle={{ color: "#00e0ff", fontWeight: "bold" }}
                            />
                            <Bar
                                dataKey="minutos"
                                fill="#00e0ff"
                                radius={[10, 10, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
}
