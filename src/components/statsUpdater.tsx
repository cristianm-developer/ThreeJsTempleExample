import { useFrame } from "@react-three/fiber"
import type { RefObject } from "react";


export const StatsUpdater = ({statsRef}:{statsRef:RefObject<any>}) => {
    useFrame(() => {
        if (statsRef.current)
            statsRef.current.update();
    });

    return null;
}