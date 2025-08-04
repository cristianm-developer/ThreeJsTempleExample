import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export function RemoveEnviromentLighting(){
    const {scene} = useThree();
    useEffect(() => {
        scene.environment = null;
    }, [scene])

    return null;
}