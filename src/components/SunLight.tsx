import { useRef } from "react";
import RotatingEnvironment from "./RotatingEnviroment";

export function SunLight(){
    const lightRef = useRef<any>(null);
    const targetRef = useRef<any>(null);

    return (
        <>
            <ambientLight color={'white'} intensity={.0} />
            <RotatingEnvironment/>
            <directionalLight 
                ref={lightRef} 
                position={[.3,6,-18]}
                intensity={10}
                castShadow
                color={'white'}
                shadow-radius={5}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.1}
                shadow-camera-far={100}
                shadow-camera-left={-40}
                shadow-camera-right={30}
                shadow-camera-top={50}
                shadow-camera-bottom={0}
                shadow-bias={-.01}
                
            />
            <object3D ref={targetRef} position={[0,0,0]}/>
        </>
    )
}

