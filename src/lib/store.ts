"use client";

import { useEffect, useState } from "react";
import { AppStore, Workout, UserProfile, WorkoutEntry } from "./types";

const STORAGE_KEY = "placogym_store";

const initialStore: AppStore = {
    user: {
        birthday: "1965-01-01",
        heightCm: 189,
        weightKg: 89,
        units: "kg",
    },
    activeWorkout: null,
    history: [],
};

// Safe UUID alternative for insecure contexts (HTTP)
function generateUUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function useStore() {
    const [store, setStore] = useState<AppStore>(initialStore);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const logged = localStorage.getItem("placogym_logged") === "true";
        if (saved) {
            const parsed = JSON.parse(saved);
            // Handle migration from age to birthday if needed
            if (parsed.user && typeof parsed.user.age === 'number') {
                const year = new Date().getFullYear() - parsed.user.age;
                parsed.user.birthday = `${year}-01-01`;
                delete parsed.user.age;
            }
            setStore(parsed);
        }
        setIsLogged(logged);
        setIsInitialized(true);
    }, []);

    const save = (newStore: AppStore) => {
        setStore(newStore);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
    };

    const login = (email: string) => {
        localStorage.setItem("placogym_logged", "true");
        setIsLogged(true);
        save({ ...store, user: { ...store.user } }); // Ensure sync
    };

    const startWorkout = (name: string = "Entrenamiento") => {
        const newWorkout: Workout = {
            id: generateUUID(),
            name,
            startAt: new Date().toISOString(),
            warmupSeconds: 0,
            entries: [],
            totalVolume: 0,
            totalSets: 0,
            squatsCount: 0,
            absCount: 0,
        };
        save({ ...store, activeWorkout: newWorkout });
    };

    const addExerciseToActive = (exerciseId: string, exerciseName: string) => {
        if (!store.activeWorkout) return;
        const newEntry: WorkoutEntry = {
            id: generateUUID(),
            exerciseId,
            exerciseName,
            sets: [],
        };
        save({
            ...store,
            activeWorkout: {
                ...store.activeWorkout,
                entries: [...store.activeWorkout.entries, newEntry],
            },
        });
    };

    const addSetToEntry = (entryId: string, data: { weight?: number; reps?: number; durationSeconds?: number; distanceKm?: number }) => {
        if (!store.activeWorkout) return;
        const newWorkout = { ...store.activeWorkout };
        const entry = newWorkout.entries.find((e) => e.id === entryId);
        if (!entry) return;

        entry.sets.push({
            id: generateUUID(),
            ...data,
            completedAt: new Date().toISOString(),
        });

        newWorkout.totalSets = newWorkout.entries.reduce((sum, e) => sum + e.sets.length, 0);
        newWorkout.totalVolume = newWorkout.entries.reduce((sum, e) => {
            return sum + e.sets.reduce((esum, s) => esum + ((s.weight || 0) * (s.reps || 1)), 0);
        }, 0);

        save({ ...store, activeWorkout: newWorkout });
    };

    const deleteWorkout = (id: string) => {
        save({
            ...store,
            history: store.history.filter(w => w.id !== id)
        });
    };

    const finishWorkout = () => {
        if (!store.activeWorkout) return;
        const finishedWorkout = {
            ...store.activeWorkout,
            endAt: new Date().toISOString(),
        };
        save({
            ...store,
            activeWorkout: null,
            history: [finishedWorkout, ...store.history],
        });
    };

    const discardActiveWorkout = () => {
        save({
            ...store,
            activeWorkout: null
        });
    };

    const getLastSessionData = (exerciseId: string) => {
        for (const workout of store.history) {
            const entry = workout.entries.find(e => e.exerciseId === exerciseId);
            if (entry && entry.sets.length > 0) {
                return entry.sets[entry.sets.length - 1]; // Return last set data
            }
        }
        return null;
    };

    const updateWorkoutName = (name: string) => {
        if (!store.activeWorkout) return;
        save({
            ...store,
            activeWorkout: { ...store.activeWorkout, name },
        });
    };

    const repeatWorkout = (workoutId: string) => {
        const sourceWorkout = store.history.find((w) => w.id === workoutId);
        if (!sourceWorkout) return;

        const newWorkout: Workout = {
            id: generateUUID(),
            name: sourceWorkout.name,
            startAt: new Date().toISOString(),
            warmupSeconds: 0,
            entries: sourceWorkout.entries.map((entry) => ({
                id: generateUUID(),
                exerciseId: entry.exerciseId,
                exerciseName: entry.exerciseName,
                sets: [],
            })),
            totalVolume: 0,
            totalSets: 0,
            squatsCount: 0,
            absCount: 0,
        };
        save({ ...store, activeWorkout: newWorkout });
    };

    return {
        store,
        isInitialized,
        isLogged,
        login,
        startWorkout,
        updateWorkoutName,
        repeatWorkout,
        addExerciseToActive,
        addSetToEntry,
        deleteWorkout,
        discardActiveWorkout,
        finishWorkout,
        getLastSessionData,
        updateUser: (user: UserProfile) => save({ ...store, user }),
    };
}
