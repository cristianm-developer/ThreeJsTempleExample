
declare module 'screen-space-reflections' {
  import { Scene, Camera } from 'three';
  import { Effect } from 'postprocessing';

  interface SSROptions {
    temporalResolve?: boolean;
    resolutionScale?: number;
    rayDistance?: number;
    intensity?: number;
    thickness?: number;
    maxDepthDifference?: number;
    MAX_STEPS?: number;
    NUM_BINARY_SEARCH_STEPS?: number;
    blurMix?: number;
    blurSharpness?: number;
    USE_MRT?: boolean;
    USE_NORMALMAP?: boolean;
    USE_ROUGHNESSMAP?: boolean;
    [key: string]: any;
  }

  export class SSREffect {
    constructor(scene: Scene, camera: Camera, options?: SSROptions);
    setSize(width: number, height: number): void;
  }
}
