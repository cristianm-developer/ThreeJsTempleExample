import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { degToRad } from "three/src/math/MathUtils.js";


function CustomCamera(){
    const {camera} = useThree();

    
    useEffect(()=>{
        camera.rotation.set(degToRad(0), degToRad(0), degToRad(0));
    }, [camera]);

    return (
        <PerspectiveCamera 
            makeDefault
            fov={35}
            near={0.1}
            far={100}
            position={[-1,1.7,86]}
        />
    )
}

export default CustomCamera;