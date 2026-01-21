import { EXERCISES, Exercise } from "./data/exercises";

export interface ParsedCommand {
    intent: "START_WORKOUT" | "FINISH_WORKOUT" | "SET_WORKOUT_NAME" | "ADD_EXERCISE" | "ADD_SET" | "UNDO" | "DELETE_EXERCISE" | "SUMMARY" | "REST" | "WARMUP" | "COUNTER" | "STAY" | "CONFIRM" | "REJECT" | "UNKNOWN";
    params?: any;
    raw: string;
}

const SPANISH_NUMBERS: Record<string, number> = {
    "cero": 0, "un": 1, "uno": 1, "una": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5, "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10,
    "once": 11, "doce": 12, "trece": 13, "catorce": 14, "quince": 15, "dieciséis": 16, "diecisiete": 17, "dieciocho": 18, "diecinueve": 19, "veinte": 20,
    "veintiuno": 21, "veintidós": 22, "veintitrés": 23, "veinticuatro": 24, "veinticinco": 25, "treinta": 30, "cuarenta": 40, "cincuenta": 50, "sesenta": 60, "setenta": 70, "ochenta": 80, "noventa": 90, "cien": 100
};

export class VoiceCommandParser {
    private static parseNumber(text: string): number | null {
        const clean = text.toLowerCase().trim()
            .replace(",", ".")
            .replace(/kilos?|kg|kilogramos?|reps?|repeticiones?|series?/g, "")
            .trim();

        if (!isNaN(parseFloat(clean))) return parseFloat(clean);

        // Support "uno", "diez", "setenta y cinco"
        let total = 0;
        const words = clean.split(/\s+/);

        if (words.length === 3 && words[1] === "y") {
            const v1 = SPANISH_NUMBERS[words[0]];
            const v2 = SPANISH_NUMBERS[words[2]];
            if (v1 !== undefined && v2 !== undefined) return v1 + v2;
        }

        if (words.length === 1) {
            return SPANISH_NUMBERS[words[0]] ?? null;
        }

        return null;
    }

    private static fuzzyMatchExercise(text: string): Exercise | null {
        const clean = text.toLowerCase().trim();
        if (clean.length < 3) return null;

        // 1. Direct match in name
        let found = EXERCISES.find(ex => ex.name.toLowerCase().includes(clean));
        if (found) return found;

        // 2. Direct match in keywords
        found = EXERCISES.find(ex => ex.searchKeywords.some(k => k.toLowerCase().includes(clean)));
        if (found) return found;

        // 3. Common aliases/short names
        const aliases: Record<string, string> = {
            "banca": "Olympic Flat Bench",
            "prensa": "Leg Press",
            "extensiones": "Leg Extension",
            "curl biceps": "Arm Curl",
            "jalon": "Lat Machine",
            "remo": "Low Row",
            "hombro": "Shoulder Press",
            "abdominales": "Abdominal Crunch",
            "vuelos": "db-lateral-raise",
            "patada": "Rear Kick"
        };

        for (const [alias, target] of Object.entries(aliases)) {
            if (clean.includes(alias)) {
                return EXERCISES.find(ex => ex.name.toLowerCase().includes(target.toLowerCase()) || ex.id === target) || null;
            }
        }

        return null;
    }

    static parse(text: string): ParsedCommand {
        const input = text.toLowerCase().trim();

        // 0. Confirmations / Rejections
        const confirmWords = ["sí", "si", "vale", "confirmar", "confirmado", "claro", "ok", "correcto", "venga"];
        const rejectWords = ["no", "mal", "cancela", "cancelar", "error", "corregir", "quitar"];

        if (confirmWords.includes(input)) return { intent: "CONFIRM", raw: text };
        if (rejectWords.includes(input)) return { intent: "REJECT", raw: text };

        // 1. Session Control
        if (input.includes("nuevo entrenamiento") || input.includes("empezar entrenamiento")) {
            return { intent: "START_WORKOUT", raw: text };
        }
        if (input.includes("terminar entrenamiento") || input.includes("guardar entrenamiento") || input.includes("finalizar entrenamiento")) {
            return { intent: "FINISH_WORKOUT", raw: text };
        }
        if (input.startsWith("nombre ") || input.startsWith("poner nombre ")) {
            const name = text.split(/nombre |poner nombre /i)[1];
            return { intent: "SET_WORKOUT_NAME", params: { name }, raw: text };
        }

        // 2. Corrections
        if (input === "deshacer" || input === "borrar última serie" || input === "eliminar última serie") {
            return { intent: "UNDO", raw: text };
        }

        // 3. Exercise Selection
        if (input.startsWith("ejercicio ") || input.startsWith("añadir ejercicio ")) {
            const search = text.split(/ejercicio |añadir ejercicio /i)[1];
            const ex = this.fuzzyMatchExercise(search);
            if (ex) return { intent: "ADD_EXERCISE", params: { exerciseId: ex.id, exerciseName: ex.name }, raw: text };
        }

        // 4. Sets / Patterns
        // "3 de 10 con 70" or "3 x 10 con 70" or "70 por 10"
        const setPattern = /(\d+(?:[.,]\d+)?|[\w\s]+)\s*(?:series? de|x|por)\s*(\d+(?:[.,]\d+)?|[\w\s]+)(?:\s*con\s*(\d+(?:[.,]\d+)?|[\w\s]+))?/i;
        const match = input.match(setPattern);

        if (match) {
            let v1 = this.parseNumber(match[1]);
            let v2 = this.parseNumber(match[2]);
            let v3 = match[3] ? this.parseNumber(match[3]) : null;

            // Logic for "3x10 con 70" -> sets: 3, reps: 10, weight: 70
            if (input.includes("con")) {
                return { intent: "ADD_SET", params: { sets: v1, reps: v2, weight: v3 }, raw: text };
            }
            // Logic for "70 por 10" -> weight: 70, reps: 10
            if (input.includes("por")) {
                return { intent: "ADD_SET", params: { weight: v1, reps: v2, sets: 1 }, raw: text };
            }
        }

        // 5. Counters
        if (input.includes("sentadillas") || input.includes("abdominales")) {
            const count = parseInt(input.replace(/\D/g, "")) || 1;
            const type = input.includes("sentadillas") ? "squats" : "abs";
            return { intent: "COUNTER", params: { type, count }, raw: text };
        }

        // Fallback search (if it's just an exercise name)
        const possibleEx = this.fuzzyMatchExercise(input);
        if (possibleEx && input.length > 3) {
            return { intent: "ADD_EXERCISE", params: { exerciseId: possibleEx.id, exerciseName: possibleEx.name }, raw: text };
        }

        return { intent: "UNKNOWN", raw: text };
    }
}
