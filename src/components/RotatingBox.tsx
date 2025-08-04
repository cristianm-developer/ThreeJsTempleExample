import { useFrame } from "@react-three/fiber";
import { useRef } from "react";


function RotatingBox(){
    const meshRef = useRef<any>(null);

    useFrame(() => {
        if(meshRef.current){
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef} position={[0,0,0]}>
            <boxGeometry args={[1,1,1]} />
            <meshStandardMaterial color="orange"/>
        </mesh>
    )

}

export default RotatingBox;