import { useRef } from "react";

export function SunLight(){
    const lightRef = useRef<any>(null);
    const targetRef = useRef<any>(null);

    return (
        <>
            <ambientLight color={'white'} intensity={.0} />
            <directionalLight 
                ref={lightRef} 
                position={[.3,6,-18]}
                intensity={8}
                castShadow
                color={'white'}
                shadow-radius={5}
                shadow-mapSize-width={4048}
                shadow-mapSize-height={4048}
                shadow-camera-near={0.1}
                shadow-camera-far={100}
                shadow-camera-left={-40}
                shadow-camera-right={30}
                shadow-camera-top={50}
                shadow-camera-bottom={0}
                shadow-bias={-.002}
                
            />
            <object3D ref={targetRef} position={[0,0,0]}/>
        </>
    )
}

