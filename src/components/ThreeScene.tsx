import { Canvas } from '@react-three/fiber'
import { Box } from './Box'
import { OrbitControls } from '@react-three/drei'

export function ThreeScene() {
  return (
    <Canvas className='border-primary border rounded-md'>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <OrbitControls />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
