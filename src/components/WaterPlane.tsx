import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { Color, PlaneGeometry, RepeatWrapping, Texture, TextureLoader, Vector2 } from "three";
import { Water } from "three/examples/jsm/objects/Water.js";


interface RippleItem {
    origin: { x: number, y: number },
    startTime: number,
    lifeTime: number,
    speed: number,
    delay: number,
}

function useCreateWater(waterNormals: Texture, maxRipples: number) {
    const waterRef = useRef<any>(null);
    const { scene } = useThree();

    useEffect(() => {
        waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
        const waterGeometry = new PlaneGeometry(80, 80);
        const water = new Water(waterGeometry, {
            textureWidth: 2048,
            textureHeight: 2048,
            waterNormals,
            sunDirection: scene.children.find((obj) => obj.type === "DirectionalLight")?.position || undefined,
            distortionScale: .1,
            alpha: .9,
            fog: scene.fog !== undefined,
            sunColor: new Color(1, 0, .7)
        });

        water.rotation.x = -Math.PI / 2;
        water.position.set(0, -0.001, 90);
        waterRef.current = water;

        water.material.transparent = true;
        water.material.depthWrite = true;

        setWavesToShader(waterRef, maxRipples);

        scene.add(water);

        return () => {
            scene.remove(water);
            water.geometry.dispose();
            water.material.dispose();
        }
    }, [scene, waterNormals]);

    return waterRef;
}

function setWavesToShader(waterRef: RefObject<Water>, maxActivesRipples: number) {
    const material = waterRef.current.material;

    const generateStaticWave = (
        waveCount: number,
        interval: number,
        speed: number,
        lifeTime: number,
        origin: { x: number, y: number }
    ) => {

        return Array.from({ length: waveCount }, (_, k) => ({
            origin,
            startTime: 0,
            lifeTime,
            speed,
            delay: k * interval
        }));
    }

    const staticWavesItem = [
        ...generateStaticWave(
            6,
            0.25,
            1.2,
            1.0,
            { x: -3.9, y: 77 },
        ),
        ...generateStaticWave(
            4,
            0.5,
            1.7,
            1.0,
            { x: -8.4, y: 73.1 },
        ),
        ...generateStaticWave(
            4,
            0.5,
            1.5,
            1.0,
            { x: -8.1, y: 67.4 },
        ),
        ...generateStaticWave(
            4,
            0.5,
            1.5,
            1.0,
            { x: -7.8, y: 61.4 },
        ),
        ...generateStaticWave(
            4,
            0.5,
            1.5,
            1.0,
            { x: -0.8, y: 67.4 },
        ),
        ...generateStaticWave(
            4,
            0.5,
            1.5,
            1.0,
            { x: 5.9, y: 61.2 },
        ),
        ...generateStaticWave(
            4,
            0.5,
            1.5,
            1.0,
            { x: 6.1, y: 67.2 },
        ),
        ...generateStaticWave(
            4,
            0.5,
            1.5,
            1.0,
            { x: 6.5, y: 73.2 },
        ),

    ];


    material.uniforms.uStaticWaves = {
        value: staticWavesItem
    }

    material.uniforms.uRipples = {
        value: Array.from({ length: maxActivesRipples }, () => ({
            origin: new Vector2(0, 0),
            startTime: -Infinity,
            lifeTime: 0,
            speed: 0,
            delay: 0
        }))
    }


    waterRef.current.material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader
            .replaceAll(
                'distance',
                'innerDistance'
            )
            .replace(
                '#include <common>',
                `#include <common>

                struct RippleItem {
                    vec2 origin;
                    float startTime;
                    float lifeTime;
                    float speed;
                    float delay;
                };
                
                #define NUM_STATIC_WAVES ${material.uniforms.uStaticWaves.value.length}
                uniform RippleItem uStaticWaves[NUM_STATIC_WAVES];
                
                #define MAX_RIPPLES ${maxActivesRipples}
                uniform RippleItem uRipples[MAX_RIPPLES];         

                float calcRipple(
                    RippleItem ripple,
                    bool isRecursive
                ){
                    float currentLife;

                    if(ripple.startTime < 0.0){                
                        return 0.0;
                    }

                    if(isRecursive) {
                        float interval = ripple.lifeTime + ripple.delay;
                        currentLife = mod(time - (ripple.startTime + ripple.delay), interval);
                    } else {
                        currentLife = time - (ripple.startTime + ripple.delay);    
                    }

                    if(currentLife < 0.0 || currentLife > ripple.lifeTime) {
                        return 0.0;
                    }

                    float dist = distance(worldPosition.xz, ripple.origin);

                    float wavePosition = currentLife * ripple.speed;           

                    float decay = 1.0 - (currentLife / ripple.lifeTime);
                    float pulse = smoothstep(wavePosition, wavePosition + 0.1, dist) - smoothstep(wavePosition + 0.1, wavePosition + 0.2, dist);
                    
                    return pulse * decay;
                }

                `
            )
            .replace(
                'gl_FragColor = vec4( outgoingLight, alpha );',
                `               
                    float waveIntensity = 0.0;

                    for (int i = 0; i < NUM_STATIC_WAVES; i++){
                        waveIntensity += calcRipple(uStaticWaves[i], true);
                    }

                    for(int i = 0; i < MAX_RIPPLES; i++){
                        waveIntensity += calcRipple(uRipples[i], false);
                    }
                    
                    vec3 waveColor = vec3(1.0, 1.0, 1.0);

                    waveIntensity = mix(0.0, 0.15, waveIntensity);
                    waveIntensity = min(waveIntensity, 0.15);

                    vec3 finalColor = mix(outgoingLight, waveColor, waveIntensity);

                    float cameraDistance = distance(worldPosition.xyz, cameraPosition.xyz);
                    float fadeFactor = smoothstep(0.0, 33.0, cameraDistance);

                    vec3 mixedColor = mix(finalColor, vec3(0.7,0.6,0.7), fadeFactor);

                    gl_FragColor = vec4( mixedColor, alpha );
                `
            );


        waterRef.current.material.needsUpdate = true;
    }



}


function useAnimateWater(waterRef: React.RefObject<Water>, waveSpeed: number) {
    useFrame(() => {
        if (waterRef.current)
            waterRef.current.material.uniforms.time.value += waveSpeed;
    })
}

function useRippleOnMouse(waterRef: RefObject<Water>, maxRipples: number) {
    const ripples = useRef<RippleItem[]>([]);
    const lastRippleTime = useRef(0);
    const delayBetweenWaves = .001;

    const onPointerMove = (event: any) => {
        const point = event.point;
        const now = waterRef.current.material.uniforms.time.value;

        if (now - lastRippleTime.current < delayBetweenWaves)
            return;

        ripples.current.push({
            origin: { x: point.x, y: point.z },
            startTime: now,
            lifeTime: .5,
            speed: 1.0,
            delay: 0.0
        });

        if (ripples.current.length > maxRipples)
            ripples.current.shift();

        lastRippleTime.current = now;
    }

    return {
        ripples, onPointerMove
    }

}

function useUpdateRipplesUniform(waterRef: RefObject<Water>, ripples: RefObject<RippleItem[]>, maxActivesRipples: number) {
    useFrame(() => {
        if (!waterRef.current)
            return;

        const material = waterRef.current.material;
        if (!material.uniforms)
            return;


        const now = waterRef.current.material.uniforms.time.value;

        const aliveRipples = ripples.current.filter(r => now - r.startTime <= r.lifeTime);
        ripples.current = aliveRipples;

        const newRipplesUniformValue = [];
        ripples.current.forEach(r => {
            newRipplesUniformValue.push({
                origin: r.origin,
                startTime: r.startTime,
                lifeTime: r.lifeTime,
                speed: r.speed,
                delay: r.delay
            });
        });

        while (newRipplesUniformValue.length < maxActivesRipples) {
            newRipplesUniformValue.push({
                origin: new Vector2(0),
                startTime: -Infinity,
                lifeTime: 0,
                speed: 0,
                delay: 0
            })
        }
        if (!material.uniforms.uRipples) {
            material.uniforms.uRipples = { value: newRipplesUniformValue };
        } else {
            material.uniforms.uRipples.value = newRipplesUniformValue;
        }

    });
}

export default function WaterPlane() {

    const waterNormals = useLoader(TextureLoader, import.meta.env.BASE_URL + 'assets/textures/water_normal2.jpg');
    const maxRipples = 50;
    const waterRef = useCreateWater(waterNormals, maxRipples);
    useAnimateWater(waterRef, .005);

    const { onPointerMove, ripples } = useRippleOnMouse(waterRef, maxRipples);
    useUpdateRipplesUniform(waterRef, ripples, maxRipples);

    return waterRef.current
        ? <primitive
            object={waterRef.current}
            onPointerMove={onPointerMove}

        />
        : null
}