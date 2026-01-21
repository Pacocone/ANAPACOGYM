"use client";

import { useEffect, useState, useCallback } from "react";
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

// Global singleton for the store data to avoid stale closures in hooks
let globalStore = initialStore;
let listeners: Array<(store: AppStore) => void> = [];

const notify = () => listeners.forEach(l => l(globalStore));

// Safe UUID alternative
function generateUUID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Global actions that work anywhere
export const storeActions = {
    save: (newStore: AppStore) => {
        globalStore = newStore;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
        notify();
    },

    startWorkout: (name: string = "Entrenamiento") => {
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
        storeActions.save({ ...globalStore, activeWorkout: newWorkout });
    },

    addExerciseToActive: (exerciseId: string, exerciseName: string) => {
        if (!globalStore.activeWorkout) return;
        const newEntry: WorkoutEntry = {
            id: generateUUID(),
            exerciseId,
            exerciseName,
            sets: [],
        };
        storeActions.save({
            ...globalStore,
            activeWorkout: {
                ...globalStore.activeWorkout,
                entries: [...globalStore.activeWorkout.entries, newEntry],
            },
        });
    },

    addSetToEntry: (entryId: string, data: { weight?: number; reps?: number; durationSeconds?: number; distanceKm?: number }) => {
        if (!globalStore.activeWorkout) return;
        const newWorkout = { ...globalStore.activeWorkout };
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

        storeActions.save({ ...globalStore, activeWorkout: newWorkout });
    },

    updateWorkoutName: (name: string) => {
        if (!globalStore.activeWorkout) return;
        storeActions.save({
            ...globalStore,
            activeWorkout: { ...globalStore.activeWorkout, name },
        });
    },

    undoLastSet: () => {
        if (!globalStore.activeWorkout || globalStore.activeWorkout.entries.length === 0) return;
        const newWorkout = { ...globalStore.activeWorkout };
        for (let i = newWorkout.entries.length - 1; i >= 0; i--) {
            const entry = newWorkout.entries[i];
            if (entry.sets.length > 0) {
                entry.sets.pop();
                break;
            }
        }
        newWorkout.totalSets = newWorkout.entries.reduce((sum, e) => sum + e.sets.length, 0);
        newWorkout.totalVolume = newWorkout.entries.reduce((sum, e) => {
            return sum + e.sets.reduce((esum, s) => esum + ((s.weight || 0) * (s.reps || 1)), 0);
        }, 0);
        storeActions.save({ ...globalStore, activeWorkout: newWorkout });
    },

    finishWorkout: () => {
        if (!globalStore.activeWorkout) return;
        const finishedWorkout = {
            ...globalStore.activeWorkout,
            endAt: new Date().toISOString(),
        };
        storeActions.save({
            ...globalStore,
            activeWorkout: null,
            history: [finishedWorkout, ...globalStore.history],
        });
    },

    discardActiveWorkout: () => {
        storeActions.save({ ...globalStore, activeWorkout: null });
    },

    updateUser: (user: UserProfile) => {
        storeActions.save({ ...globalStore, user });
    },

    incrementCounter: (type: "squats" | "abs", count: number) => {
        if (!globalStore.activeWorkout) return;
        storeActions.save({
            ...globalStore,
            activeWorkout: {
                ...globalStore.activeWorkout,
                [type === "squats" ? "squatsCount" : "absCount"]: (globalStore.activeWorkout[type === "squats" ? "squatsCount" : "absCount"] || 0) + count
            }
        });
    },
};

export function useStore() {
    const [store, setLocalStore] = useState<AppStore>(globalStore);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const logged = localStorage.getItem("placogym_logged") === "true";
        if (saved) {
            globalStore = JSON.parse(saved);
            setLocalStore(globalStore);
        }
        setIsLogged(logged);
        setIsInitialized(true);

        const listener = (newStore: AppStore) => setLocalStore(newStore);
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    const login = (email: string) => {
        localStorage.setItem("placogym_logged", "true");
        setIsLogged(true);
    };

    const getLastSessionData = (exerciseId: string) => {
        for (const workout of store.history) {
            const entry = workout.entries.find(e => e.exerciseId === exerciseId);
            if (entry && entry.sets.length > 0) {
                return entry.sets[entry.sets.length - 1];
            }
        }
        return null;
    };

    return {
        store,
        isInitialized,
        isLogged,
        login,
        getLastSessionData,
        ...storeActions
    };
}
