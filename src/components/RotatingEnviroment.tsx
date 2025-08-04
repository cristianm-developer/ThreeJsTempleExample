import { useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { RGBELoader } from "three-stdlib";
import { useEffect } from "react";
import { EquirectangularReflectionMapping } from "three";

export default function RotatingEnvironment() {
  const { scene } = useThree();
  const texture = useLoader(RGBELoader, import.meta.env.BASE_URL + 'assets/hdri/hdri.hdr');

  useEffect(() => {
    texture.mapping = EquirectangularReflectionMapping;
    texture.rotation = 0;
    texture.center.set(0.5, 0.5); 
    scene.environment = texture;
    scene.background = texture;
  }, [texture]);


  return null;
}
