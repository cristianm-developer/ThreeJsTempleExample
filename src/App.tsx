import { Canvas } from '@react-three/fiber'
import './App.css'
import { Suspense, useState} from 'react'
import SceneModel from './components/SceneModel'
import { AdaptiveDpr } from '@react-three/drei'
import CustomCamera from './components/CustomCamera'
import { SunLight } from './components/SunLight'
import { RemoveEnviromentLighting } from './components/RemoveEnviromentLighting'
import { InnerLights } from './components/InnerLights'
import WaterPlane from './components/WaterPlane'
import { Subject } from './components/Subject'
import { ACESFilmicToneMapping } from 'three'
import RotatingEnviroment from './components/RotatingEnviroment'
import { AdditionalLight } from './components/AdditionalLight'

function App() {

  const [subjectIsHovered, setSubjectIsHovered] = useState(false);

   return (<>
      <Canvas  
        camera={{ position: [0, 0, 120], fov: 60 }}
        legacy={false}
        flat = {false}
        gl= {{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          toneMapping: ACESFilmicToneMapping,          
        }}
        shadows
      >          
        <SunLight/>
        <RotatingEnviroment/>
        <InnerLights/>
        <CustomCamera />
        <AdditionalLight isHovered={subjectIsHovered} />
        <Suspense fallback={null}>
          <SceneModel/>
          <Subject onHoverStart={() => setSubjectIsHovered(true)} onHoverEnd={() => setSubjectIsHovered(false)} />
        </Suspense>
        <RemoveEnviromentLighting/>
        <AdaptiveDpr pixelated />
        <WaterPlane/>
      </Canvas>
      <div className='textWrapper'>
        <h1>Your brand here</h1>
        <h4>The limit is your Imagination</h4>
      </div>
      <footer>
        <a href='https://github.com/'>Github</a>
      </footer>
   </>
   )
}

export default App
