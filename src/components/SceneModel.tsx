import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { Color, Mesh } from "three";


function SceneModel() {
    const { scene } = useGLTF(import.meta.env.BASE_URL + 'assets/glb/scene.glb');

    useEffect(() => {
        requestAnimationFrame(() => {

            scene.traverse(child => {
                if(child instanceof Mesh){                   

                    child.receiveShadow = true;
                    child.castShadow = true;

                    if(child.material.name === 'grain'){
                        child.material.color = new Color(1,1,1);
                    }

                    if(child.material.name === 'Material'){
                        child.material.color= new Color(1, 1, 1);
                    }
      
                }
            })
        })
    },[scene]);

    return <primitive object={scene} scale={1}/>
}

export default SceneModel;