import { useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { RGBELoader } from "three-stdlib";
import { useEffect, useRef } from "react";
import { EquirectangularReflectionMapping } from "three";

export default function RotatingEnvironment() {
  const { scene } = useThree();
  const texture = useLoader(RGBELoader, import.meta.env.BASE_URL + 'assets/hdri/hdri.hdr');
  const rotation = useRef(0);

  useEffect(() => {
    texture.mapping = EquirectangularReflectionMapping;
    texture.rotation = 0;
    texture.center.set(0.5, 0.5); 
    scene.environment = texture;
    scene.background = texture;
  }, [texture]);

  useFrame((_, delta) => {
    rotation.current += delta * 5.1;
    texture.rotation = rotation.current;
  });

  return null;
}
