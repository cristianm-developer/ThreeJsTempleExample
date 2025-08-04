import { useFrame } from "@react-three/fiber";
import { useRef } from "react"
import { PointLight } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import Color4 from "three/src/renderers/common/Color4.js";

const MinIntensity = 0;
const MaxIntensity = 100;
const AnimationSpeed = 5;

export function AdditionalLight({isHovered}:{isHovered: boolean}){

    const lightRef1 = useRef<PointLight>(null);
    const lightRef2 = useRef<PointLight>(null);

    useFrame((_, delta) => {
        if(lightRef1.current && lightRef2.current){
            const targetIntensity = isHovered ? MaxIntensity : MinIntensity;

            [lightRef1.current, lightRef2.current].forEach(e => {
                e.intensity = lerp(e.intensity, targetIntensity, delta * AnimationSpeed)
            });
        }
    });
    

    return <>
        <pointLight                
            position={[-4,1.8,78.5]}
            color={new Color4(1,0,0.5,1)}     
            intensity={MinIntensity}
            distance={10}
            ref={lightRef1}
            />
        <pointLight                
            position={[-1.5,3.2,78]}
            color={new Color4(1,0,0.5,1)}
            intensity={MinIntensity}
            distance={10}
            ref={lightRef2}
        />
    </>
    
}