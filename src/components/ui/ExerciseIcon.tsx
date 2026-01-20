import {
    Dumbbell,
    Footprints,
    Target,
    Zap,
    Circle,
    ArrowUpCircle,
    LucideProps
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ExerciseIcon({ type, className, size = 24 }: { type: string, className?: string, size?: number }) {
    const iconProps: LucideProps = { size, strokeWidth: 2.5 };

    const getIcon = () => {
        switch (type) {
            case "leg": return <Footprints {...iconProps} />;
            case "press": return <ArrowUpCircle {...iconProps} />;
            case "pull": return <Target {...iconProps} />;
            case "arm": return <Zap {...iconProps} />;
            case "core": return <Circle {...iconProps} />;
            case "dumbbell": return (
                <img
                    src="/images/machines/tg-dumbbell.png"
                    alt="Dumbbell"
                    className="object-contain"
                    style={{ width: size, height: size }}
                />
            );
            default: return <Dumbbell {...iconProps} />;
        }
    };

    return (
        <div className={cn(
            "relative flex items-center justify-center",
            className
        )}>
            {getIcon()}
        </div>
    );
}
