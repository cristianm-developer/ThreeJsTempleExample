import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export function FrameLimiter(){
    const {invalidate} = useThree();
    const ref = useRef<number|null>(null);

    useEffect(() => {
        let last = 0;
        function loop(now: number){
            if(now - last >= 1000 / 28){
                last = now;
                invalidate();
            }
            ref.current = requestAnimationFrame(loop);
        }
        ref.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(ref.current!);
    }, [invalidate]);

    return null;
}