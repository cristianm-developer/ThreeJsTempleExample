import { Canvas } from '@react-three/fiber'
import './App.css'
import { Suspense, useEffect, useRef, useState} from 'react'
import SceneModel from './components/SceneModel'
import { AdaptiveDpr } from '@react-three/drei'
import CustomCamera from './components/CustomCamera'
import { SunLight } from './components/SunLight'
import { RemoveEnviromentLighting } from './components/RemoveEnviromentLighting'
import { InnerLights } from './components/InnerLights'
import WaterPlane from './components/WaterPlane'
import { Subject } from './components/Subject'
import { AdditionalLight } from './components/AdditionalLight'
import Stats from 'stats.js';
import { StatsUpdater } from './components/statsUpdater'
import { FrameLimiter } from './components/frameLimiter'
import { ACESFilmicToneMapping } from 'three'

function App() {

  const [subjectIsHovered, setSubjectIsHovered] = useState(false);
  const statsRef = useRef<any>(null);

  useEffect(()=>{
    const stats = new Stats();
    stats.showPanel(0);
    //document.body.appendChild(stats.dom);
    statsRef.current = stats;
  },[])

   return (<>
      <Canvas  
        camera={{ position: [0, 0, 120], fov: 60 }}
        legacy={false}
        dpr={[1, 1.2]}
        frameloop='demand'
        gl= {{
          antialias: false,
          alpha: true,
          preserveDrawingBuffer: false,
          toneMapping: ACESFilmicToneMapping
        }}
        shadows
      >          
        <AdaptiveDpr pixelated />
        <FrameLimiter/>
        <StatsUpdater statsRef={statsRef}/>
        <SunLight/>
        <InnerLights/>
        <CustomCamera />
        <AdditionalLight isHovered={subjectIsHovered} />
        <Suspense fallback={null}>
          <SceneModel/>
          <Subject onHoverStart={() => setSubjectIsHovered(true)} onHoverEnd={() => setSubjectIsHovered(false)} />
        </Suspense>
        <RemoveEnviromentLighting/>
        <WaterPlane/>
      </Canvas>
      <div className='textWrapper'>
        <h1>Your brand here</h1>
        <h4>The limit is your Imagination</h4>
      </div>
      <footer>
        <a href='https://github.com/cristianm-developer/ThreeJsTempleExample'>Github</a>
      </footer>
   </>
   )
}

export default App
