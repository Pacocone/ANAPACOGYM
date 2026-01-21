import { Exercise } from "./data/exercises";

export interface Set {
    id: string;
    weight?: number;
    reps?: number;
    durationSeconds?: number;
    distanceKm?: number;
    restSeconds?: number;
    completedAt: string;
}

export interface WorkoutEntry {
    id: string;
    exerciseId: string;
    exerciseName: string;
    sets: Set[];
}

export interface Workout {
    id: string;
    name: string;
    startAt: string;
    endAt?: string;
    warmupSeconds: number;
    entries: WorkoutEntry[];
    totalVolume: number;
    totalSets: number;
    squatsCount: number;
    absCount: number;
}

export interface UserProfile {
    birthday: string; // ISO format
    heightCm: number;
    weightKg: number;
    units: "kg" | "lbs";
    voiceEnabled?: boolean;
    audioFeedbackEnabled?: boolean;
}

export interface AppStore {
    user: UserProfile;
    activeWorkout: Workout | null;
    history: Workout[];
}
