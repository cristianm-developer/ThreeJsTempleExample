import { useHelper } from "@react-three/drei";
import { useRef } from "react"
import { Color, PointLightHelper } from "three";
import { degToRad } from "three/src/math/MathUtils.js";


export function InnerLights(){

    const pointLightRef = useRef<any>(null);
    useHelper(pointLightRef, PointLightHelper, 2, 'yellow');

    return (
        <>
            <ambientLight
                color={new Color(1,0,.6)}
                intensity={.5}
            />
            <rectAreaLight
                position={[0,0,100]}
                width={60}
                height={85}
                intensity={.8}
                color={'white'}
                rotation={[degToRad(90),degToRad(0),degToRad(0)]}        
            />
            <rectAreaLight
                position={[0,.25,100]}
                width={80}
                height={85}
                intensity={.2}
                color={'white'}
                rotation={[degToRad(-90),degToRad(0),degToRad(0)]}        
            />
            <pointLight                
                position={[-1,3,72]}
                color={'white'}
                intensity={0}
                distance={100}
            
            />
            <pointLight                
                position={[-.6,3,76]}
                color={'white'}
                intensity={90}
                distance={10}            
            />
             <pointLight            
                position={[-6.5,4,77]}
                color={'white'}
                intensity={28}
                distance={10}            
            />       
        </>
    )

}