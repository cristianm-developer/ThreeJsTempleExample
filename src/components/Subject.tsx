import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Color, CubeCamera, LinearMipMapLinearFilter, MeshPhysicalMaterial, RGBFormat, UnsignedByteType, WebGLCubeRenderTarget } from "three";
import { degToRad } from "three/src/math/MathUtils.js";



export function Subject({onHoverStart, onHoverEnd}: {onHoverStart: () => void, onHoverEnd: () => void}){
    const modelRef = useRef<any>(null);
    const {scene, gl} = useThree();
    const model = useGLTF('/assets/glb/subject.glb');

    const cubeRenderTarget = useRef(
        new WebGLCubeRenderTarget(1024, {
            format: RGBFormat,
            generateMipmaps: true,
            minFilter: LinearMipMapLinearFilter,
            type: UnsignedByteType
        })
    ).current;

    const cubeCamera = useRef(new CubeCamera(0.1, 200, cubeRenderTarget)).current;

    useFrame(() => {
        if(!modelRef.current) return;

        modelRef.current.visible = false;
        cubeCamera.position.copy(modelRef.current.position);
        cubeCamera.update(gl, scene);

        modelRef.current.visible = true;
    });

    const newMaterialGlass = (color: Color) =>  new MeshPhysicalMaterial({
        color,
        envMap: cubeRenderTarget.texture,
        envMapIntensity: 0.7,
        metalness: 0,
        roughness: 0.1,
        transmission: .6,
        thickness: .5,
        ior: 1.7,
        transparent: true,
        opacity: 1

    })

    return <primitive 
        object={model.scene} 
        ref={modelRef}
        scale={.8}
        rotation={[degToRad(0),degToRad(30),degToRad(0)]}
        position={[-3.9,2.97,77]}
        onPointerOver={() => {
            onHoverStart();
        }}
        onPointerOut={() => {
            onHoverEnd();
        }}
        onUpdate={(obj:any) => {
            obj.traverse((child:any) => {
                if(child.isMesh){
                    
                    const oldMaterial = child.material;
                    const name = oldMaterial?.name ?? '';1
                    const isGold = name == 'Dior_Center';                
                    
                    if(isGold){
                        const newMaterial = oldMaterial.clone();
                        newMaterial.envMap = cubeRenderTarget.texture;
                        newMaterial.envMapIntensity = 0.7;
                        newMaterial.metalness = isGold ? .9 : 0.5;
                        newMaterial.roughness = isGold ? .2 : 0;
                        child.material = newMaterial;
                    } 
                    
                    else
                        child.material = newMaterialGlass(oldMaterial.color);

                    


                    child.material.castShadow = true;
                    child.material.receiveShadow = true;                    

                }


            })
        }}
        />
}

