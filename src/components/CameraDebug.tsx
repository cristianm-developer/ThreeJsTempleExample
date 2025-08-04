import { useFrame, useThree } from "@react-three/fiber";

interface CameraDebugProps {
  setPos: (pos: [number, number, number]) => void;
  setRot: (rot: [number, number, number]) => void;
}


function CameraDebug({setPos, setRot}: CameraDebugProps){
    const {camera} = useThree();
    useFrame(() => {
        setPos([camera.position.x, camera.position.y, camera.position.z]);
        setRot([camera.rotation.x, camera.rotation.y, camera.rotation.z]);
    })

    return(
        null
    )
}

export default CameraDebug;