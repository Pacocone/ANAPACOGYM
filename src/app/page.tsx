"use client";

import { useStore } from "@/lib/store";
import { Plus, Play, History as HistoryIcon, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function Home() {
  const { store, startWorkout, isInitialized } = useStore();

  if (!isInitialized) return null;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Section */}
      <section>
        <h1 className="shred-title opacity-60 uppercase text-sm tracking-widest mb-2">Resumen</h1>
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-black uppercase tracking-tight">PAPISGYM</h2>
        </div>
      </section>

      {/* Primary Action Button */}
      <section>
        {store.activeWorkout ? (
          <Link href="/workout" className="shred-button-xl shred-button-primary shred-neon-glow gap-4">
            <Play fill="currentColor" size={24} />
            CONTINUAR SESIÓN
          </Link>
        ) : (
          <button
            onClick={() => startWorkout()}
            className="shred-button-xl shred-button-primary shred-neon-glow gap-4"
          >
            <Plus size={32} strokeWidth={3} />
            INICIAR ENTRENAMIENTO
          </button>
        )}
      </section>

      {/* Grid Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div className="shred-card flex flex-col gap-2">
          <TrendingUp className="text-shred-neon" size={24} />
          <span className="text-3xl font-black">{store.history.length}</span>
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Sesiones Totales</span>
        </div>
        <div className="shred-card flex flex-col gap-2">
          <HistoryIcon className="text-shred-blue" size={24} />
          <span className="text-3xl font-black">--</span>
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Último PR</span>
        </div>
      </section>

      {/* Recent History Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black uppercase tracking-tight">Actividad Reciente</h3>
          <Link href="/history" className="text-shred-neon text-xs font-bold uppercase tracking-widest">Ver todo</Link>
        </div>

        <div className="flex flex-col gap-4">
          {store.history.length === 0 ? (
            <div className="shred-card text-center py-10 opacity-40 italic">
              Aún no has registrado ningún entrenamiento esta semana.
            </div>
          ) : (
            store.history.slice(0, 3).map((workout) => (
              <Link
                key={workout.id}
                href={`/history/${workout.id}`}
                className="shred-card flex justify-between items-center group active:scale-95 transition-transform"
              >
                <div>
                  <h4 className="font-bold text-lg">{workout.name}</h4>
                  <p className="text-sm text-white/40 capitalize">
                    {formatDistanceToNow(new Date(workout.startAt), { addSuffix: true, locale: es })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-shred-neon font-black text-xl leading-none">
                    {Math.round(workout.totalVolume)} kg
                  </div>
                  <div className="text-[10px] uppercase font-bold text-white/40">Volumen</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
